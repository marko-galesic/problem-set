# Challenge Authoring Guide

This document describes the pattern used to add a new coding challenge in this repo.

## Required Data Files

Each challenge lives under `data/<challenge_id>/` and must include:

- `description.html`: HTML description rendered in the UI.
- `template.java`: Starter code shown in the editor (Java).
- `Golden.java`: Reference solution used for internal validation (Java).
- `template.py`: Starter code shown in the editor (Python).
- `Golden.py`: Reference solution used for internal validation (Python).
- `submissions.json`: JSON array of submissions (usually `[]` to start).

If the problem uses a custom return type or helper type, add the top-level Java type:

- `TreeNode.java` for tree problems
- `ListNode.java` for linked list problems
- `Node.java`, `AttrResult.java`, etc. when required by the challenge

## Backend Integration

Add backend files:

- `backend/src/testCases/<ChallengeName>Tests.js` (camelCase names like `coinChangeTests.js`)
  - Export `runTests` and `submitTests`.
  - Inputs are stored on custom fields (e.g. `root`, `grid`, `s`) plus a human-readable `input` string.
  - Expected output is stored in `expected`.

- `backend/src/adapters/<challengeName>Adapter.js` (camelCase names like `coinChangeAdapter.js`)
  - `extractInput(testCase)` to normalize input fields.
  - `buildExpectedCode(expected)` to generate Java expected result.
  - `generateSerializer()` to serialize the return type.
  - `generateInvocation(parserVar)` to call the user method.
  - `generateInputHelpers(testCases)` for input construction (arrays, trees, etc.).
  - `getReturnType()`, `getSerializerMethod()`, `getDefaultClassName()`.
- `backend/src/adapters/python/<challengeName>Adapter.js` for Python runs (match the Java adapter inputs and invocation).

Adapters follow patterns in existing files, such as:

- `backend/src/adapters/invertBinaryTreeAdapter.js` for tree inputs
- `backend/src/adapters/validParenthesesAdapter.js` for boolean outputs

## Server Registration

Register the challenge in `backend/src/server.js` under the `CHALLENGES` map:

- `id`: snake_case challenge id (matches the `data/` folder name)
- `name`: display name shown in the UI
- `folder`: same as `id`
- `testFile`: path under `backend/src/testCases/` (camelCase file name)
- `adapter`: path under `backend/src/adapters/` (camelCase file name)

If the DB already has a row for the challenge, it overrides `CHALLENGES` at runtime; keep `test_file` and `adapter` paths in `backend/data/challenges.db` aligned with these conventions or delete the stale row.

## UI/Runtime Flow

The frontend requests:

- `GET /api/challenges` for the challenge list
- `GET /api/template?challenge=<id>` for the starter code
- `GET /api/description?challenge=<id>` for the HTML description
- `GET /api/test-cases?challenge=<id>` for previews

The backend uses the adapter + test cases to compile and run Java code.

## Commit Requirements

- Use Conventional Commits format for commit messages (e.g. `feat: add new challenge`).
- Only commit when tests pass and coverage is maintained at 80% or higher.

## Skill Packaging

- `scripts/package_skill.py` requires PyYAML; if packaging fails, install from a local wheel to avoid network dependence (e.g., `python -m venv .venv` then `.venv/bin/python -m pip install --no-index --find-links=vendor pyyaml`).
