import { Ollama, OllamaEmbedding } from "@llamaindex/ollama";
import { Settings } from "llamaindex";

const ollama = new Ollama({
  model: "gemma2:2B",
  config: { host: Bun.env.OLLAMA_URL },
});

Settings.embedModel = new OllamaEmbedding({
  model: "embeddinggemma",
  config: { host: Bun.env.OLLAMA_URL },
});
Settings.llm = ollama;

export { ollama };
