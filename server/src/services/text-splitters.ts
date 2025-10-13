import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const chunkSize = 1000;
const chunkOverlap = 100;

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize,
  chunkOverlap,
  separators: ["\n\n", "\n", " ", ""],
});

export const splitTextsRecursively = (docs: Document[]) => {
  return textSplitter.splitDocuments(docs);
};
