import requests

BASE_URL = "https://example.com/articles"


class PaginatedArticleStats:
    def analyzeArticles(self, author, title):
        sum_by_author = 0
        count_title_matches = 0

        page_num = 1
        total_pages = 1

        while page_num <= total_pages:
            response = requests.get(BASE_URL, params={"page": page_num})
            payload = response.json() if response is not None else {}
            if not isinstance(payload, dict):
                payload = {}

            data = payload.get("data")
            if isinstance(data, list):
                for article in data:
                    if not isinstance(article, dict):
                        continue
                    if author is not None and article.get("author") == author:
                        sum_by_author += int(article.get("num_comments", 0) or 0)
                    if title is not None and article.get("title") == title:
                        count_title_matches += 1

            try:
                total_pages_value = int(payload.get("total_pages", total_pages) or total_pages)
            except Exception:
                total_pages_value = total_pages
            total_pages = max(total_pages_value, page_num)
            page_num += 1

        return {
            "sumByAuthor": sum_by_author,
            "countTitleMatches": count_title_matches
        }
