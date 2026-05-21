import type { Plugin, PluginModule } from "@opencode-ai/plugin"
import { readFileSync } from "node:fs"
import { join } from "node:path"

function loadPrompt(name: string): string {
  return readFileSync(join(import.meta.dir, "../prompts", name), "utf-8")
}

const plugin: Plugin = async () => {
  return {
    config: async (config) => {
      config.agent = config.agent ?? {}
      config.agent.orchestrator = {
        description: "Core orchestrator. Classifies intent, routes to specialized agents, enforces hard constraints.",
        mode: "primary",
        color: "#4A90D9",
        prompt: loadPrompt("orchestrator.md"),
      }
    },
  }
}

export default {
  id: "agent-core",
  server: plugin,
} satisfies PluginModule
