---
id: how-it-works
title: How It Works
description: The internals of DriftGuard's semantic memory graph, merge engine, and retrieval pipeline.
---

# How It Works

DriftGuard has two main pipelines: **recording** and **retrieval**.

## Recording pipeline

When you call `guard.record(action, feedback, outcome)`:

```
action text
  ↓
normalize (spaCy lemmatize + stopword removal)
  ↓
embed (sentence-transformers)
  ↓
find similar existing node (cosine similarity > threshold)
  ↓
merge into existing node  OR  create new node
  ↓
add edges: action → feedback → outcome
  ↓
persist to JSON or SQLite
```

### Semantic merge

If `"add more salt"` arrives after `"increase salt"` is already in the graph, the merge engine computes cosine similarity between the two normalized embeddings. If similarity exceeds the action threshold (default `0.72`), the new text merges into the existing node — incrementing its frequency — rather than creating a duplicate.

This keeps the graph compact and ensures repeated paraphrased mistakes reinforce one signal rather than fragmenting it.

## Retrieval pipeline

When you call `guard.before_step(context)`:

```
context text
  ↓
embed
  ↓
top-k cosine similarity search over action nodes
  ↓
walk causal chains from each matched node (DFS)
  ↓
build warnings from (trigger, risk) pairs
  ↓
score confidence = f(node_freq, edge_freq, similarity, recency)
  ↓
deduplicate + sort by confidence descending
  ↓
return RetrievalResponse
```

### Confidence scoring

```
confidence = 0.65 × reinforcement_score
           + 0.35 × similarity_score
           + recency_weight × recency_score
```

Reinforcement score tiers:

| Combined frequency | Score |
|--------------------|-------|
| ≥ 5                | 0.95  |
| ≥ 3                | 0.85  |
| ≥ 2                | 0.75  |
| 1                  | 0.60  |

## Graph structure

The in-memory graph is a directed `networkx.DiGraph`. Each node stores:

| Attribute    | Type       | Purpose                        |
|--------------|------------|--------------------------------|
| `type`       | str        | `action`, `feedback`, `outcome`|
| `embedding`  | np.ndarray | Normalized sentence embedding  |
| `frequency`  | int        | How many times merged into     |
| `first_seen` | datetime   | When first recorded            |
| `last_seen`  | datetime   | When last reinforced           |

Each edge stores `frequency`, `weight`, and `created_at`.

## Pruning

Deep pruning runs on a schedule and removes:

1. **Weak edges** — frequency below `prune_edge_min_frequency`
2. **Stale nodes** — not seen within `prune_node_stale_days`
3. **Isolated nodes** — no incoming or outgoing edges after edge removal
