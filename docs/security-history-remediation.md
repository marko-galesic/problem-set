# Security history remediation

The former .cursor/mcp.json credential is removed from the active branch.
Treat the old credential as compromised and revoke it at its provider.
Coordinate any git history rewrite with the quick launch branch before force pushing shared refs.
