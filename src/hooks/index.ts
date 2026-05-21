import type { Hooks, PluginInput } from "@opencode-ai/plugin"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { buildCompactionContext } from "../context/compaction"
import { createReadmeInjector } from "../context/readme-injector"
import {
  buildBackendExpertPrompt,
  buildFrontendExpertPrompt,
  buildPerformanceExpertPrompt,
  buildQaExpertPrompt,
  buildSecurityExpertPrompt,
} from "../prompts/agents/index"
import { buildOrchestratorPrompt } from "../prompts/orchestrator"
import { detectModelFamily } from "../prompts/types"

function buildExpertSection(family: ReturnType<typeof detectModelFamily>): string {
  return [
    "## Expert Agent Prompts",
    "서브에이전트 위임 시 아래 expert 프롬프트를 사용한다.",
    "",
    buildBackendExpertPrompt(family),
    buildFrontendExpertPrompt(family),
    buildQaExpertPrompt(family),
    buildSecurityExpertPrompt(family),
    buildPerformanceExpertPrompt(family),
  ].join("\n\n")
}

export function createHooks(ctx: PluginInput): Partial<Hooks> {
  const readmeInjector = createReadmeInjector(ctx.directory)

  return {
    "experimental.chat.system.transform": async (input, output) => {
      const modelStr = `${input.model.providerID}/${input.model.id}`
      const family = detectModelFamily(modelStr)

      const sections = [buildOrchestratorPrompt(modelStr), buildExpertSection(family)]

      const contextPath = join(ctx.directory, ".agent-core", "context.md")
      if (existsSync(contextPath)) {
        sections.push(readFileSync(contextPath, "utf-8"))
      }

      output.system.push(...sections)
    },

    "tool.execute.after": async (input, output) => {
      if (input.tool.toLowerCase() === "read") {
        await readmeInjector.processFileRead({
          filePath: output.title,
          sessionID: input.sessionID,
          output,
        })
      }
    },

    "experimental.session.compacting": async (_input, output) => {
      output.context.push(buildCompactionContext())
    },

    event: async ({ event }) => {
      const props = event.properties as Record<string, unknown> | undefined
      const sessionID = (props?.sessionID ?? props?.id) as string | undefined
      if (sessionID && (event.type === "session.deleted" || event.type === "session.compacted")) {
        readmeInjector.clearSession(sessionID)
      }
    },
  }
}
