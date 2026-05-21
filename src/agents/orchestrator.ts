import type { AgentConfig } from "@opencode-ai/sdk"
import { readFileSync } from "fs"
import { join } from "path"

function loadPrompt(name: string): string {
  return readFileSync(
    join(import.meta.dir, "../../prompts", name),
    "utf-8"
  )
}

export function createOrchestratorAgent(model: string): AgentConfig {
  const basePrompt = loadPrompt("orchestrator.md")

  return {
    description: "Core orchestrator. Classifies intent, routes to specialized agents, enforces hard constraints.",
    mode: "primary",
    model,
    maxTokens: 32000,
    prompt: basePrompt,
    color: "#4A90D9",
    permission: {
      question: "allow",
    },
  }
}
