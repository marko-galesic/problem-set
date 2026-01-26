class RemoveNthNodeFromEndOfList {
  removeNthFromEnd(head, n) {
    if (!head) {
      return null;
    }
    const dummy = new ListNode(0, head);
    let fast = dummy;
    let slow = dummy;
    for (let i = 0; i < n; i++) {
      fast = fast.next;
    }
    while (fast && fast.next) {
      fast = fast.next;
      slow = slow.next;
    }
    if (slow.next) {
      slow.next = slow.next.next;
    }
    return dummy.next;
  }
}
