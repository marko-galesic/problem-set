class BestTimeToBuyAndSellStock {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length < 2) {
            return 0;
        }
        
        int minPrice = prices[0];
        int maxProfit = 0;
        
        for (int i = 1; i < prices.length; i++) {
            // Calculate profit if we sell today
            int profit = prices[i] - minPrice;
            
            // Update max profit if current profit is better
            if (profit > maxProfit) {
                maxProfit = profit;
            }
            
            // Update minimum price if current price is lower
            if (prices[i] < minPrice) {
                minPrice = prices[i];
            }
        }
        
        return maxProfit;
    }
}
