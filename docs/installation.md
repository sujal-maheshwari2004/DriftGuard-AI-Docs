---
id: installation
title: Installation
sidebar_position: 2
description: Install DriftGuard and its dependencies.
---

# Installation

## Requirements

- Python `>= 3.9`
- pip

## Install from PyPI

```bash
pip install driftguard-ai
```

## Install the spaCy model

DriftGuard uses spaCy for text normalization. After installing the package, download the model:

```bash
python -m spacy download en_core_web_sm
```

## Optional extras

Install test dependencies:

```bash
pip install "driftguard-ai[test]"
```

Install LangGraph demo dependencies:

```bash
pip install "driftguard-ai[demo]"
```

Install everything for local development:

```bash
pip install "driftguard-ai[dev]"
```

## Verify the install

```python
from driftguard import DriftGuard

guard = DriftGuard()
print(guard.stats())
# → {'nodes': 0, 'edges': 0}
```

## Entry points

Two CLI commands are installed automatically:

```bash
driftguard-mcp        # start the MCP server
driftguard-benchmark  # run the quality benchmark suite
```
