import { PDFReader } from "@llamaindex/readers/pdf"
import { DocxReader } from "@llamaindex/readers/docx"
import { TextFileReader } from "@llamaindex/readers/text"

export const loadTextDocument = async (filePath: string) => {
  const reader = new TextFileReader();
  return reader.loadData(filePath)
};

export const loadPDFDocument = async (filePath: string) => {
  const reader = new PDFReader();
  return reader.loadData(filePath)
};

export const loadDocxDocument = async (filePath: string) => {
  const reader = new DocxReader();
  return reader.loadData(filePath);
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
