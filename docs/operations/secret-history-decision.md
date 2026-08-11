# Historical secret decision

## Decision

On 2026-08-11, the repository owner chose not to rewrite or force-push Git
history at this time.

The current branch removes .cursor/mcp.json from the tracked tree and is
covered by current-tree secret scanning. The historical Render bearer
credential remains treated as compromised until it is rotated by the owner.

## Consequences

- Existing historical Git objects may retain the old credential until a future,
  explicitly approved coordinated rewrite.
- No branch history is rewritten as part of the A-minus cleanup branch.
- The current protected deployment path must not use the historical Render
  credential.
- The detailed future operation remains in
  docs/operations/secret-history-remediation.md.

## Revisit trigger

Revisit this decision after the credential has been rotated and all active
branch owners approve a maintenance window.
