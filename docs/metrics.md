---
id: metrics
title: Metrics & Observability
description: Runtime metrics and counters available in DriftGuard.
---

# Metrics & Observability

DriftGuard tracks runtime metrics for every review, record, prune, and graph mutation.

## Get a snapshot

```python
from driftguard import build_runtime

runtime = build_runtime()
snapshot = runtime.metrics_snapshot()

print(snapshot["counters"])
print(snapshot["gauges"])
```

Or via `DriftGuard`:

```python
guard = DriftGuard()
# ... run some reviews and records ...
snapshot = guard.runtime.metrics_snapshot()
```

## Counters

| Counter                         | Description                                   |
|---------------------------------|-----------------------------------------------|
| `reviews_total`                 | Total `before_step()` calls (non-skipped)     |
| `review_warnings_total`         | Total warnings surfaced across all reviews    |
| `review_confidence_samples_total`| Total reviews counted for average             |
| `reviews_blocked_total`         | Reviews that raised `GuardrailTriggered`      |
| `reviews_ack_required_total`    | Reviews that raised `GuardrailAcknowledgementRequired` |
| `reviews_skipped_total`         | Reviews skipped due to `record_only` policy   |
| `records_total`                 | Total `record()` calls                        |
| `nodes_created_total`           | New nodes added to the graph                  |
| `nodes_merged_total`            | Nodes merged into existing nodes              |
| `edges_created_total`           | New edges created                             |
| `edges_reused_total`            | Existing edges incremented                    |
| `prune_runs_total`              | Total `prune()` calls                         |
| `prune_nodes_removed_total`     | Nodes removed by pruning                      |
| `prune_edges_removed_total`     | Edges removed by pruning                      |

## Gauges

| Gauge                        | Description                                   |
|------------------------------|-----------------------------------------------|
| `last_review_confidence`     | Confidence of the most recent review          |
| `review_confidence_total`    | Running sum (used for average)                |
| `review_confidence_average`  | Rolling average confidence across all reviews |

## Via MCP

```
guard_metrics()
```

Returns the full `counters` + `gauges` snapshot as a JSON object — available to any MCP client including Claude Desktop.

## Example snapshot

```json
{
  "counters": {
    "reviews_total": 42,
    "review_warnings_total": 18,
    "reviews_blocked_total": 3,
    "records_total": 12,
    "nodes_created_total": 36,
    "nodes_merged_total": 24,
    "edges_created_total": 24,
    "edges_reused_total": 18,
    "prune_runs_total": 5,
    "prune_nodes_removed_total": 6,
    "prune_edges_removed_total": 4
  },
  "gauges": {
    "last_review_confidence": 0.87,
    "review_confidence_average": 0.74
  }
}
```
