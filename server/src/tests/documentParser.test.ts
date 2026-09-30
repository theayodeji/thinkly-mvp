import { parsePdfBuffer } from "../services/content/sources/documentParser.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("documentParser", () => {
  it("should successfully parse a real PDF buffer and extract text", async () => {
    // Read the dummy PDF from fixtures
    const pdfPath = path.join(__dirname, "fixtures", "dummy.pdf");
    const buffer = fs.readFileSync(pdfPath);

    const text = await parsePdfBuffer(buffer);

    // The W3C dummy PDF contains the text "Dummy PDF file"
    expect(text).toBeDefined();
    expect(typeof text).toBe("string");
    expect(text.trim()).toContain("Dummy PDF file");
  });
});
