/**
 * Adapter for Paginated Article Stats challenge
 * Handles analyzeArticles(String author, String title) method
 */

const DEFAULT_CLASS_NAME = 'PaginatedArticleStats';

function escapeJavaString(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function buildExpectedMapCode(expected, indent = '        ', varName = 'expected') {
  if (!expected || typeof expected !== 'object') {
    return `${indent}Map<String, Integer> ${varName} = null;\n`;
  }
  const sumByAuthor = Number.isFinite(expected.sumByAuthor) ? expected.sumByAuthor : 0;
  const countTitleMatches = Number.isFinite(expected.countTitleMatches) ? expected.countTitleMatches : 0;
  return `${indent}Map<String, Integer> ${varName} = new HashMap<>();\n` +
    `${indent}${varName}.put("sumByAuthor", ${sumByAuthor});\n` +
    `${indent}${varName}.put("countTitleMatches", ${countTitleMatches});\n`;
}

export default {
  extractInput: (testCase) => {
    return {
      author: testCase.author !== undefined ? testCase.author : '',
      title: testCase.title !== undefined ? testCase.title : ''
    };
  },

  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedMapCode(expected, indent, varName);
  },

  generateSerializer: () => {
    return `    // Serialize a stats map to a canonical JSON-like string
    private static String serializeStatsObject(Object value) {
        if (value == null) return "null";
        if (!(value instanceof Map)) return "null";
        Map<?, ?> map = (Map<?, ?>) value;
        Object sumObj = map.get("sumByAuthor");
        Object countObj = map.get("countTitleMatches");
        int sumByAuthor = (sumObj instanceof Number) ? ((Number) sumObj).intValue() : 0;
        int countTitleMatches = (countObj instanceof Number) ? ((Number) countObj).intValue() : 0;
        return "{\\"sumByAuthor\\":" + sumByAuthor + ",\\"countTitleMatches\\":" + countTitleMatches + "}";
    }`;
  },

  generateInvocation: (parserVar) => {
    return `                    ${DEFAULT_CLASS_NAME}.Page[] apiPages = getApiPages(i);
                    ${DEFAULT_CLASS_NAME}.ApiClient.setProvider(new ${DEFAULT_CLASS_NAME}.ApiClient.PageProvider() {
                        public ${DEFAULT_CLASS_NAME}.Page fetchPage(int pageNum) {
                            if (apiPages == null) {
                                return null;
                            }
                            for (${DEFAULT_CLASS_NAME}.Page page : apiPages) {
                                if (page != null && page.page == pageNum) {
                                    return page;
                                }
                            }
                            return null;
                        }
                    });
                    String author = getTestAuthor(i);
                    String title = getTestTitle(i);
                    actual = ${parserVar}.analyzeArticles(author, title);`;
  },

  generateInputHelpers: (testCases) => {
    const buildArticleLiteral = (article) => {
      if (!article) {
        return 'null';
      }
      const id = Number.isFinite(article.id) ? article.id : 0;
      const title = escapeJavaString(article.title);
      const author = escapeJavaString(article.author);
      const numComments = Number.isFinite(article.num_comments) ? article.num_comments : 0;
      return `new ${DEFAULT_CLASS_NAME}.Article(${id}, "${title}", "${author}", ${numComments})`;
    };

    const buildPageLiteral = (page) => {
      if (!page) {
        return 'null';
      }
      const pageNum = Number.isFinite(page.page) ? page.page : 0;
      const totalPages = Number.isFinite(page.total_pages) ? page.total_pages : 0;
      const data = Array.isArray(page.data) ? page.data : [];
      const articles = data.map(buildArticleLiteral).join(', ');
      return `new ${DEFAULT_CLASS_NAME}.Page(${pageNum}, ${totalPages}, new ${DEFAULT_CLASS_NAME}.Article[] { ${articles} })`;
    };

    const pagesCases = testCases.map((tc, idx) => {
      const apiPages = Array.isArray(tc.apiPages) ? tc.apiPages : (Array.isArray(tc.pages) ? tc.pages : null);
      if (!Array.isArray(apiPages)) {
        return `        if (index == ${idx}) return null;`;
      }
      const pagesLiteral = apiPages.map(buildPageLiteral).join(', ');
      return `        if (index == ${idx}) return new ${DEFAULT_CLASS_NAME}.Page[] { ${pagesLiteral} };`;
    }).join('\n');

    const authorArray = testCases.map((tc) => {
      const author = escapeJavaString(tc.author !== undefined ? tc.author : '');
      return `            "${author}"`;
    }).join(',\n');

    const titleArray = testCases.map((tc) => {
      const title = escapeJavaString(tc.title !== undefined ? tc.title : '');
      return `            "${title}"`;
    }).join(',\n');

    return `    private static ${DEFAULT_CLASS_NAME}.Page[] getApiPages(int index) {
${pagesCases}
        return null;
    }

    private static String getTestAuthor(int index) {
        String[] authors = {
${authorArray}
        };
        return authors[index];
    }

    private static String getTestTitle(int index) {
        String[] titles = {
${titleArray}
        };
        return titles[index];
    }`;
  },

  checkUserDefinedClasses: () => {
    return {};
  },

  generateHelperClasses: () => {
    return `    static class Article {
        int id;
        String title;
        String author;
        int num_comments;

        Article(int id, String title, String author, int num_comments) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.num_comments = num_comments;
        }
    }

    static class Page {
        int page;
        int total_pages;
        Article[] data;

        Page(int page, int total_pages, Article[] data) {
            this.page = page;
            this.total_pages = total_pages;
            this.data = data;
        }
    }

    static class ApiClient {
        interface PageProvider {
            Page fetchPage(int pageNum);
        }

        private static PageProvider provider;

        static void setProvider(PageProvider providerInstance) {
            provider = providerInstance;
        }

        static Page fetchPage(int pageNum) {
            if (provider == null) {
                return null;
            }
            return provider.fetchPage(pageNum);
        }
    }

`;
  },

  getReturnType: () => 'Object',

  getSerializerMethod: () => 'serializeStatsObject',

  getDefaultClassName: () => DEFAULT_CLASS_NAME,

  preprocessTestCases: (testCases) => testCases,

  transformUserCode: (userCode) => userCode
};
