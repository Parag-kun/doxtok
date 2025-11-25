import path from "node:path";
import sqlite from "../lib/drizzle/sqlite";
import { Documents } from "../lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { mkdir, unlink } from "node:fs/promises";
import { SessionID } from "../utils/crypto";

export interface DocumentReference {
  referenceName: string;
  originalName: string;
}

export const FILE_UPLOAD_DIR = `${process.cwd()}/uploads`;
export const DOCUMENT_OPERATION_STORE = new Set<SessionID>();

try {
  await mkdir(FILE_UPLOAD_DIR, { recursive: true });
} catch (err: any) {
  if (err.code !== "EEXIST") {
    throw err;
  }
}

// Save Files in file system
export const saveFiles = async (files: File[]) => {
  return Promise.all(
    files.map(async (file) => {
      const originalName = path.basename(file.name);
      const referenceName = `${Date.now()}-${originalName}`;
      const destPath = path.join(FILE_UPLOAD_DIR, referenceName);

      // file.stream() gives ReadableStream
      const rs = file.stream();

      // Create a Response from stream
      const resp = new Response(rs);

      // Bun.write consumes the response body and writes it to file
      await Bun.write(destPath, resp);

      return { originalName, referenceName };
    })
  );
};

// reference file names within sqlite
export const referenceFiles = async (
  docRefs: DocumentReference[],
  sessionId: string
) => {
  const rows = docRefs.map((docRef) => ({ sessionId, ...docRef }));

  await sqlite.insert(Documents).values(rows);
};

export const addFiles = async (documents: File[], sessionId: string) => {
  const documentRefs = await saveFiles(documents);

  await referenceFiles(documentRefs, sessionId);

  return documentRefs;
};

export const removeFile = async (sessionId: string, referenceName?: string) => {
  const fileRefs = await sqlite
    .delete(Documents)
    .where(
      and(
        eq(Documents.sessionId, sessionId),
        referenceName ? eq(Documents.referenceName, referenceName) : undefined
      )
    )
    .returning();

  const filePaths = fileRefs.map(
    (ref) => `${FILE_UPLOAD_DIR}/${ref.referenceName}`
  );

  await Promise.all(
    filePaths.map(async (path) => {
      await unlink(path);
    })
  );

  return fileRefs;
};

export const getFileRefs = (sessionId: string) => {
  return sqlite
    .select()
    .from(Documents)
    .where(eq(Documents.sessionId, sessionId))
    .all();
};

export const getFile = (sessionId: string, referenceName: string) => {
  const fileRef = sqlite
    .select()
    .from(Documents)
    .where(
      and(
        eq(Documents.sessionId, sessionId),
        eq(Documents.referenceName, referenceName)
      )
    )
    .get();

  if (!fileRef) {
    throw new Error(`File ${referenceName} not found for session ${sessionId}`);
  }

  const filePath = path.join(FILE_UPLOAD_DIR, fileRef.referenceName);

  return { file: Bun.file(filePath), fileRef };
};
