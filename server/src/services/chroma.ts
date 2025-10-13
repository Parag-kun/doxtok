import { Chroma } from "@langchain/community/vectorstores/chroma";
import embedder from "./embedder";
import { splitTextsRecursively } from "./text-splitters";
import { loadDocument } from "./doc-loaders";

export interface Metadata {
  sessionId: string;
  filename: string;
}

export interface FileData {
  filePath: string;
  metadata: Metadata;
}

const chromaStore = await Chroma.fromExistingCollection(embedder, {
  collectionName: "my_docs",
  url: "localhost:8000",
}).catch(async () => {
  return Chroma.fromDocuments([], embedder, {
    collectionName: "my_docs",
    url: "localhost:8000",
  });
});

export const addDocumentsToChroma = async (filedata: FileData[]) => {
  return Promise.all(
    filedata.map(async ({ filePath, metadata }) => {
      const docs = await loadDocument(filePath);

      const loadedDocs = docs.map((doc) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          ...metadata,
        },
      }));

      const splittedDocs = await splitTextsRecursively(loadedDocs);

      await chromaStore.addDocuments(splittedDocs);
    })
  );
};

export const removeDocumentsFromChroma = async (
  metadata: Partial<Metadata>
) => {
  const metadataKeys = Object.keys(metadata);

  if (metadataKeys.length === 0) {
    throw new Error("At least one metadata field must be provided");
  }

  chromaStore.delete({ filter: { ...metadata } });
};

export const fetchRelevantDocuments = async (
  question: string,
  metadata: Partial<Metadata>
) => {
  
};

export default chromaStore;
