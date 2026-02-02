import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class SearchSuggestionsSystem {
    private int lowerBound(String[] products, String prefix) {
        int lo = 0;
        int hi = products.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (products[mid].compareTo(prefix) < 0) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }

    public String[][] suggestedProducts(String[] products, String searchWord) {
        Arrays.sort(products);
        List<List<String>> result = new ArrayList<>();
        StringBuilder prefix = new StringBuilder();
        for (int i = 0; i < searchWord.length(); i += 1) {
            prefix.append(searchWord.charAt(i));
            String pref = prefix.toString();
            int start = lowerBound(products, pref);
            List<String> suggestions = new ArrayList<>();
            for (int j = start; j < products.length && suggestions.size() < 3; j += 1) {
                if (products[j].startsWith(pref)) {
                    suggestions.add(products[j]);
                } else {
                    break;
                }
            }
            result.add(suggestions);
        }
        String[][] out = new String[result.size()][];
        for (int i = 0; i < result.size(); i += 1) {
            List<String> row = result.get(i);
            out[i] = row.toArray(new String[0]);
        }
        return out;
    }
}
