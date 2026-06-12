---
id: memory-graph
title: Memory Graph
description: How DriftGuard's semantic graph stores, merges, and prunes causal memories.
---

# Memory Graph

The memory graph is DriftGuard's core data structure. It is a directed graph where nodes represent normalized text concepts and edges represent causal relationships.

## Two independent graphs

DriftGuard actually maintains **two** memory graphs side by side:

- the **mistake graph** — built from `record()` calls
- the **success graph** — built from `record_success()` calls

They share the same structure, merge engine, and prune engine, but are completely separate stores with their own persistence files/tables. Recording a mistake never affects the success graph and vice versa. See [Success Memory](./success-memory) for details on the success graph and how it surfaces `reinforcements`.

The rest of this page describes the structure that both graphs share.

## Structure

Every `record()` call adds a three-node chain:

```
action node  →  feedback node  →  outcome node
```

Example:

```
"increase salt"  →  "too salty"  →  "dish ruined"
```

## Semantic merging

When a new event arrives, the merge engine checks for similar existing nodes before creating new ones.

```python
guard.record("increase salt", "too salty", "dish ruined")
guard.record("add more salt", "over-seasoned", "dish ruined")
```

The second call merges `"add more salt"` into the existing `"increase salt"` node because their cosine similarity exceeds the action threshold. The `frequency` counter increments. No duplicate node is created.

This means two paraphrased mistakes reinforce **one memory** rather than fragmenting the graph.

## Node attributes

| Attribute    | Description                              |
|--------------|------------------------------------------|
| `type`       | `action`, `feedback`, or `outcome`       |
| `embedding`  | Normalized float32 vector                |
| `frequency`  | Times merged or seen                     |
| `first_seen` | UTC datetime of first record             |
| `last_seen`  | UTC datetime of most recent reinforcement|

## Edge attributes

| Attribute    | Description                          |
|--------------|--------------------------------------|
| `frequency`  | Times this causal link was observed  |
| `weight`     | Edge weight (default 1.0)            |
| `created_at` | UTC datetime of first creation       |

## Graph stats

```python
print(guard.stats())
# → {'mistakes': {'nodes': 9, 'edges': 8}, 'successes': {'nodes': 4, 'edges': 3}}
```

`guard.stats()` always reports both graphs — `mistakes` and `successes` — each with their own `nodes`/`edges` counts.

## Pruning

Call `guard.prune()` on a schedule to keep both graphs healthy:

```python
result = guard.prune()
print(result)
# → {
#     'status': 'pruned',
#     'mistakes': {
#       'before': {'nodes': 12, 'edges': 10},
#       'after':  {'nodes': 9,  'edges': 8},
#       'details': {...}
#     },
#     'successes': {
#       'before': {'nodes': 5, 'edges': 4},
#       'after':  {'nodes': 4, 'edges': 3},
#       'details': {...}
#     }
#   }
```

`prune()` runs a full deep-prune pass over the mistake graph **and** the success graph in a single call. Pruning removes:

1. **Weak edges** — seen fewer times than `prune_edge_min_frequency` (default `2`)
2. **Stale nodes** — not updated within `prune_node_stale_days` (default `60`)
3. **Isolated nodes** — no edges remaining after step 1 and 2

## Persistence

Both graphs save automatically after every `record()` / `record_success()` call, and load automatically when `DriftGuard` is instantiated.

See [Storage Backends](./storage) for JSON, SQLite, and Postgres options.
