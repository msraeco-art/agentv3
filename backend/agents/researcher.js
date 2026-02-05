
import { webSearch } from "../tools/web.js";
export async function researcherAgent(task) {
  return "\n[Research]\n" + await webSearch(task);
}
