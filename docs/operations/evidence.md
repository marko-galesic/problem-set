# Evidence index

The versioned project S3 bucket retains validated templates, deployment smoke logs with SHA-256 sidecars, and SQLite backups. Restore verification checks the download checksum and SQLite integrity in AWS CodeBuild.
