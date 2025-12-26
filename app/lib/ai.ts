import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "", // Get free API key from https://console.groq.com
});

export async function reviewCode(diff: string) {
  const prompt = `
You are a senior software engineer.
Review the following GitHub PR diff.

Focus on:
- Logic bugs
- Performance issues
- Security risks
- Maintainability

Respond ONLY in bullet points.
If unsure, say "UNCERTAIN".

Diff:
${diff}
`;

  const res = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b", // or "mixtral-8x7b-32768" for faster responses
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content;
}