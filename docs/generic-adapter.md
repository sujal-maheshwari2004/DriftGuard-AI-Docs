---
id: generic-adapter
title: Generic Adapter
description: Review arbitrary planner payloads with DriftGuard's generic adapter.
---

# Generic Adapter

The generic adapter lets you review any Python dict payload without wiring up a full LangGraph graph.

## Basic usage

```python
from driftguard import DriftGuard, review_payload

guard = DriftGuard()

result = review_payload(
    guard,
    {"action": "increase salt", "attempt": 2},
)

print(result["warnings_count"])   # → 1
print(result["confidence"])       # → 0.84
print(result["review"].warnings[0].risk)  # → "too salty"
```

## Return shape

| Key              | Type              | Description                        |
|------------------|-------------------|------------------------------------|
| `payload`        | dict              | The original payload passed in     |
| `review`         | RetrievalResponse | Full DriftGuard review object      |
| `warnings_count` | int               | Number of warnings                 |
| `confidence`     | float             | Highest warning confidence         |

## Custom action key

If your payload uses a different key than `"action"`:

```python
result = review_payload(
    guard,
    {"next_action": "increase salt"},
    action_key="next_action",
)
```

## With acknowledgement

```python
result = review_payload(
    guard,
    {"action": "increase salt", "confirmed": True},
    acknowledged_key="confirmed",
    policy="acknowledge",
)
```

## With policy and confidence

```python
result = review_payload(
    guard,
    {"action": "increase salt"},
    policy="block",
    min_confidence=0.8,
)
```

## When to use the generic adapter

Use `review_payload` when:

- Your agent is not built on LangGraph
- You have a custom planner loop
- You want to review tool-call payloads before dispatch
- You are integrating DriftGuard into an existing pipeline without restructuring it
