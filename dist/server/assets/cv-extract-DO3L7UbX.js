async function extractCvText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    const pdfjsLib = await import("pdfjs-dist");
    const workerSrc = (await import("./pdf.worker.min-dwAkBuWR.js")).default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it) => "str" in it ? it.str : "").join(" ") + "\n";
    }
    return text.trim();
  }
  if (name.endsWith(".docx")) {
    const mammoth = (await import("mammoth/mammoth.browser.js")).default;
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return (result.value || "").trim();
  }
  if (name.endsWith(".txt")) {
    return (await file.text()).trim();
  }
  throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
}
export {
  extractCvText as e
};
