import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

class MostStonesRemoved {
    private static class DSU {
        List<Integer> parent = new ArrayList<>();
        List<Integer> rank = new ArrayList<>();

        int add() {
            int id = parent.size();
            parent.add(id);
            rank.add(0);
            return id;
        }

        int find(int x) {
            int px = parent.get(x);
            if (px != x) {
                int root = find(px);
                parent.set(x, root);
            }
            return parent.get(x);
        }

        void union(int a, int b) {
            int ra = find(a);
            int rb = find(b);
            if (ra == rb) {
                return;
            }
            int rankA = rank.get(ra);
            int rankB = rank.get(rb);
            if (rankA < rankB) {
                parent.set(ra, rb);
            } else if (rankA > rankB) {
                parent.set(rb, ra);
            } else {
                parent.set(rb, ra);
                rank.set(ra, rankA + 1);
            }
        }
    }

    public int removeStones(int[][] stones) {
        DSU dsu = new DSU();
        Map<String, Integer> ids = new HashMap<>();
        Set<Integer> used = new HashSet<>();

        for (int[] stone : stones) {
            String rowKey = "r" + stone[0];
            String colKey = "c" + stone[1];
            int rowId = ids.computeIfAbsent(rowKey, k -> dsu.add());
            int colId = ids.computeIfAbsent(colKey, k -> dsu.add());
            dsu.union(rowId, colId);
            used.add(rowId);
            used.add(colId);
        }

        Set<Integer> roots = new HashSet<>();
        for (int id : used) {
            roots.add(dsu.find(id));
        }
        return stones.length - roots.size();
    }
}
