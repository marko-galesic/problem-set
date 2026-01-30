/*
 * ListNode class is provided as a utility class (see ListNode.java).
 * Structure:
 *   class ListNode {
 *       int val;
 *       ListNode next;
 *
 *       ListNode(int val) { this.val = val; }
 *       ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 *   }
 */
class DetectCycleInLinkedList {
    public boolean detectCycleInLinkedList(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                return true;
            }
        }
        return false;
    }
}
