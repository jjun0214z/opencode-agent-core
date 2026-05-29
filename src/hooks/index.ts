import type { Hooks, PluginInput } from "@opencode-ai/plugin"
import { buildCompactionContext, buildCompactionPrompt } from "../context/compaction"
import { createReadmeInjector } from "../context/readme-injector"
import {
  buildBackendExpertPrompt,
  buildFrontendExpertPrompt,
  buildMobileExpertPrompt,
  buildPerformanceExpertPrompt,
  buildQaExpertPrompt,
  buildSecurityExpertPrompt,
  buildDbaExpertPrompt,
  buildDevopsExpertPrompt,
  buildArchitectureExpertPrompt,
} from "../prompts/agents/index"
import { buildOrchestratorPrompt } from "../prompts/orchestrator"
import { detectModelFamily } from "../prompts/types"
import { getCurrentMonthHistory, getContext, getExternalFiles, getTemplates } from "../storage/db"
import { createAgentContextWriteTool, createAgentContextManageTool } from "../storage/tool"

function buildExpertSection(family: ReturnType<typeof detectModelFamily>): string {
  return [
    "## Expert Agent Prompts",
    "서브에이전트 위임 시 아래 expert 프롬프트를 사용한다.",
    "",
    buildBackendExpertPrompt(family),
    buildFrontendExpertPrompt(family),
    buildMobileExpertPrompt(family),
    buildQaExpertPrompt(family),
    buildSecurityExpertPrompt(family),
    buildPerformanceExpertPrompt(family),
    buildDbaExpertPrompt(family),
    buildDevopsExpertPrompt(family),
    buildArchitectureExpertPrompt(family),
  ].join("\n\n")
}

function buildContextSections(projectDir: string): string[] {
  const sections: string[] = []

  const context = getContext(projectDir)
  if (context) sections.push(context)

  const externals = getExternalFiles(projectDir)
  for (const f of externals) {
    sections.push(`## External: ${f.slug}\n> 출처: ${f.source_path}\n\n${f.content}`)
  }

  const templates = getTemplates()
  if (templates.length > 0) {
    const entries = templates.map(t => `### ${t.slug}\n${t.content}`).join("\n\n")
    sections.push(`# 저장된 문서 템플릿\n\n${entries}`)
  }

  const history = getCurrentMonthHistory(projectDir)
  if (history.length > 0) {
    const entries = history
      .map(h => {
        const date = new Date(h.created_at).toISOString().replace("T", " ").slice(0, 16)
        return `---\n## [${date}] ${h.skill}\n\n${h.content}`
      })
      .join("\n\n")
    sections.push(`# 이번 달 히스토리\n\n${entries}`)
  }

  return sections
}

export function createHooks(ctx: PluginInput): Partial<Hooks> {
  const readmeInjector = createReadmeInjector(ctx.directory)

  return {
    tool: {
      agent_context_write: createAgentContextWriteTool(ctx.directory),
      agent_context_manage: createAgentContextManageTool(ctx.directory),
    },

    "experimental.chat.system.transform": async (input, output) => {
      const modelStr = `${input.model.providerID}/${input.model.id}`
      const family = detectModelFamily(modelStr)
      const maybeInput = input as unknown as {
        agent?: string
        session?: { agent?: string }
      }
      const activeAgent = maybeInput.agent ?? maybeInput.session?.agent
      const shouldApplyCorePrompt = activeAgent === "orchestrator"

      const sections = [
        ...(shouldApplyCorePrompt ? [buildOrchestratorPrompt(modelStr), buildExpertSection(family)] : []),
        ...buildContextSections(ctx.directory),
      ]

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
      output.prompt = buildCompactionPrompt()
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
