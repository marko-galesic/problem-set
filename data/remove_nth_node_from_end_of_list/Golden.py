class RemoveNthNodeFromEndOfList:
    def removeNthFromEnd(self, head, n):
        if head is None:
            return None
        dummy = ListNode(0, head)
        fast = dummy
        slow = dummy
        for _ in range(n):
            fast = fast.next
        while fast is not None and fast.next is not None:
            fast = fast.next
            slow = slow.next
        if slow.next is not None:
            slow.next = slow.next.next
        return dummy.next
