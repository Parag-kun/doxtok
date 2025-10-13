import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

const embedder = new HuggingFaceTransformersEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2",
});

export default embedder;
