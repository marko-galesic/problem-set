"""
Fetch paginated articles using requests.get and compute stats.

API:
- Base URL: https://example.com/articles
- Query param: page (1-indexed)

Example payload from requests.get(BASE_URL, params={"page": 1}).json():
{
  "page": 1,
  "total_pages": 2,
  "data": [
    { "id": 1, "title": "Intro to HTTP", "author": "alice", "num_comments": 5 },
    { "id": 2, "title": "Pagination Tips", "author": "bob", "num_comments": 3 }
  ]
}
"""
import requests

BASE_URL = "https://example.com/articles"

class PaginatedArticleStats:
    def analyzeArticles(self, author, title):
        return None
