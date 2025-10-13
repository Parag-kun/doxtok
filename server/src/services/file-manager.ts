import path from "node:path";
import { DocumentReference } from "../utils/types";
import sqlite from "./sqlite";
import { Documents } from "../drizzle/schema";
import { and, eq } from "drizzle-orm";
import { mkdir } from "node:fs/promises";

export const FILE_UPLOAD_DIR = `${process.cwd()}/../../uploads`;

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
  return sqlite
    .delete(Documents)
    .where(
      and(
        eq(Documents.sessionId, sessionId),
        referenceName ? eq(Documents.referenceName, referenceName) : undefined
      )
    )
    .returning();
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
