import type { Plugin, PluginModule } from "@opencode-ai/plugin"
import { hooks } from "./hooks/index"
import { loadConfig } from "./config"
import { resolveModel } from "./model-resolver"
import { buildOrchestratorPrompt } from "./prompts/orchestrator"

const plugin: Plugin = async () => {
  const agentConfig = loadConfig()

  return {
    ...hooks,
    config: async (config) => {
      const model = resolveModel(agentConfig, config)
      config.agent = config.agent ?? {}
      config.agent.orchestrator = {
        description: "Core orchestrator. Classifies intent, loads skills, delegates to sub-agents.",
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
