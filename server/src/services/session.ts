import path from "node:path";

import { createSessionId } from "../utils/crypto";
import { addDocumentsToChroma, removeDocumentsFromChroma } from "./chroma";
import {
  removeFile,
  addFiles,
  FILE_UPLOAD_DIR,
  getFileRefs,
} from "./file-manager";
import sqlite from "./sqlite";
import { count, eq } from "drizzle-orm";
import { Documents } from "../drizzle/schema";

export const createSession = async (documents: File[]) => {
  const sessionId = createSessionId();

  const documentRefs = await addFiles(documents, sessionId);

  const filedata = documentRefs.map((docRef) => ({
    filePath: path.join(FILE_UPLOAD_DIR, docRef.referenceName),
    metadata: { sessionId, filename: docRef.referenceName },
  }));

  await addDocumentsToChroma(filedata);

  return sessionId;
};

export const addDocumentToSession = async (
  document: File,
  sessionId: string
) => {
  const [{ count: fileCount = 0 } = {}] = sqlite
    .select({ count: count(Documents.id) })
    .from(Documents)
    .where(eq(Documents.sessionId, sessionId))
    .all();

  if (fileCount >= 3) {
    throw new Error("Maximum 3 files are allowed per session");
  }

  const [fileRef] = await addFiles([document], sessionId);

  const filedata = {
    filePath: path.join(FILE_UPLOAD_DIR, fileRef.referenceName),
    metadata: { sessionId, filename: fileRef.referenceName },
  };

  await addDocumentsToChroma([filedata]);

  return fileRef;
};

export const removeFileFromSession = async (
  sessionId: string,
  referenceName?: string
) => {
  await removeFile(sessionId, referenceName);
  await removeDocumentsFromChroma({ sessionId, filename: referenceName });
};

export const getFIleUrls = (hostname: string, sessionId: string) => {
  const fileRefs = getFileRefs(sessionId);

  return fileRefs.map((file) => `${hostname}/documents/${file.referenceName}`);
};
