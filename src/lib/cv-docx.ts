import {
  Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat,
  BorderStyle, TabStopType,
} from "docx";
import type { CvAnalysis } from "./cv-analyzer.functions";

const FONT = "Calibri";

function name(text: string) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text, bold: true, size: 44, font: FONT })],
  });
}
function role(text: string) {
  if (!text) return null;
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 24, font: FONT, color: "555555" })],
  });
}
function contactLine(text: string) {
  if (!text) return null;
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, size: 20, font: FONT, color: "555555" })],
  });
}
function sectionHeading(text: string) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 2 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: FONT, characterSpacing: 30 })],
  });
}
function roleHeader(left: string, right: string) {
  return new Paragraph({
    spacing: { before: 120, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
    children: [
      new TextRun({ text: left, bold: true, size: 22, font: FONT }),
      new TextRun({ text: `\t${right}`, size: 22, font: FONT, color: "555555" }),
    ],
  });
}
function subHeader(text: string) {
  if (!text) return null;
  return new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text, italics: true, size: 22, font: FONT, color: "555555" })],
  });
}
function para(text: string) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22, font: FONT })],
  });
}
function bullet(text: string) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 22, font: FONT })],
  });
}

export async function buildOptimizedDocx(data: CvAnalysis, fileName: string): Promise<Blob> {
  const cv = data.optimizedCv;
  const children: (Paragraph | null)[] = [];

  // Fallback if AI didn't return optimizedCv: build minimal CV from sections
  const fullName = cv?.fullName || "Your Name";
  children.push(name(fullName));
  if (cv?.title) children.push(role(cv.title));

  if (cv?.contact) {
    const c = cv.contact;
    const parts = [c.email, c.phone, c.location, c.linkedin].filter(Boolean);
    if (parts.length) children.push(contactLine(parts.join("  •  ")));
  }

  if (cv?.summary) {
    children.push(sectionHeading("Professional Summary"));
    children.push(para(cv.summary));
  } else if (data.sections?.find((s) => /summary/i.test(s.name))) {
    const s = data.sections.find((x) => /summary/i.test(x.name))!;
    children.push(sectionHeading("Professional Summary"));
    children.push(para(s.rewrite));
  }

  if (cv?.experience?.length) {
    children.push(sectionHeading("Professional Experience"));
    cv.experience.forEach((e) => {
      const dates = [e.startDate, e.endDate].filter(Boolean).join(" — ");
      children.push(roleHeader(`${e.role}${e.company ? ` · ${e.company}` : ""}`, dates));
      if (e.location) children.push(subHeader(e.location));
      (e.bullets || []).forEach((b) => children.push(bullet(b)));
    });
  }

  if (cv?.projects?.length) {
    children.push(sectionHeading("Projects"));
    cv.projects.forEach((p) => {
      children.push(roleHeader(p.name, ""));
      if (p.description) children.push(para(p.description));
      (p.bullets || []).forEach((b) => children.push(bullet(b)));
    });
  }

  if (cv?.education?.length) {
    children.push(sectionHeading("Education"));
    cv.education.forEach((e) => {
      const dates = [e.startDate, e.endDate].filter(Boolean).join(" — ");
      children.push(roleHeader(`${e.degree}${e.institution ? ` · ${e.institution}` : ""}`, dates));
      if (e.location) children.push(subHeader(e.location));
      if (e.details) children.push(para(e.details));
    });
  }

  if (cv?.skills) {
    const s = cv.skills;
    const groups: [string, string[]][] = [
      ["Technical", s.technical || []],
      ["Tools", s.tools || []],
      ["Languages", s.languages || []],
      ["Soft Skills", s.soft || []],
    ].filter(([, v]) => v.length > 0) as [string, string[]][];
    if (groups.length) {
      children.push(sectionHeading("Skills"));
      groups.forEach(([label, items]) => {
        children.push(new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `${label}: `, bold: true, size: 22, font: FONT }),
            new TextRun({ text: items.join(", "), size: 22, font: FONT }),
          ],
        }));
      });
    }
  }

  if (cv?.certifications?.length) {
    children.push(sectionHeading("Certifications"));
    cv.certifications.forEach((c) => children.push(bullet(c)));
  }

  const doc = new Document({
    creator: "Hirely",
    title: `${fileName} — Optimized`,
    numbering: {
      config: [{
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      }],
    },
    sections: [{
      properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
      children: children.filter((c): c is Paragraph => c !== null),
    }],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

export async function downloadOptimizedCvDocx(data: CvAnalysis, fileName: string) {
  const base = fileName.replace(/\.[^.]+$/, "") || "cv";
  const blob = await buildOptimizedDocx(data, base);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${base}-optimized-hirely.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}