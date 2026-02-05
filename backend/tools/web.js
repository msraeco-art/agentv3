
import fetch from "node-fetch";
export async function webSearch(query) {
  const res = await fetch(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
  const text = await res.text();
  return text.slice(0, 1200);
}
