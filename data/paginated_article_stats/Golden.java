import java.util.HashMap;
import java.util.Map;

class PaginatedArticleStats {
    /*
     * Page and Article helper classes are provided.
     * Article fields: id, title, author, num_comments
     * Page fields: page, total_pages, data (Article[])
     */
    public Map<String, Integer> analyzeArticles(String author, String title) {
        int sumByAuthor = 0;
        int countTitleMatches = 0;

        int pageNum = 1;
        int totalPages = 1;

        while (pageNum <= totalPages) {
            Page page = ApiClient.fetchPage(pageNum);
            if (page != null && page.data != null) {
                for (Article article : page.data) {
                    if (article == null) {
                        continue;
                    }
                    if (author != null && author.equals(article.author)) {
                        sumByAuthor += article.num_comments;
                    }
                    if (title != null && title.equals(article.title)) {
                        countTitleMatches++;
                    }
                }
                totalPages = Math.max(totalPages, page.total_pages);
            }
            pageNum++;
        }

        Map<String, Integer> result = new HashMap<>();
        result.put("sumByAuthor", sumByAuthor);
        result.put("countTitleMatches", countTitleMatches);
        return result;
    }
}
