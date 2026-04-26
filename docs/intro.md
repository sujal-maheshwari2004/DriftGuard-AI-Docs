---
id: intro
title: Introduction
sidebar_position: 1
description: DriftGuard is a semantic mistake-memory and guardrail layer for autonomous agents.
---

# DriftGuard

DriftGuard is a **semantic mistake-memory and guardrail layer** for autonomous agents.

It sits between **intent** and **execution**, allowing agents to learn from past failures and avoid repeating them.

## The problem

Agents today can act. They usually cannot remember mistakes meaningfully.

```
agent makes mistake
agent retries
agent repeats mistake
agent retries again
```

## The solution

DriftGuard introduces a semantic failure memory layer:

```
plan step
↓
DriftGuard review
↓
warning surfaced
↓
agent revises action
```

## What DriftGuard stores

Every recorded mistake becomes a causal chain in a semantic graph:

```
action → feedback → outcome
```

For example:

```
"increase salt" → "too salty" → "dish ruined"
```

When a similar action appears later — like `"add more salt"` or `"season aggressively"` — DriftGuard retrieves the warning before execution.

## What DriftGuard provides

- Semantic mistake memory
- Similarity-aware warning retrieval
- Policy-based execution guardrails
- Merge and deduplicate memory graphs
- JSON or SQLite persistence
- Runtime metrics and observability
- Pruning of stale weak memories
- MCP server integration
- LangGraph and generic adapters
- Offline benchmark harness

## When to use DriftGuard

DriftGuard helps when your agent:

- Retries failing steps repeatedly
- Forgets past execution errors
- Needs execution-time guardrails
- Requires semantic mistake recall
- Runs multi-step planners
- Uses LangGraph or MCP
- Executes tools autonomously

## Project status

Current release includes the full semantic merge engine, retrieval engine, graph persistence, MCP server, LangGraph adapter, benchmark harness, runtime metrics, pruning engine, and pytest coverage.

DriftGuard is suitable for early production experimentation and agent-infrastructure research workflows.
