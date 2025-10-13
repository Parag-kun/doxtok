import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

export const loadTextDocument = async (filePath: string) => {
  const loader = new TextLoader(filePath);
  return loader.load();
};

export const loadPDFDocument = async (filePath: string) => {
  const loader = new PDFLoader(filePath, { splitPages: true });
  return loader.load();
};

export const loadDocxDocument = async (filePath: string) => {
  const loader = new DocxLoader(filePath);
  return loader.load();
};

export const loadDocument = (filePath: string) => {
  const ext = filePath.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "txt": {
      return loadTextDocument(filePath);
    }
    case "pdf": {
      return loadPDFDocument(filePath);
    }
    case "docx": {
      return loadDocxDocument(filePath);
    }
    default: {
      throw new Error(`Unsupported file extension: .${ext}`);
    }
  }
};
