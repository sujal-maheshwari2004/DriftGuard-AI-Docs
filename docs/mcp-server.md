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

| Tool               | Description                                        |
|--------------------|----------------------------------------------------|
| `register_mistake` | Store a causal memory in the mistake graph         |
| `register_success` | Store a causal memory in the success graph         |
| `query_memory`     | Retrieve warnings and reinforcements for a context |
| `deep_prune`       | Run a full cleanup pass over both memory graphs    |
| `graph_stats`      | Return node and edge counts for both graphs        |
| `guard_metrics`    | Return runtime review counters and gauges          |

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

### Register a success

```
register_success(
  action="add more salt",
  feedback="well seasoned",
  outcome="dish praised"
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
  "reinforcements": [
    {
      "trigger": "add more salt",
      "recommendation": "well seasoned",
      "frequency": 1,
      "confidence": 0.81
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
{
  "mistakes": { "nodes": 9, "edges": 8 },
  "successes": { "nodes": 3, "edges": 2 }
}
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
