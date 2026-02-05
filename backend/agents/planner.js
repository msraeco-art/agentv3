
import OpenAI from "openai";

let openai;
function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

export async function plannerAgent(userMessage, recalled) {
  const r = await getOpenAI().chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `Break tasks into steps.
Respond ONLY JSON:
{ "steps": [ { "worker": "researcher|coder|file|executor", "task": "..." } ] }`
      },
      { role: "assistant", content: "Relevant memory: " + recalled },
      { role: "user", content: userMessage }
    ]
  });
  return JSON.parse(r.choices[0].message.content);
}
