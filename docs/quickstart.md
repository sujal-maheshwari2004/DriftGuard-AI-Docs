---
id: quickstart
title: Quickstart
sidebar_position: 3
description: Get DriftGuard running in under 5 minutes.
---

# Quickstart

## 1. Install

```bash
pip install driftguard-ai
python -m spacy download en_core_web_sm
```

## 2. Record a mistake

```python
from driftguard import DriftGuard

guard = DriftGuard()

guard.record(
    action="increase salt",
    feedback="too salty",
    outcome="dish ruined",
)
```

## 3. Review before acting

```python
review = guard.before_step("add more salt")

if review.warnings:
    print(review.warnings[0].risk)
    # → "too salty"
    print(review.confidence)
    # → 0.82
```

DriftGuard matched `"add more salt"` semantically to `"increase salt"` and surfaced the stored warning.

## 4. Check graph stats

```python
print(guard.stats())
# → {'nodes': 3, 'edges': 2}
```

## 5. Prune stale memories

```python
guard.prune()
```

## 6. Run the MCP server

```bash
driftguard-mcp
```

## What just happened

- `record()` stored the causal chain `action → feedback → outcome` into the in-memory semantic graph and persisted it to disk.
- `before_step()` embedded the query, retrieved similar action nodes, walked their causal chains, and returned ranked warnings.
- The graph persists across restarts — DriftGuard remembers between sessions.

## Next steps

- Configure [Guard Policies](./guard-policies) to block or acknowledge risky steps
- Connect the [MCP Server](./mcp-server) to Claude Desktop or any MCP client
- Drop the [LangGraph Adapter](./langgraph-adapter) into your planner graph
- Tune [Configuration](./configuration) for your similarity thresholds and storage backend
