# A-minus qualification evidence

## Qualified branch and runtime

- Branch: codex/a-minus-architecture
- Application security image: 2ac30241b3f1ab2bc908b6494b7d2d8886876947
- API digest: sha256:cc11fa41d797bcdde0c118d29fdb482b2c51175f00546948aa1028cba44644b8
- Runtime recovery service: enabled and active on the isolated project instance.
- Rollback image tag: c6041e24676b remains available in the project ECR repositories.

## Checksummed AWS evidence

- Current Node 22 backend regression:
  evidence/tests/current-backend-regression-node22.log
- Current Node 22 frontend regression:
  evidence/tests/current-frontend-regression-node22.log
- Regression checksums:
  evidence/tests/current-regression-node22.sha256
- Final current-head secret scan:
  evidence/security/final-head-secret-scan.log
- Final current-head audit and checksums:
  evidence/audits/final-head-audit.log and
  evidence/audits/final-head-audit.sha256
- Production dependency audit after remediation:
  evidence/security/backend-production-npm-audit-after.json
- Runtime deployment smoke:
  evidence/deployment/c6041e24676b-smoke.log
- Runtime recovery commit:
  evidence/deployment/runtime-recovery-commit.txt

All evidence is stored in the encrypted, versioned project backup bucket:
problem-set-a-minus-backups-461701713970-us-east-1.

## Operational state at qualification

The project hard-stop budget is 300 USD. The project recovery, instance-status,
and CPU-pressure alarms are OK. The backup timer is enabled and active; a
retrievable database backup exists under the db/ prefix.

## Explicit limitation

The current tree is secret-clean, but the previously tracked Render bearer
credential remains in historical Git objects until the coordinated rewrite in
docs/operations/secret-history-remediation.md is approved and completed.
