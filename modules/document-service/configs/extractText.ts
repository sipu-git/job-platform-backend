import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import path from "path";

export async function extractText(
  buffer: Buffer,
  fileName: string
): Promise<string> {

  const ext = path.extname(fileName).toLowerCase();

  if (ext === ".pdf") {
    const parser = new PDFParse({
      data:buffer
    });
    const data = await parser.getText();
    return data.text;
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
    const { data: { text } } = await Tesseract.recognize(buffer, "eng");
    return text;
  }

  throw new Error("Unsupported file type");
}