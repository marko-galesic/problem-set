class PalindromeLinkedList:
    def isPalindrome(self, head):
        if head is None or head.next is None:
            return True

        slow = head
        fast = head

        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next.next

        if fast is not None:
            slow = slow.next

        second_half = self._reverse(slow)
        first_half = head

        while second_half is not None:
            if first_half.val != second_half.val:
                return False
            first_half = first_half.next
            second_half = second_half.next

        return True

    def _reverse(self, head):
        prev = None
        current = head
        while current is not None:
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        return prev
