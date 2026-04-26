---
id: changelog
title: Changelog
description: DriftGuard release history.
---

# Changelog

## v0.1.0

Initial release.

### Added

- Semantic merge engine with cosine similarity deduplication
- Similarity retrieval engine with confidence scoring and recency weighting
- Graph persistence — JSON (atomic writes) and SQLite backends
- MCP server with `register_mistake`, `query_memory`, `deep_prune`, `graph_stats`, `guard_metrics`
- LangGraph adapter — `make_langgraph_review_node`
- Generic payload adapter — `review_payload`
- `guard_step` decorator for wrapping agent step functions
- Guard policies: `warn`, `block`, `acknowledge`, `record_only`
- Deep pruning engine — weak edges, stale nodes, isolated nodes
- Runtime metrics — counters and gauges for all review and storage operations
- Offline benchmark harness — merge precision/recall and retrieval precision/recall
- Rule-based demo agent (offline, no model downloads required)
- LangGraph demo agent (LLM-driven planner loop)
- Full pytest suite
- MIT License
