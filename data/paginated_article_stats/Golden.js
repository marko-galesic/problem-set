class PaginatedArticleStats {
  /*
   * Page and Article helper classes are provided.
   * Article fields: id, title, author, num_comments
   * Page fields: page, total_pages, data (Article[])
   */
  analyzeArticles(author, title) {
    let sumByAuthor = 0;
    let countTitleMatches = 0;
    let pageNum = 1;
    let totalPages = 1;

    while (pageNum <= totalPages) {
      const page = ApiClient.fetchPage(pageNum);
      if (page && Array.isArray(page.data)) {
        for (const article of page.data) {
          if (!article) continue;
          if (author !== null && author !== undefined && article.author === author) {
            sumByAuthor += Number(article.num_comments || 0);
          }
          if (title !== null && title !== undefined && article.title === title) {
            countTitleMatches += 1;
          }
        }
        totalPages = Math.max(totalPages, page.total_pages || totalPages);
      }
      pageNum += 1;
    }

    return {
      sumByAuthor,
      countTitleMatches
    };
  }
}
