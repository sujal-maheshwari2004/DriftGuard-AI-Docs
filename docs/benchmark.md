---
id: benchmark
title: Benchmark
description: Run DriftGuard's offline merge and retrieval quality benchmark suite.
---

# Benchmark

DriftGuard ships a built-in benchmark harness for evaluating merge precision and retrieval quality offline — no external APIs required.

## Run it

```bash
driftguard-benchmark
```

## What it measures

The benchmark suite contains:

- **Seed events** — a small fixed set of causal memories loaded into a fresh graph
- **Merge cases** — queries that should or should not match existing nodes
- **Retrieval cases** — queries that should or should not surface specific risks

### Merge metrics

Tests whether paraphrased actions correctly merge into existing nodes (true positive) and whether unrelated actions correctly return no match (true negative).

### Retrieval metrics

Tests whether semantic queries surface the expected warning risks at the right confidence level.

## Metrics reported

| Metric      | Description                                        |
|-------------|---------------------------------------------------|
| `precision` | TP / (TP + FP) — are returned results correct?   |
| `recall`    | TP / (TP + FN) — are all expected results found? |
| `f1`        | Harmonic mean of precision and recall             |

## Python API

```python
from driftguard.benchmark import run_builtin_benchmark, format_benchmark_report

report = run_builtin_benchmark()
print(format_benchmark_report(report))
```

JSON output:

```python
from driftguard.benchmark import benchmark_report_to_dict
import json

payload = benchmark_report_to_dict(report)
print(json.dumps(payload, indent=2))
```

## Custom benchmark suite

```python
from driftguard.benchmark import BenchmarkMergeEngine, build_benchmark_runtime
from driftguard.evaluation import (
    MergeBenchmarkCase,
    RetrievalBenchmarkCase,
    evaluate_benchmark_suite,
)

merge_engine, graph_store, retrieval_engine = build_benchmark_runtime()

report = evaluate_benchmark_suite(
    merge_engine=merge_engine,
    graph=graph_store.graph,
    retrieval_engine=retrieval_engine,
    merge_cases=[
        MergeBenchmarkCase(
            name="my case",
            query="add more salt",
            node_type="action",
            expected_anchor="increase salt",
        ),
    ],
    retrieval_cases=[
        RetrievalBenchmarkCase(
            name="salt warning",
            query="season more aggressively",
            expected_risks=("too salty",),
        ),
    ],
)
```
