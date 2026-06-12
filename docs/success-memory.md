---
id: success-memory
title: Success Memory
description: Positive reinforcement — DriftGuard's success memory graph and the record_success API.
---

# Success Memory

DriftGuard doesn't just remember what went wrong — it also remembers what worked. Alongside the mistake graph, DriftGuard maintains a separate **success graph** built from `record_success()` calls.

## Recording a success

```python
guard.record_success(
    action="add more salt",
    feedback="well seasoned",
    outcome="dish praised",
)
```

This stores a three-node causal chain — `action → feedback → outcome` — into the success graph, using the same normalization, embedding, and semantic-merge engine as `record()`. See [Memory Graph](./memory-graph) for how the graph is structured and merged.

## Retrieving reinforcements

```python
review = guard.before_step("add a pinch of salt")

for reinforcement in review.reinforcements:
    print(reinforcement.trigger, "->", reinforcement.recommendation)
    # → "add more salt" -> "well seasoned"
```

`before_step()` queries both graphs in a single call: `warnings` come from the mistake graph, `reinforcements` come from the success graph.

## The `Reinforcement` shape

Each entry in `review.reinforcements` is a `Reinforcement`:

| Attribute       | Type  | Description                                   |
|-----------------|-------|------------------------------------------------|
| `trigger`       | str   | The matched action that previously succeeded  |
| `recommendation`| str   | The feedback/outcome associated with success  |
| `frequency`     | int   | Times this success was reinforced             |
| `confidence`    | float | Confidence score (same scoring as warnings)   |

## Two independent stores

- Mistakes and successes live in **separate graphs**, each with its own persistence file or tables.
- Recording a mistake never affects the success graph, and vice versa.
- Both graphs share the same merge engine, similarity thresholds, retrieval pipeline, and pruning engine — see [How It Works](./how-it-works) and [Memory Graph](./memory-graph).
- `guard.stats()` and `guard.prune()` report on **both** graphs — see [Graph stats](./memory-graph#graph-stats).

## Where reinforcements show up

- [MCP Server](./mcp-server) — `register_success` tool, and `query_memory` returns a `reinforcements` array
- [LangGraph Adapter](./langgraph-adapter) — `guard_reinforcements_count` and `guard_top_reinforcement` state keys
- [Generic Adapter](./generic-adapter) — `reinforcements_count` in the result dict

## Storage

Like the mistake graph, the success graph persists to JSON, SQLite, or Postgres depending on `storage_backend`. See [Storage Backends](./storage) for the file and table names used by each backend.
