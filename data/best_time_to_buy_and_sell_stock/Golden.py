class BestTimeToBuyAndSellStock:
    def maxProfit(self, prices):
        min_price = float('inf')
        best = 0
        for price in prices:
            if price < min_price:
                min_price = price
            else:
                best = max(best, price - min_price)
        return best
