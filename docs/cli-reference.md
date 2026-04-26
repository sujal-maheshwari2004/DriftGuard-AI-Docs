---
id: cli-reference
title: CLI Reference
description: DriftGuard command-line entry points and flags.
---

# CLI Reference

## `driftguard-mcp`

Start the DriftGuard MCP server:

```bash
driftguard-mcp
```

Uses `DriftGuardSettings` defaults — JSON persistence, `warn` policy, standard embedding model.

To customize, create a `server.py` entry point:

```python
from driftguard import DriftGuardSettings
from driftguard.mcp import create_mcp_server

mcp = create_mcp_server(
    settings=DriftGuardSettings(
        storage_backend="sqlite",
        sqlite_filepath="driftguard.sqlite3",
    )
)

mcp.run()
```

## `driftguard-benchmark`

Run the built-in quality benchmark suite:

```bash
driftguard-benchmark
```

### Output formats

Human-readable text (default):

```bash
driftguard-benchmark --format text
```

Machine-readable JSON:

```bash
driftguard-benchmark --format json
```

### Flags

| Flag          | Default  | Description                          |
|---------------|----------|--------------------------------------|
| `--format`    | `text`   | Output format: `text` or `json`      |
| `--log-level` | `WARNING`| Package log level during the run     |

### Sample output

```
DriftGuard Benchmark Report

Merge: precision=1.00 recall=0.50 f1=0.67
- seasoning paraphrase: PASS (expected='increase salt', predicted='increase salt')
- heat paraphrase: FAIL (expected='raise heat heat', predicted=None)
- unrelated action: PASS (expected=None, predicted=None)

Retrieval: precision=1.00 recall=0.75 f1=0.86
- seasoning warning: PASS
- heat warning: PASS
- resting warning: PASS
- unrelated no-warning: PASS
```

## Demo agents

Two local demo agents are included in the repository:

### Rule-based demo

```bash
python demo/rule_based/demo_agent.py \
  --duration-seconds 120 \
  --step-delay 2 \
  --prune-every 4 \
  --reset-graph
```

### LangGraph LLM demo

```bash
export OPENAI_API_KEY=your-key
python demo/langgraph/demo_agent.py \
  --duration-seconds 120 \
  --step-delay 4 \
  --prune-every 4 \
  --reset-graph
```

### Demo flags

| Flag                 | Description                                      |
|----------------------|--------------------------------------------------|
| `--duration-seconds` | How long to run the loop                         |
| `--step-delay`       | Seconds between steps                            |
| `--prune-every`      | Run deep prune every N steps (0 to disable)      |
| `--reset-graph`      | Delete graph and trace before starting           |
| `--runtime-mode`     | `demo` (offline) or `real` (full embedding stack)|
| `--log-level`        | Package log level                                |
