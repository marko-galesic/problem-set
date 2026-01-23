# ProblemSet

A LeetCode-style coding challenge website.

## Features

- Code editor with Java syntax highlighting and autocomplete
- Run button: Execute with 2-3 basic test cases
- Submit button: Execute with comprehensive test suite (5-10 test cases)
- Local storage of implementations and execution times
- Real-time test results display

## Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Start development servers:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend on `http://localhost:5173`


## Maintenance

- Backfill submission guidance levels:
  - `node backend/src/db/backfillGuidanceLevel.js`

## Requirements

- Node.js 18+
- Java JDK 11+ (for executing Java code)
- Python 3.10+ (for executing Python code)

## Project Structure

- `frontend/` - React + Vite application
- `backend/` - Node.js/Express server for code execution

