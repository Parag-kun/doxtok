import { SentenceSplitter } from "llamaindex";

const chunkSize = 1000;
const chunkOverlap = 100;

export const sentenceSplitter = new SentenceSplitter({
  chunkOverlap,
  chunkSize,
});
