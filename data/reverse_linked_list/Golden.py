class ReverseLinkedList:
    def reverseList(self, head):
        prev = None
        current = head
        while current:
            nxt = current.next
            current.next = prev
            prev = current
            current = nxt
        return prev
