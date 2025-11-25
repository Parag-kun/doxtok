import { loadDocument } from "./doc-loaders";
import {
  Document,
  MetadataFilter,
  storageContextFromDefaults,
  VectorStoreIndex,
} from "llamaindex";

export interface Metadata {
  sessionId: string;
  filename: string;
}

export interface FileData {
  filePath: string;
  metadata: Metadata;
}

const persistDir = `${process.cwd()}/vector-store`;
const storageContext = await storageContextFromDefaults({ persistDir });

export const addDocumentsToVS = async (filedata: FileData[]) => {
  return Promise.all(
    filedata.map(async ({ filePath, metadata }) => {
      const docs = await loadDocument(filePath);

      const loaded_docs = docs.map(
        (doc) => new Document({ text: doc.text, metadata })
      );

      await VectorStoreIndex.fromDocuments(loaded_docs, { storageContext });
    })
  );
};

export const removeDocumentsFromVS = async (metadata: Partial<Metadata>) => {
  const docs = await getTopKRelevantDocumentsFromVS("", metadata, 1000);

  const docIdsToDelete = docs.map((doc) => doc.node.id_);

  for (const docId of docIdsToDelete) {
    await storageContext.docStore.deleteDocument(docId, true);
  }
};

export const getTopKRelevantDocumentsFromVS = async (
  query: string,
  metadata: Partial<Metadata>,
  k = 5
) => {
  const metadataKeys = Object.keys(metadata);

  if (metadataKeys.length === 0) {
    throw new Error("At least one metadata field must be provided");
  }

  const index = await VectorStoreIndex.init({ storageContext });

  const filters = Object.entries(metadata).map(([key, val]) => ({
    key,
    operator: "==" as MetadataFilter["operator"],
    value: val,
  }));

  const retriever = index.asRetriever({
    filters: { filters },
    similarityTopK: k,
  });

  return retriever.retrieve({ query });
};
