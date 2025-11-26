#!/usr/bin/env bash
set -e

ollama pull gemma2:2B
ollama pull embeddinggemma

exec ollama serve
