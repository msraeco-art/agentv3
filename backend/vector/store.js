
import OpenAI from "openai";

let openai;
function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

const store = [];

export async function storeMemory(workspace, text) {
  const e = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });
  store.push({ workspace, text, vector: e.data[0].embedding });
}

function cosine(a,b){
  return a.reduce((s,v,i)=>s+v*b[i],0);
}

export async function searchMemory(workspace, query) {
  if (!store.length) return "";
  const e = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: query
  });
  const qv = e.data[0].embedding;
  const matches = store
    .filter(m => m.workspace === workspace)
    .map(m => ({ text: m.text, score: cosine(m.vector, qv) }))
    .sort((a,b)=>b.score-a.score)
    .slice(0,3)
    .map(m=>m.text)
    .join("\n");
  return matches;
}
