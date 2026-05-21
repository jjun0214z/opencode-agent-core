import type { Plugin, PluginModule } from "@opencode-ai/plugin"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { hooks } from "./hooks/index"

function loadPrompt(name: string): string {
  return readFileSync(join(import.meta.dir, "../prompts", name), "utf-8")
}

const plugin: Plugin = async () => {
  return {
    ...hooks,
    config: async (config) => {
      config.agent = config.agent ?? {}
      config.agent.orchestrator = {
        description: "Core orchestrator. Classifies intent, loads skills, delegates to sub-agents.",
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
