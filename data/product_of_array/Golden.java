class ProductOfArray {
    public int productOfArray(int[] nums) {
        int product = 1;
        for (int value : nums) {
            product *= value;
        }
        return product;
    }
}
