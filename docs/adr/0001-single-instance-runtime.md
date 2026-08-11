# ADR 0001: Single-instance AWS runtime

Accepted. Problem Set uses one authenticated EC2 instance behind CloudFront and SQLite as the authoritative personal-runtime store. The instance is SSM-administered, uses encrypted EBS and IMDSv2, immutable ECR tags, versioned S3 backups, and a private execution boundary. This is intentionally not multi-AZ or highly available.
