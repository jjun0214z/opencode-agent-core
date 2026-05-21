import type { Hooks } from "@opencode-ai/plugin"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { detectModelFamily } from "../prompts/types"
import {
  buildBackendExpertPrompt,
  buildFrontendExpertPrompt,
  buildQaExpertPrompt,
  buildSecurityExpertPrompt,
  buildPerformanceExpertPrompt,
} from "../prompts/agents/index"

const COMMAND_SKILL: Record<string, string> = {
  "plan": "plan",
  "dev": "dev",
  "refactor": "refactor",
  "debug": "debug",
  "test": "test",
  "review": "review",
  "review-pr": "review-pr",
  "audit": "audit",
  "doc": "doc",
  "release": "release",
  "setup": "setup",
}

const sessionSkill = new Map<string, string>()

function loadSkill(name: string): string {
  return readFileSync(
    join(import.meta.dir, "../../prompts/skills", `${name}.md`),
    "utf-8"
  )
}

function buildExpertSection(modelId: string, providerId: string): string {
  const family = detectModelFamily(`${providerId}/${modelId}`)
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

export const hooks: Partial<Hooks> = {
  "command.execute.before": async (input) => {
    const skillName = COMMAND_SKILL[input.command]
    if (skillName) {
      sessionSkill.set(input.sessionID, loadSkill(skillName))
    }
  },

  "experimental.chat.system.transform": async (input, output) => {
    // expert 프롬프트 항상 주입 (모델 감지)
    output.system.push(buildExpertSection(input.model.id, input.model.providerID))

    // 활성 스킬 주입
    if (!input.sessionID) return
    const skill = sessionSkill.get(input.sessionID)
    if (skill) {
      output.system.push(skill)
    }
  },
}
