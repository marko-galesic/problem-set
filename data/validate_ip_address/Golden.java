import java.util.*;

class ValidateIPAddress {
    public String validIPAddress(String queryIP) {
        if (queryIP.contains(".")) {
            String[] parts = queryIP.split("\\.", -1);
            if (parts.length != 4) {
                return "Neither";
            }
            for (String part : parts) {
                if (part.isEmpty()) {
                    return "Neither";
                }
                if (part.length() > 1 && part.charAt(0) == '0') {
                    return "Neither";
                }
                for (char c : part.toCharArray()) {
                    if (!Character.isDigit(c)) {
                        return "Neither";
                    }
                }
                int val = Integer.parseInt(part);
                if (val < 0 || val > 255) {
                    return "Neither";
                }
            }
            return "IPv4";
        }
        if (queryIP.contains(":")) {
            String[] parts = queryIP.split(":", -1);
            if (parts.length != 8) {
                return "Neither";
            }
            String hex = "0123456789abcdefABCDEF";
            for (String part : parts) {
                if (part.length() < 1 || part.length() > 4) {
                    return "Neither";
                }
                for (char c : part.toCharArray()) {
                    if (hex.indexOf(c) < 0) {
                        return "Neither";
                    }
                }
            }
            return "IPv6";
        }
        return "Neither";
    }
}
