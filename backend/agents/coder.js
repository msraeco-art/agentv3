
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function coderAgent(task) {
  const r = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "You write correct production code." },
      { role: "user", content: task }
    ]
  });
  return "\n[Code]\n" + r.choices[0].message.content;
}
