class ReverseString {
    public String reverseString(String s) {
        if (s == null) {
            return "";
        }
        return new StringBuilder(s).reverse().toString();
    }
}
