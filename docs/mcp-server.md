---
id: mcp-server
title: MCP Server
description: Run DriftGuard as a standalone MCP server for Claude Desktop and other MCP clients.
---

# MCP Server

DriftGuard can run as a standalone MCP server, exposing its memory tools to any MCP-compatible client including Claude Desktop.

## Start the server

```bash
driftguard-mcp
```

## Available tools

| Tool                | Description                                      |
|---------------------|--------------------------------------------------|
| `register_mistake`  | Store a causal memory: action, feedback, outcome |
| `query_memory`      | Retrieve warnings for a given context            |
| `deep_prune`        | Run a full graph cleanup pass                    |
| `graph_stats`       | Return current node and edge counts              |
| `guard_metrics`     | Return runtime review counters and gauges        |

## Claude Desktop config

Add DriftGuard to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "driftguard": {
      "command": "driftguard-mcp"
    }
  }
}
```

## Tool usage examples

### Register a mistake

```
register_mistake(
  action="increase salt",
  feedback="too salty",
  outcome="dish ruined"
)
```

### Query memory

```
query_memory(context="add more salt")
```

Returns:

```json
{
  "query": "add more salt",
  "warnings": [
    {
      "trigger": "increase salt",
      "risk": "too salty",
      "frequency": 3,
      "confidence": 0.87
    }
  ],
  "confidence": 0.87
}
```

### Get graph stats

```
graph_stats()
```

Returns:

```json
{ "nodes": 9, "edges": 8 }
```

## Custom runtime config

Create a server with custom settings:

```python
from driftguard import DriftGuardSettings
from driftguard.mcp import create_mcp_server

mcp = create_mcp_server(
    settings=DriftGuardSettings(
        storage_backend="sqlite",
        sqlite_filepath="driftguard.sqlite3",
        guard_policy="warn",
        retrieval_top_k=5,
    )
)

mcp.run()
```
