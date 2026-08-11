# ADR 0001: Personal single-instance operating model

The application is operated as one authenticated personal instance.
SQLite remains the authority for operational state with deterministic migration and seed steps.
The execution service must be isolated from the web process before deployment.
AWS infrastructure is single region and recoverable rather than multi-AZ.
