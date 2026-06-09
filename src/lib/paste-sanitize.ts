/** Strip HTML, decode common entities, collapse whitespace. */
export function sanitizePaste(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/?(p|div|li|br|tr|h\d|section)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Returns a human error if the pasted LinkedIn content looks too thin. */
export function validateLinkedinPaste(input: string): { clean: string; error: string | null } {
  const clean = sanitizePaste(input);
  const words = clean.split(/\s+/).filter(Boolean).length;
  if (clean.length < 200 || words < 40) {
    return {
      clean,
      error:
        "Paste more of your profile — include your headline, About section, and at least one Experience entry (around 200+ characters).",
    };
  }
  const low = clean.toLowerCase();
  const sectionHints = ["experience", "about", "skills", "education", "headline", "present"];
  const hits = sectionHints.filter((k) => low.includes(k)).length;
  if (hits < 2) {
    return {
      clean,
      error:
        "Couldn't detect profile sections (Headline / About / Experience). Copy each section from LinkedIn and paste it together.",
    };
  }
  return { clean, error: null };
}