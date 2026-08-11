# AWS runtime

The dedicated A-minus runtime uses SSM-only administration, IMDSv2, encrypted gp3 storage, ECR images, a private Docker socket proxy, a CloudFront-injected origin header, Basic authentication, versioned S3 backup permissions, and EC2 system-recovery monitoring.

Deploy only an immutable image tag after qualification. Runtime secrets are retrieved from SSM SecureString at boot and must never be passed as CloudFormation parameters or committed.
