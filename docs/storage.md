---
id: storage
title: Storage Backends
description: JSON, SQLite, and Postgres persistence options for DriftGuard's memory graphs.
---

# Storage Backends

DriftGuard keeps the mistake graph and the success graph in-memory at runtime and persists each of them after every `record()` / `record_success()` call and after pruning. See [Success Memory](./success-memory) for more on the two graphs.

## Backends

| Backend    | Best for                         |
|------------|----------------------------------|
| `json`     | Local experiments, development   |
| `sqlite`   | Production workflows             |
| `postgres` | Shared/multi-process deployments |

## Storage layout per backend

| Backend  | Mistake graph                                  | Success graph                        |
|----------|------------------------------------------------|--------------------------------------|
| JSON     | `driftguard_graph.json`                        | `driftguard_success_graph.json`      |
| SQLite   | `driftguard_graph.sqlite3`                     | `driftguard_success_graph.sqlite3`   |
| Postgres | `driftguard_meta` / `_nodes` / `_edges` tables | same tables with a `success_` prefix |

For Postgres, both table sets live in the same database via the same `postgres_dsn` — the success graph simply uses a `success_` table prefix.

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

## Postgres

Install the extra dependencies first:

```bash
pip install "driftguard-ai[postgres]"
```

```python
from driftguard import DriftGuard, DriftGuardSettings

guard = DriftGuard(
    settings=DriftGuardSettings(
        storage_backend="postgres",
        postgres_dsn="postgresql+psycopg://user:pass@host:5432/driftguard",
    )
)
```

The Postgres backend stores each graph across three tables — `driftguard_meta`, `driftguard_nodes`, and `driftguard_edges` — with embeddings stored as `JSONB` instead of the text-encoded format used by SQLite. The success graph uses the same three tables with a `success_` prefix (`success_driftguard_meta`, `success_driftguard_nodes`, `success_driftguard_edges`), so both graphs share a single `postgres_dsn`.

This backend is recommended when multiple processes or replicas need to share the same memory graphs.

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
