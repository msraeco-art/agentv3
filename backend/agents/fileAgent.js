
import fs from "fs";
import path from "path";

const ROOT = "./workspace_files";

if (!fs.existsSync(ROOT)) fs.mkdirSync(ROOT);

export async function fileAgent(task) {
  if (task.startsWith("write")) {
    const [, file, ...content] = task.split(" ");
    fs.writeFileSync(path.join(ROOT, file), content.join(" "));
    return `\n[File] wrote ${file}`;
  }
  if (task.startsWith("read")) {
    const [, file] = task.split(" ");
    return fs.readFileSync(path.join(ROOT, file), "utf8");
  }
  return "[File] no action";
}
