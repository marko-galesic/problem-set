import { escapePythonString } from './utils.js';

function pythonString(value) {
  return `"${escapePythonString(value)}"`;
}

function pythonValueLiteral(value) {
  if (value === null || value === undefined) {
    return 'None';
  }
  if (Array.isArray(value)) {
    return `[${value.map(pythonValueLiteral).join(', ')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value).map(([key, val]) => {
      return `${pythonString(key)}: ${pythonValueLiteral(val)}`;
    });
    return `{${entries.join(', ')}}`;
  }
  if (typeof value === 'string') {
    return pythonString(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  }
  if (Number.isFinite(value)) {
    return String(value);
  }
  return 'None';
}

export default {
  extractInput: (testCase) => {
    return {
      author: testCase.author !== undefined ? testCase.author : '',
      title: testCase.title !== undefined ? testCase.title : ''
    };
  },

  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    if (!expected || typeof expected !== 'object') {
      return `${indent}${varName} = None\n`;
    }
    const sumByAuthor = Number.isFinite(expected.sumByAuthor) ? expected.sumByAuthor : 0;
    const countTitleMatches = Number.isFinite(expected.countTitleMatches) ? expected.countTitleMatches : 0;
    return `${indent}${varName} = {"sumByAuthor": ${sumByAuthor}, "countTitleMatches": ${countTitleMatches}}\n`;
  },

  generateSerializer: () => {
    return `def serialize_stats_object(value):
    if value is None:
        return "null"
    if not isinstance(value, dict):
        return "null"
    try:
        sum_val = int(value.get("sumByAuthor", 0) or 0)
    except Exception:
        sum_val = 0
    try:
        count_val = int(value.get("countTitleMatches", 0) or 0)
    except Exception:
        count_val = 0
    return "{\\"sumByAuthor\\":" + str(sum_val) + ",\\"countTitleMatches\\":" + str(count_val) + "}"
`;
  },

  generateInvocation: (parserVar) => {
    return `assert_requests_complete = setup_requests_mock(i)
author = get_test_author(i)
title = get_test_title(i)
actual = ${parserVar}.analyzeArticles(author, title)
assert_requests_complete()`;
  },

  generateInputHelpers: (testCases) => {
    const apiPagesList = testCases.map(tc => pythonValueLiteral(tc.apiPages || tc.pages || [])).join(',\n');
    const authors = testCases.map(tc => pythonValueLiteral(tc.author !== undefined ? tc.author : '')).join(',\n');
    const titles = testCases.map(tc => pythonValueLiteral(tc.title !== undefined ? tc.title : '')).join(',\n');

    return `API_BASE_URL = "https://example.com/articles"
API_PAGES = [
${apiPagesList.split('\n').map(line => `    ${line}`).join('\n')}
]

class MockResponse:
    def __init__(self, payload):
        self._payload = payload
        self.status_code = 200

    def json(self):
        return self._payload

def setup_requests_mock(index):
    try:
        import requests
    except Exception as exc:
        raise Exception("requests library is required for this challenge") from exc

    pages = API_PAGES[index] or []
    total_pages = 0
    if pages:
        try:
            total_pages = int(pages[0].get("total_pages", len(pages)))
        except Exception:
            total_pages = len(pages)

    called_pages = []

    def mock_get(url, params=None, **kwargs):
        if url != API_BASE_URL:
            raise Exception(f"requests.get called with unexpected URL: {url}")
        if not isinstance(params, dict) or "page" not in params:
            raise Exception("requests.get must be called with params={'page': N}")
        try:
            page_num = int(params.get("page"))
        except Exception:
            raise Exception("requests.get param 'page' must be an int")

        payload = None
        for page in pages:
            try:
                if int(page.get("page", -1)) == page_num:
                    payload = page
                    break
            except Exception:
                continue

        if payload is None:
            raise Exception(f"No mock payload for page {page_num}")

        called_pages.append(page_num)
        return MockResponse(payload)

    requests.get = mock_get

    def assert_requests_complete():
        expected_pages = list(range(1, total_pages + 1)) if total_pages else []
        missing = [page for page in expected_pages if page not in called_pages]
        if missing:
            raise Exception(f"Missing requests for pages: {missing}")

    return assert_requests_complete

def get_test_author(index):
    authors = [
${authors.split('\n').map(line => `        ${line}`).join('\n')}
    ]
    return authors[index]

def get_test_title(index):
    titles = [
${titles.split('\n').map(line => `        ${line}`).join('\n')}
    ]
    return titles[index]
`;
  },

  checkUserDefinedClasses: () => ({}),
  generateHelperClasses: () => '',
  getReturnType: () => 'object',
  getSerializerMethod: () => 'serialize_stats_object',
  getDefaultClassName: () => 'PaginatedArticleStats',
  preprocessTestCases: (testCases) => testCases,
  transformUserCode: (userCode) => {
    const requestsStub = `import sys
try:
    import requests  # noqa: F401
except Exception:
    class _RequestsStub:
        pass
    requests = _RequestsStub()
    sys.modules['requests'] = requests
`;
    return `${requestsStub}\n${userCode}`;
  }
};
