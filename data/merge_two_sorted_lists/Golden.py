class MergeTwoSortedLists:
    def mergeTwoLists(self, list1, list2):
        dummy = ListNode(0)
        current = dummy
        a, b = list1, list2
        while a and b:
            if a.val <= b.val:
                current.next = a
                a = a.next
            else:
                current.next = b
                b = b.next
            current = current.next
        current.next = a if a else b
        return dummy.next
