# Secret-history remediation

The tracked .cursor/mcp.json file was removed from the current branch, and
current-tree secret scanning is clean. Its historical Render bearer credential
must still be treated as compromised.

## Prerequisites

1. Revoke and replace the Render credential through Render before rewriting
   Git history.
2. Agree a maintenance window with every active branch owner, including the
   isolated quick-launch branch. Freeze pushes until each owner has fetched or
   archived the final pre-rewrite heads.
3. Preserve a private, access-controlled backup of all refs and record their
   commit IDs. Do not place credentials in the backup name, logs, or command
   line.

## Coordinated operation

A repository administrator should run the rewrite from an AWS-hosted,
authenticated maintenance environment:

    git filter-repo --path .cursor/mcp.json --invert-paths
    git fsck --full
    gitleaks detect --source . --redact

Review every rewritten ref before any force-push. Force-push rewritten refs
only after all collaborators approve the mapping, then require each clone to
re-clone or hard-reset to its approved rewritten ref. Rotate the GitHub
machine/deploy credential afterward.

## Verification and rollback

Verify the removed path is absent from every rewritten reachable commit and
run secret scanning on each protected branch. Keep the private pre-rewrite
ref backup until every deployment has been requalified. If a deployment
regresses, roll back application delivery by image tag; do not restore the
old Git history, because it contains the compromised credential.
