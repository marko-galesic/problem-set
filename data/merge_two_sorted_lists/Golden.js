class MergeTwoSortedLists {
  mergeTwoLists(list1, list2) {
    const dummy = new ListNode(0);
    let tail = dummy;
    let a = list1;
    let b = list2;
    while (a && b) {
      if (a.val <= b.val) {
        tail.next = a;
        a = a.next;
      } else {
        tail.next = b;
        b = b.next;
      }
      tail = tail.next;
    }
    tail.next = a || b;
    return dummy.next;
  }
}
