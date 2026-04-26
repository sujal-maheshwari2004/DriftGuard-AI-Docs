---
id: contributing
title: Contributing
description: How to contribute to DriftGuard.
---

# Contributing

Thanks for contributing to DriftGuard.

## Development setup

```bash
git clone https://github.com/sujal-maheshwari2004/DriftGuard
cd DriftGuard
pip install -e ".[dev]"
python -m spacy download en_core_web_sm
```

## Running tests

Full suite:

```bash
python -m pytest
```

Collection only (fast check):

```bash
python -m pytest --collect-only
```

Benchmark:

```bash
driftguard-benchmark
```

## Project expectations

- Keep changes focused and easy to review
- Add or update pytest-compatible tests alongside behavior changes
- Prefer improving the shared runtime and documented public APIs over adding one-off entrypoints
- Preserve backward compatibility around public package imports, storage formats, and demos

## Areas where contributions are especially helpful

- Storage backends and migration safety
- Agent framework adapters
- Benchmark datasets and evaluation quality
- Observability and metrics export
- Docs and integration examples

## Pull request guidance

- Describe the problem and the user-facing change
- Mention any settings, storage, or API implications
- Include relevant test coverage
- Update `README.md` when the integration surface or documented behavior changes

## Repository

[github.com/sujal-maheshwari2004/DriftGuard](https://github.com/sujal-maheshwari2004/DriftGuard)
