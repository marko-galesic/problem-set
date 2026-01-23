import { createAdapter } from '../baseAdapter.js';

const DEFAULT_CLASS_NAME = 'PaginatedArticleStats';

function escapeJsString(value) {
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

function buildExpectedMapCode(expected, indent = '  ', varName = 'expected') {
  if (!expected || typeof expected !== 'object') {
    return `${indent}const ${varName} = null;\n`;
  }
  const sumByAuthor = Number.isFinite(expected.sumByAuthor) ? expected.sumByAuthor : 0;
  const countTitleMatches = Number.isFinite(expected.countTitleMatches) ? expected.countTitleMatches : 0;
  return `${indent}const ${varName} = { sumByAuthor: ${sumByAuthor}, countTitleMatches: ${countTitleMatches} };\n`;
}

export default createAdapter({
  extractInput: (testCase) => ({
    author: testCase.author !== undefined ? testCase.author : '',
    title: testCase.title !== undefined ? testCase.title : ''
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    return buildExpectedMapCode(expected, indent, varName);
  },
  generateSerializer: () => {
    return `function serializeStatsObject(value) {
  if (!value || typeof value !== "object") return "null";
  const sum = Number.isFinite(value.sumByAuthor) ? value.sumByAuthor : 0;
  const count = Number.isFinite(value.countTitleMatches) ? value.countTitleMatches : 0;
  return "{\\"sumByAuthor\\":" + sum + ",\\"countTitleMatches\\":" + count + "}";
}`;
  },
  generateInvocation: (parserVar) => {
    return `const apiPages = getApiPages(i);
          ApiClient.setProvider({
            fetchPage: (pageNum) => {
              if (!apiPages) return null;
              for (const page of apiPages) {
                if (page && page.page === pageNum) {
                  return page;
                }
              }
              return null;
            }
          });
          const author = getTestAuthor(i);
          const title = getTestTitle(i);
          actual = ${parserVar}.analyzeArticles(author, title);`;
  },
  generateInputHelpers: (testCases) => {
    const buildArticleLiteral = (article) => {
      if (!article) {
        return 'null';
      }
      const id = Number.isFinite(article.id) ? article.id : 0;
      const title = escapeJsString(article.title);
      const author = escapeJsString(article.author);
      const numComments = Number.isFinite(article.num_comments) ? article.num_comments : 0;
      return `new Article(${id}, "${title}", "${author}", ${numComments})`;
    };

    const buildPageLiteral = (page) => {
      if (!page) {
        return 'null';
      }
      const pageNum = Number.isFinite(page.page) ? page.page : 0;
      const totalPages = Number.isFinite(page.total_pages) ? page.total_pages : 0;
      const data = Array.isArray(page.data) ? page.data : [];
      const articles = data.map(buildArticleLiteral).join(', ');
      return `new Page(${pageNum}, ${totalPages}, [${articles}])`;
    };

    const pagesCases = testCases.map((tc, idx) => {
      const apiPages = Array.isArray(tc.apiPages) ? tc.apiPages : (Array.isArray(tc.pages) ? tc.pages : null);
      if (!Array.isArray(apiPages)) {
        return `  if (index === ${idx}) return null;`;
      }
      const pagesLiteral = apiPages.map(buildPageLiteral).join(', ');
      return `  if (index === ${idx}) return [${pagesLiteral}];`;
    }).join('\n');

    const authorArray = testCases.map((tc) => {
      const author = escapeJsString(tc.author !== undefined ? tc.author : '');
      return `    "${author}"`;
    }).join(',\n');

    const titleArray = testCases.map((tc) => {
      const title = escapeJsString(tc.title !== undefined ? tc.title : '');
      return `    "${title}"`;
    }).join(',\n');

    return `class Article {
  constructor(id, title, author, num_comments) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.num_comments = num_comments;
  }
}

class Page {
  constructor(page, total_pages, data) {
    this.page = page;
    this.total_pages = total_pages;
    this.data = data;
  }
}

class ApiClient {
  static setProvider(provider) {
    ApiClient.provider = provider;
  }
  static fetchPage(pageNum) {
    if (!ApiClient.provider) return null;
    return ApiClient.provider.fetchPage(pageNum);
  }
}
ApiClient.provider = null;

function getApiPages(index) {
${pagesCases}
  return null;
}

function getTestAuthor(index) {
  const authors = [
${authorArray}
  ];
  return authors[index];
}

function getTestTitle(index) {
  const titles = [
${titleArray}
  ];
  return titles[index];
}`;
  },
  getReturnType: () => 'object',
  getSerializerMethod: () => 'serializeStatsObject',
  getDefaultClassName: () => DEFAULT_CLASS_NAME
});
