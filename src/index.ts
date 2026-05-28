import type { Plugin, PluginModule } from "@opencode-ai/plugin"
import { createHooks } from "./hooks/index"
import { buildOrchestratorPrompt } from "./prompts/orchestrator"

const plugin: Plugin = async (ctx) => {
  return {
    ...createHooks(ctx),
    config: async (config) => {
      const model = config.model
      config.agent = config.agent ?? {}
      config.agent.orchestrator = {
        description: "agent-core primary router. Classifies intent, loads skills, delegates to sub-agents.",
        mode: "primary",
        color: "#4A90D9",
        model,
        prompt: buildOrchestratorPrompt(model),
      }
    },
  }
}

export default {
  id: "agent-core",
  server: plugin,
} satisfies PluginModule
