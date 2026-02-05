
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { plannerAgent } from "./agents/planner.js";
import { researcherAgent } from "./agents/researcher.js";
import { coderAgent } from "./agents/coder.js";
import { fileAgent } from "./agents/fileAgent.js";
import { executorAgent } from "./agents/executor.js";
import { initDatabase, saveMessage, loadMessages } from "./memory.js";
import { searchMemory, storeMemory } from "./vector/store.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Agent V3 is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Agent V3 is running",
    timestamp: new Date().toISOString()
  });
});

app.post("/agent", async (req, res) => {
  try {
    const { userMessage, workspace = "default" } = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ 
        error: "Missing or invalid 'userMessage' field" 
      });
    }

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
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;

// Initialize database before starting server
async function startServer() {
  try {
    console.log("Initializing database...");
    await initDatabase();
    console.log("Database initialized successfully");
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`V3 Agent running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
