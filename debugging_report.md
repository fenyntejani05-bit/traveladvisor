# TravelAdvisor Week 5 Debugging Report

This report documents the bugs identified, analyzed, and successfully resolved during Week 5 quality assurance and code review.

## 1. Column Mismatch: `best_time_to_visit` Missing in Initial Schema

### Problem
The frontend details and listing views expected destinations to return a `best_time_to_visit` field, and `DestinationModel` queried `d.best_time_to_visit`. However, the initial database schema in `schema.sql` did not create this column. This caused database query failures or silent JavaScript errors when initializing a clean database.

### Root Cause
An update migration script (`update_destinations.js`) altered the table to add this field, but it was missing from the base `schema.sql` file.

### Solution
Updated `backend/database/schema.sql` to include the `best_time_to_visit VARCHAR(100) NULL` column directly in the `destinations` table definition.

### Result
Clean installations of the database via `schema.sql` automatically include the column, preventing runtime SQL exception errors.

---

## 2. CORS Wildcard Policy Inconsistency

### Problem
Wildcard origins `*` in Express CORS configurations can cause blockages or failures when handling authenticated requests (credentials like tokens or customized headers).

### Root Cause
No specific origin was whitelisted, defaulting to `*`.

### Solution
Standardized the CORS origins and headers in `backend/app.js` to whitelist incoming request headers properly and support secure API calls.

### Result
Axios requests from `http://localhost:3000` resolve successfully without security context issues.

---

## 3. Global Exception Handler and Secret Leakage Prevention

### Problem
Unhandled database exceptions, query syntax errors, or server crashes could print raw SQL queries or stack traces directly to API consumers, revealing server secrets or MySQL internal structure.

### Root Cause
The 500 error handler returned the raw exception message without environment checks.

### Solution
Integrated a custom structured logging module (`logger.js`) that outputs clean errors and logs trace details to file files safely, while showing users a generic "Internal server error" in production.

### Result
Production API consumers receive zero internal details on failure, keeping server configuration secure.
