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
- Dual mistake/success memory graphs with positive reinforcement — `record_success`, `Reinforcement`, `RetrievalResponse.reinforcements`
- Graph persistence — JSON (atomic writes), SQLite, and Postgres backends (`driftguard-ai[postgres]`)
- MCP server with `register_mistake`, `register_success`, `query_memory`, `deep_prune`, `graph_stats`, `guard_metrics`
- LangGraph adapter — `make_langgraph_review_node`
- Generic payload adapter — `review_payload`
- `guard_step` decorator for wrapping agent step functions
- Guard policies: `warn`, `block`, `acknowledge`, `record_only`
- Deep pruning engine — weak edges, stale nodes, isolated nodes (runs over both memory graphs)
- Runtime metrics — counters and gauges for all review and storage operations
- Offline benchmark harness — merge precision/recall and retrieval precision/recall
- Rule-based demo agent (offline, no model downloads required)
- LangGraph demo agent (LLM-driven planner loop)
- Full pytest suite
- MIT License
