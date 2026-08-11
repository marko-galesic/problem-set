# Limitations register

- Single-instance, single-AZ deployment.
- CloudFormation user-data edits require clean creation or idempotent SSM application; they do not replay on a running instance.
- Render-secret history rewrite requires coordination with the parallel quick-launch branch.
- Cost Explorer tag data can lag.
