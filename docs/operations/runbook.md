# Operator runbook

## Access

Use AWS Systems Manager only. Do not use SSH or copy runtime secrets outside AWS. Retrieve SecureString values only into process memory for a deployment or authenticated smoke test.

## Health

1. Confirm the runtime stack is UPDATE_COMPLETE.
2. Confirm EC2 instance and system checks are ok.
3. Confirm the system-recovery, instance-status, and CPU-pressure alarms are OK.
4. From AWS, verify edge unauthenticated status 401, authenticated root 200, and authenticated health endpoint 200.
5. Store raw test output and its SHA-256 sidecar in the versioned evidence bucket.

The system alarm triggers EC2 recovery. The other two alarms publish to the project SNS topic.

## Backup and restore

The instance runs a daily SQLite backup timer. Verify a backup by restoring a versioned object into an isolated CodeBuild job, matching its checksum, and running SQLite integrity_check. Do not overwrite the running database before that isolated check succeeds.

## Deploy and rollback

Deploy only an immutable, qualified image tag. For rollback, update the stack to the last qualified tag and rerun the edge smoke check. UserData does not replay on an existing instance; use idempotent SSM application or replacement when boot configuration changes.

## Cost stop

At actual tagged cost of $300, the project budget stops only the A-minus runtime and attaches a deny policy for explicitly A-minus-tagged provisioning. Do not restart or provision resources until costs and budget-action history are reviewed.

## Notification limitation

The project SNS topic has no external subscription yet. Add an approved delivery endpoint through a project-scoped change if out-of-AWS notifications are required.