class PalindromeLinkedList {
  isPalindrome(head) {
    if (!head || !head.next) {
      return true;
    }

    let slow = head;
    let fast = head;

    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }

    if (fast) {
      slow = slow.next;
    }

    let secondHalf = this.reverse(slow);
    let firstHalf = head;

    while (secondHalf) {
      if (firstHalf.val !== secondHalf.val) {
        return false;
      }
      firstHalf = firstHalf.next;
      secondHalf = secondHalf.next;
    }

    return true;
  }

  reverse(head) {
    let prev = null;
    let current = head;
    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    return prev;
  }
}
