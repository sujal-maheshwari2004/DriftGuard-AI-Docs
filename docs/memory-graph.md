---
id: memory-graph
title: Memory Graph
description: How DriftGuard's semantic graph stores, merges, and prunes causal memories.
---

# Memory Graph

The memory graph is DriftGuard's core data structure. It is a directed graph where nodes represent normalized text concepts and edges represent causal relationships.

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
# → {'nodes': 9, 'edges': 8}
```

## Pruning

Call `guard.prune()` on a schedule to keep the graph healthy:

```python
result = guard.prune()
print(result)
# → {
#     'status': 'pruned',
#     'before': {'nodes': 12, 'edges': 10},
#     'after':  {'nodes': 9,  'edges': 8},
#     'details': {...}
#   }
```

Pruning removes:

1. **Weak edges** — seen fewer times than `prune_edge_min_frequency` (default `2`)
2. **Stale nodes** — not updated within `prune_node_stale_days` (default `60`)
3. **Isolated nodes** — no edges remaining after step 1 and 2

## Persistence

The graph saves automatically after every `record()` call. It loads automatically when `DriftGuard` is instantiated.

See [Storage Backends](./storage) for JSON vs SQLite options.
