---
id: configuration
title: Configuration
description: Full DriftGuardSettings reference with all tunable parameters.
---

# Configuration

All configuration lives in `DriftGuardSettings`, a frozen dataclass.

```python
from driftguard import DriftGuardSettings

settings = DriftGuardSettings(
    retrieval_top_k=5,
    retrieval_min_similarity=0.60,
    guard_policy="warn",
    storage_backend="sqlite",
    sqlite_filepath="driftguard.sqlite3",
)
```

## Full reference

### Storage

| Setting             | Default                                    | Description                          |
|---------------------|--------------------------------------------|--------------------------------------|
| `storage_backend`   | `"json"`                                   | `"json"` or `"sqlite"`               |
| `graph_filepath`    | `"driftguard_graph.json"`                  | Path for JSON backend                |
| `sqlite_filepath`   | `"driftguard_graph.sqlite3"`               | Path for SQLite backend              |

### Embedding

| Setting                 | Default                                        | Description                     |
|-------------------------|------------------------------------------------|---------------------------------|
| `embedding_model_name`  | `"sentence-transformers/all-MiniLM-L6-v2"`    | SentenceTransformer model        |
| `embedding_device`      | `None`                                         | Device override (`"cuda"`, etc.) |

### Retrieval

| Setting                    | Default | Description                                      |
|----------------------------|---------|--------------------------------------------------|
| `retrieval_top_k`          | `5`     | Max similar action nodes to retrieve             |
| `retrieval_min_similarity` | `0.60`  | Minimum cosine similarity to include a candidate |
| `retrieval_recency_weight` | `0.15`  | Weight of recency in confidence scoring          |

### Graph traversal

| Setting                  | Default | Description                                 |
|--------------------------|---------|---------------------------------------------|
| `traversal_max_depth`    | `3`     | Max depth when walking causal chains        |
| `traversal_max_branching`| `10`    | Max neighbors to follow per node            |
| `traversal_max_paths`    | `100`   | Max total paths collected per query         |

### Similarity thresholds

| Setting                        | Default | Description                              |
|--------------------------------|---------|------------------------------------------|
| `similarity_threshold_action`  | `0.72`  | Merge threshold for action nodes         |
| `similarity_threshold_feedback`| `0.70`  | Merge threshold for feedback nodes       |
| `similarity_threshold_outcome` | `0.88`  | Merge threshold for outcome nodes        |

### Guard policy

| Setting              | Default  | Description                                       |
|----------------------|----------|---------------------------------------------------|
| `guard_policy`       | `"warn"` | Default policy: `warn`, `block`, `acknowledge`, `record_only` |
| `guard_min_confidence` | `0.0`  | Minimum confidence to trigger policy              |

### Pruning

| Setting                  | Default | Description                                    |
|--------------------------|---------|------------------------------------------------|
| `prune_node_stale_days`  | `60`    | Days before a node is eligible for removal     |
| `prune_edge_min_frequency`| `2`   | Minimum edge frequency to survive pruning      |

### Logging

| Setting     | Default  | Description              |
|-------------|----------|--------------------------|
| `log_level` | `"INFO"` | Package-level log level  |

## Example: production SQLite config

```python
settings = DriftGuardSettings(
    storage_backend="sqlite",
    sqlite_filepath="/data/driftguard.sqlite3",
    retrieval_top_k=8,
    retrieval_min_similarity=0.65,
    similarity_threshold_action=0.75,
    guard_policy="warn",
    guard_min_confidence=0.70,
    prune_node_stale_days=30,
    prune_edge_min_frequency=3,
    log_level="WARNING",
)
```
