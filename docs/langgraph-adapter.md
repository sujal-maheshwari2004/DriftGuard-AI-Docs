---
id: langgraph-adapter
title: LangGraph Adapter
description: Drop a DriftGuard review node into any LangGraph planner graph.
---

# LangGraph Adapter

DriftGuard ships a first-class LangGraph adapter that creates a review node you can drop directly into any `StateGraph`.

## Install dependencies

```bash
pip install "driftguard-ai[demo]"
```

## Basic usage

```python
from driftguard import DriftGuard
from driftguard import make_langgraph_review_node

guard = DriftGuard()
review_node = make_langgraph_review_node(guard)
```

## Drop into a StateGraph

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    candidate_action: str
    guard_warnings_count: int
    guard_confidence: float
    guard_top_warning: dict | None

graph = StateGraph(AgentState)

graph.add_node("plan", plan_node)
graph.add_node("review", review_node)
graph.add_node("execute", execute_node)

graph.set_entry_point("plan")
graph.add_edge("plan", "review")
graph.add_conditional_edges(
    "review",
    lambda state: "execute" if state["guard_warnings_count"] == 0 else "revise",
    {"execute": "execute", "revise": "revise"},
)
graph.add_edge("execute", END)

app = graph.compile()
```

## State keys written by the review node

| Key                    | Type          | Description                        |
|------------------------|---------------|------------------------------------|
| `guard_review`         | RetrievalResponse | Full review object              |
| `guard_warnings_count` | int           | Number of warnings found           |
| `guard_confidence`     | float         | Highest warning confidence         |
| `guard_top_warning`    | dict or None  | `trigger`, `risk`, `confidence`    |

## Custom key names

```python
review_node = make_langgraph_review_node(
    guard,
    action_key="next_action",         # read from this state key
    review_key="dg_review",           # write full review here
    warnings_key="dg_warnings",
    confidence_key="dg_confidence",
    top_warning_key="dg_top_warning",
)
```

## Policy inside the node

```python
review_node = make_langgraph_review_node(
    guard,
    policy="block",
    min_confidence=0.8,
)
```

## Demo agent

A full LangGraph demo with an LLM planner is included:

```bash
export OPENAI_API_KEY=your-key
python demo/langgraph/demo_agent.py --duration-seconds 120 --step-delay 4 --reset-graph
```

This runs a real planner → DriftGuard review → revision → execution loop with a live OpenAI-compatible model.
