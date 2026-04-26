---
id: storage
title: Storage Backends
description: JSON and SQLite persistence options for DriftGuard's memory graph.
---

# Storage Backends

DriftGuard keeps the memory graph in-memory at runtime and persists it to disk after every `record()` call and after pruning.

## Backends

| Backend | Best for                        |
|---------|---------------------------------|
| `json`  | Local experiments, development  |
| `sqlite`| Production workflows            |

## JSON (default)

```python
from driftguard import DriftGuard, DriftGuardSettings

guard = DriftGuard(
    settings=DriftGuardSettings(
        storage_backend="json",
        graph_filepath="driftguard_graph.json",
    )
)
```

The JSON file is human-readable and uses the `networkx` node-link format wrapped in a versioned envelope:

```json
{
  "format": "driftguard_graph",
  "format_version": 1,
  "graph": { "nodes": [...], "links": [...] }
}
```

Writes are atomic — the file is written to a `.tmp` path first and then renamed, so a crash during save never corrupts the existing graph.

## SQLite

```python
guard = DriftGuard(
    settings=DriftGuardSettings(
        storage_backend="sqlite",
        sqlite_filepath="driftguard_graph.sqlite3",
    )
)
```

SQLite stores nodes and edges in separate tables with schema versioning. It is faster for large graphs and safer under concurrent access patterns.

### Schema

```sql
CREATE TABLE nodes (
    text      TEXT PRIMARY KEY,
    type      TEXT NOT NULL,
    embedding TEXT,
    frequency INTEGER NOT NULL,
    first_seen TEXT,
    last_seen  TEXT
);

CREATE TABLE edges (
    src        TEXT NOT NULL,
    dst        TEXT NOT NULL,
    frequency  INTEGER NOT NULL,
    weight     REAL NOT NULL,
    created_at TEXT,
    PRIMARY KEY (src, dst)
);
```

## Custom persistence

Implement the `GraphPersistence` protocol:

```python
from driftguard.storage.base import GraphPersistence
import networkx as nx

class MyPersistence:
    def save_graph(self, graph: nx.DiGraph) -> None:
        ...

    def load_graph(self) -> nx.DiGraph | None:
        ...
```

Pass it at runtime construction:

```python
from driftguard.runtime import build_runtime
from driftguard import DriftGuard

runtime = build_runtime(persistence=MyPersistence())
guard = DriftGuard(runtime=runtime)
```
