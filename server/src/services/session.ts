import path from "node:path";

import { createSessionId, type SessionID } from "../utils/crypto";
import {
  removeFile,
  addFiles,
  FILE_UPLOAD_DIR,
  getFileRefs,
} from "./file-manager";
import sqlite from "../lib/drizzle/sqlite";
import { count, eq, min } from "drizzle-orm";
import { Documents } from "../lib/drizzle/schema";
import {
  addDocumentsToVS,
  removeDocumentsFromVS,
} from "../lib/llama-index/storage";

export const CREATE_SESSION_STORE = new Set<SessionID>();

export const createSession = async (
  documents: File[],
  onSessionCreation: (sessionId: SessionID) => any
) => {
  const sessionId = createSessionId();

  onSessionCreation(sessionId);

  const documentRefs = await addFiles(documents, sessionId);

  const filedata = documentRefs.map((docRef) => ({
    filePath: path.join(FILE_UPLOAD_DIR, docRef.referenceName),
    metadata: { sessionId, filename: docRef.referenceName },
  }));

  await addDocumentsToVS(filedata);

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

  await addDocumentsToVS([filedata]);

  return fileRef;
};

export const removeFileFromSession = async (
  sessionId: string,
  referenceName?: string
) => {
  await removeFile(sessionId, referenceName);
  await removeDocumentsFromVS({ sessionId, filename: referenceName });
};

export const getFIleUrls = (sessionId: string) => {
  const fileRefs = getFileRefs(sessionId);

  return fileRefs.map((file) => `/documents/${file.referenceName}`);
};

export const getSessionCreationTime = async (sessionId: string) => {
  const res = await sqlite
    .select({ createdAt: min(Documents.createdAt) })
    .from(Documents)
    .where(eq(Documents.sessionId, sessionId));

  return res[0]?.createdAt;
};
