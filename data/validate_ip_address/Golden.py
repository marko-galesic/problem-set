class ValidateIPAddress:
    def validIPAddress(self, queryIP):
        if '.' in queryIP:
            parts = queryIP.split('.')
            if len(parts) != 4:
                return 'Neither'
            for part in parts:
                if part == '':
                    return 'Neither'
                if len(part) > 1 and part[0] == '0':
                    return 'Neither'
                if not part.isdigit():
                    return 'Neither'
                val = int(part)
                if val < 0 or val > 255:
                    return 'Neither'
            return 'IPv4'
        if ':' in queryIP:
            parts = queryIP.split(':')
            if len(parts) != 8:
                return 'Neither'
            hex_digits = set('0123456789abcdefABCDEF')
            for part in parts:
                if len(part) < 1 or len(part) > 4:
                    return 'Neither'
                if any(ch not in hex_digits for ch in part):
                    return 'Neither'
            return 'IPv6'
        return 'Neither'
