class ValidateIPAddress {
  validIPAddress(queryIP) {
    if (queryIP.includes('.')) {
      const parts = queryIP.split('.');
      if (parts.length !== 4) {
        return 'Neither';
      }
      for (const part of parts) {
        if (part.length === 0) {
          return 'Neither';
        }
        if (part.length > 1 && part[0] === '0') {
          return 'Neither';
        }
        if (!/^\d+$/.test(part)) {
          return 'Neither';
        }
        const val = Number(part);
        if (val < 0 || val > 255) {
          return 'Neither';
        }
      }
      return 'IPv4';
    }
    if (queryIP.includes(':')) {
      const parts = queryIP.split(':');
      if (parts.length !== 8) {
        return 'Neither';
      }
      for (const part of parts) {
        if (part.length < 1 || part.length > 4) {
          return 'Neither';
        }
        if (!/^[0-9a-fA-F]+$/.test(part)) {
          return 'Neither';
        }
      }
      return 'IPv6';
    }
    return 'Neither';
  }
}
