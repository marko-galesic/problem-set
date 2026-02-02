---
name: agents-md-knowledge-capture
description: Update or append AGENTS.md with durable, time-saving learnings discovered during tasks (e.g., more than 10 minutes saved, repeated confusion, missing setup steps or gotchas). Use at the end of every task whenever such information is identified.
---

# Agents Md Knowledge Capture

## Overview
Capture new, durable operational knowledge in `AGENTS.md` so future work avoids repeated confusion and time loss.

## End-of-Task Workflow
1. Locate `AGENTS.md` at the repo root (or the project-specific location if documented).
2. Review recent work and ask: did anything learned save >10 minutes, resolve repeated confusion, or reveal a missing setup detail or critical gotcha?
3. If **no**, explicitly note in the final response that no AGENTS.md update was needed.
4. If **yes**, update `AGENTS.md`:
   - Reuse existing sections and style; avoid duplicates by editing the closest existing entry.
   - Add a short, actionable entry with concrete details (paths, commands, configs) that are stable over time.
   - Keep entries concise and ASCII-only; avoid dates, one-off status updates, secrets, or personal data.
5. Mention the update in the final response and point to the file path.

## What Qualifies as “Material Time Savings”
- A setup step or dependency that was missing or unclear.
- A non-obvious command, flag, path, or order of operations that prevents a common failure.
- A brittle integration detail or env var that otherwise costs >10 minutes to rediscover.
- A recurring ambiguity that caused repeated clarification or rework.

## Example Additions (Style Only)
- “If tests fail with X, run `cmd` to regenerate Y before retrying.”
- “Use `path/to/tool` instead of system version; otherwise build breaks.”
- “Set `ENV_VAR=...` when running `script` or it hangs.”
