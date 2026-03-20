import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI!);

function extractJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("AI did not return valid JSON.");
    }
    return JSON.parse(match[0]);
  }
}

function normalizeResumeData(data: any) {
  return {
    fullName: data?.fullName || "",
    email: data?.email || "",
    phone: data?.phone || "",
    summary: data?.summary || "",
    skills: Array.isArray(data?.skills)
      ? [...new Set(data.skills.map((s: string) => String(s).trim()))]
      : [],
    education: Array.isArray(data?.education)
      ? data.education.map((edu: any) => ({
          institution: edu?.institution || "",
          degree: edu?.degree || "",
          fieldOfStudy: edu?.fieldOfStudy || "",
          startDate: edu?.startDate || "",
          endDate: edu?.endDate || "",
        }))
      : [],
    experience: Array.isArray(data?.experience)
      ? data.experience.map((exp: any) => ({
          company: exp?.company || "",
          designation: exp?.designation || "",
          location: exp?.location || "",
          startDate: exp?.startDate || "",
          endDate: exp?.endDate || "",
          description: exp?.description || "",
        }))
      : [],
    certifications: Array.isArray(data?.certifications)
      ? data.certifications.map((cert: any) => ({
          title: cert?.title || "",
          issuer: cert?.issuer || "",
          year: cert?.year || "",
        }))
      : [],
    languages: Array.isArray(data?.languages)
      ? data.languages.map((l: string) => String(l))
      : [],
  };
}

export const parsedResumeWithAi = async (rawText: string) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = `
You are a STRICT JSON extraction engine.

CRITICAL RULES:
- Output MUST be valid JSON.
- Output MUST start with { and end with }.
- NO markdown.
- NO explanation.
- NO extra text.
- NEVER return null.
- If data is missing, use "" or [].
- Do NOT fabricate information.

Extract structured data from the resume below.

STRICT OUTPUT FORMAT:

{
  "fullName": "",
  "email": "",
  "phone": "",
  "summary": "",
  "skills": [],
  "education": [],
  "experience": [],
  "certifications": [],
  "languages": []
}

Resume:
${rawText}
`;

  const result = await model.generateContent(prompt);

  const rawResponse = result.response.text();

  const parsedJSON = extractJSON(rawResponse);

  const cleanData = normalizeResumeData(parsedJSON);

  return cleanData;
};