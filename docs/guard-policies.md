---
id: guard-policies
title: Guard Policies
description: Control how DriftGuard reacts when it detects a risky action.
---

# Guard Policies

Guard policies control what DriftGuard does when `before_step()` detects a warning that meets the confidence threshold.

## Policies

| Policy        | Behavior                                      |
|---------------|-----------------------------------------------|
| `warn`        | Return warnings — agent decides what to do    |
| `block`       | Raise `GuardrailTriggered` exception           |
| `acknowledge` | Raise `GuardrailAcknowledgementRequired` unless `acknowledged=True` |
| `record_only` | Skip review entirely — store memory only      |

## Setting the default policy

```python
from driftguard import DriftGuard, DriftGuardSettings

guard = DriftGuard(
    settings=DriftGuardSettings(
        guard_policy="block",
        guard_min_confidence=0.8,
    )
)
```

## Overriding per call

```python
review = guard.before_step(
    "increase salt",
    policy="acknowledge",
    min_confidence=0.75,
)
```

## Warn (default)

The default policy. Warnings are returned in the `RetrievalResponse` but no exception is raised. The agent can inspect and decide.

```python
review = guard.before_step("increase salt")

for warning in review.warnings:
    print(f"{warning.trigger} → {warning.risk} ({warning.confidence:.2f})")
```

## Block

Raises `GuardrailTriggered` when warnings exist above `min_confidence`.

```python
from driftguard import GuardrailTriggered

try:
    guard.before_step("increase salt", policy="block", min_confidence=0.8)
except GuardrailTriggered as e:
    print(f"Blocked: {e}")
    # agent takes alternative action
```

## Acknowledge

Raises `GuardrailAcknowledgementRequired` unless the caller passes `acknowledged=True`. Useful for human-in-the-loop flows.

```python
from driftguard import GuardrailAcknowledgementRequired

try:
    guard.before_step("increase salt", policy="acknowledge")
except GuardrailAcknowledgementRequired:
    # show warning to human, get confirmation
    guard.before_step("increase salt", policy="acknowledge", acknowledged=True)
```

## Record only

Skips the retrieval review entirely. Memory is still stored when you call `record()`. Useful for observation-only phases.

```python
review = guard.before_step("increase salt", policy="record_only")
# review.warnings == []
# review.confidence == 0.0
```

## `guard_step` decorator

Apply guardrails to any agent step function:

```python
from driftguard import guard_step

@guard_step(guard, policy="block", min_confidence=0.8)
def execute_action(action: str):
    ...
```

Custom context extraction:

```python
@guard_step(
    guard,
    input_getter=lambda payload: payload["next_action"],
    policy="acknowledge",
    acknowledged_getter=lambda payload: payload["confirmed"],
)
def execute(payload: dict):
    ...
```
