---
id: sample-what-is-a-check
title: What the checks mean
summary: Types, lint, tests and review. What each one tells you before you approve.
screens: [job]
kind: guide
order: 2
version: 0.42
recorded: 2026-11-02
minutes: 2
---

## Types and lint

**Types** catch mismatched data. **Lint** catches style slips and common mistakes.

## Tests

Tests run the app's own rules. Hadji also writes a new test that fails on the old bug, so it cannot come back.

## Review

A second agent reads the change like a teammate would and flags problems. A pass here means no problems found.
