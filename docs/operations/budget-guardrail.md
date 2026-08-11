# $300 project guardrail

The A-minus program is protected by the `problem-set-a-minus-hard-stop-300` monthly AWS Budget. It filters on `user:Project$problem-set-a-minus` and has two automatic actions at an actual cost of $300:

- `RUN_SSM_DOCUMENTS` with `STOP_EC2_INSTANCES`, targeting only the A-minus runtime instance.
- `APPLY_IAM_POLICY`, attaching `problem-set-a-minus-budget-deny` to the control-plane role.

The deny policy is deliberately conditioned on `aws:RequestTag/Project = problem-set-a-minus`. It blocks project-tagged provisioning operations without affecting quick-launch, Next/Turbopack, or untagged account work. The execution role is limited to stopping the A-minus instance and attaching/detaching that one managed policy.

The Budget Action uses the A-minus SNS topic as its AWS notification subscriber. Add an approved subscription to that topic through the projects administrative runbook if delivery outside AWS is required.
