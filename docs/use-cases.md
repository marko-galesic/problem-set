# Use Cases and Feature Inventory

This document enumerates the current use cases and features in the ProblemSet codebase.

## Use Cases

### Solve a coding challenge
- Select a challenge and language (Java, Python, JavaScript, TypeScript).
- Read the HTML problem description and preview test cases.
- Write code in the Monaco editor (Java includes custom language configuration and sample autocomplete).
- Run a small subset of tests or submit the full test suite.
- Inspect pass/fail results, timings, stdout, errors, and expected vs actual output.
- Reset to the challenge template and clean up temp execution files.

### Track time and guidance
- Start, pause, reset, hide, or manually set a per-challenge timer.
- Mark a submission timer as untracked when needed.
- Record guidance level (Independent, Minor, Guided) and submit attempts on success.

### Manage submissions per challenge
- Save successful submissions with code, avg runtime, timer time, and guidance.
- View submissions in a sidebar and open saved solutions.
- Edit timer time or delete saved submissions.
- Filter submissions by language.

### Review progress across challenges
- View all submissions across challenges in a dedicated page.
- Export submissions to CSV.
- Inspect topic fitness by difficulty and language.
- Compare against the built-in tech bar reference targets.

### Get AI-assisted help and recommendations (requires OPENAI_API_KEY)
- Request a "Where's the bug?" hint for the current solution.
- Evaluate hint strength to adjust guidance options.
- Receive next-challenge recommendations with explanations and optional auto-continue.

### Author and register challenges
- Create challenge data folders with description, templates, golden solutions, and submissions.
- Add helper types for custom data structures (e.g., TreeNode, ListNode).
- Add test cases plus adapters for input/serialization.
- Register challenges and metadata (name, difficulty, topics) in the database or config.

### Curate learning paths
- Define challenge prerequisites and skill tree ordering.
- Assign company tier requirements per challenge.

### Operate the runtime
- Execute solutions in Java, Python, JavaScript, and TypeScript with timeouts and temp dirs.
- Use mock execution for development via `MOCK_EXECUTION=1`.
- Check health and clean temp directories via API.

## Feature Inventory

### Frontend UI
- Monaco editor with language selection, Java configuration, and template reset.
- Collapsible and resizable panels (description, editor, test cases/results).
- Test case preview and detailed test result viewer with timing and output diffs.
- Timer widget with persistence and manual set popover.
- Submission metadata popover for guidance level and timer time capture.
- Submissions sidebar with solution viewer, timer edits, and delete actions.
- Submissions page with topic fitness table, tech bar legend, recommendations, and CSV export.
- Local persistence of code, layout, timer state, and submit attempts via localStorage.

### Backend and Execution
- REST endpoints for templates, descriptions, test cases, run/submit, and challenge lists.
- Adapter-based input extraction, invocation, and serialization per challenge.
- Multi-language executors with compilation/runtime handling and timeouts.
- Run supports limiting tests by ID; submit calculates avg runtime and overall pass status.
- Health check, temp cleanup, and auto-discovery of challenge folders.

### Data and Content
- Per-challenge data folders with `description.html`, templates, golden solutions, and `submissions.json`.
- Shared helper types for common structures (e.g., trees, lists).
- Reference SQL challenge set document (not wired into runtime).

### Analytics and Recommendations
- Submissions stored in SQLite with JSON fallback.
- Guidance level, submit attempts, timer time, and tech bar fields tracked per submission.
- Topic fitness scoring and history snapshots by language.
- OpenAI-powered recommendations and bug hints (when enabled).

### Admin and Maintenance
- Challenge metadata endpoints for difficulty, topics, and name updates.
- Challenge registration endpoint for new content.
- Prerequisite, skill tree, and company tier management endpoints.
- Database migration and backfill scripts for metadata and submissions.
