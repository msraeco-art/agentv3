
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { managerAgent } from "./agents/manager.js";
import { plannerAgent } from "./agents/planner.js";
import { researcherAgent } from "./agents/researcher.js";
import { coderAgent } from "./agents/coder.js";
import { fileAgent } from "./agents/fileAgent.js";
import { executorAgent } from "./agents/executor.js";
import { saveMessage, loadMessages } from "./memory.js";
import { searchMemory, storeMemory } from "./vector/store.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/agent", async (req, res) => {
  const { userMessage, workspace = "default" } = req.body;

  await saveMessage(workspace, "user", userMessage);
  const memory = await loadMessages(workspace);

  // long-term recall
  const recalled = await searchMemory(workspace, userMessage);

  const plan = await plannerAgent(userMessage, recalled);

  let output = "";
  for (const step of plan.steps) {
    if (step.worker === "researcher") output += await researcherAgent(step.task);
    if (step.worker === "coder") output += await coderAgent(step.task);
    if (step.worker === "file") output += await fileAgent(step.task);
    if (step.worker === "executor") output += await executorAgent(step.task);
  }

  await storeMemory(workspace, userMessage + " " + output);
  await saveMessage(workspace, "assistant", output);

  res.json({ role: "assistant", content: output });
});

app.listen(3001, () => console.log("V3 Agent running on 3001"));
