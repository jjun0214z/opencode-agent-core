import type { PluginModule } from "@opencode-ai/plugin"
import { createOrchestratorAgent } from "./agents/orchestrator"

const pluginModule: PluginModule = {
  agents: (ctx) => ({
    orchestrator: createOrchestratorAgent(ctx.model),
  }),
  hooks: {},
}

export default pluginModule
