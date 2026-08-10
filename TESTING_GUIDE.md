# TravelAdvisor Testing Guide

This guide explains how to run, modify, and extend the test suites in the TravelAdvisor application.

## 1. Prerequisites

Ensure you have Node.js and dependencies installed.

```bash
cd backend
npm install
```

## 2. Test Structure

All tests reside in `backend/tests/`:

- `auth.test.js` — Registration, login, and profile authorization checks.
- `destinations.test.js` — Full destination CRUD lifecycle and filtering.
- `hotels.test.js` — Hotel CRUD operations and destination links.
- `reviews.test.js` — Review CRUD, rating sync, and user permissions verification.
- `categories.test.js` — Category queries.
- `errorHandler.test.js` — Error status code mappings and fallback safety.
- `validation.test.js` — Request payload rules and password validation constraints.
- `integration.test.js` — Multi-step integration workflows.

## 3. Running Tests

To execute the test suite, run Jest directly via Node from the `backend/` directory (bypassing execution policy constraints on Windows systems):

```bash
node node_modules/jest/bin/jest.js --runInBand --detectOpenHandles --forceExit
```

This runs all tests sequentially in a single process (`--runInBand`), detects open resource handles, and terminates the testing environment cleanly.

### Generating Coverage Reports

To run tests with code coverage analysis:

```bash
node node_modules/jest/bin/jest.js --coverage --runInBand --detectOpenHandles --forceExit
```
