import type { Hooks } from "@opencode-ai/plugin"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { detectModelFamily, type ModelFamily } from "../prompts/types"
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

function buildExpertSection(family: ModelFamily): string {
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

const NO_SKILL_PROMPT: Record<ModelFamily, string> = {
  claude: `## 현재 활성 스킬: 없음
<routing-gate>
슬래시 커맨드가 실행되지 않았습니다.
자연어 의도를 분류하여 스킬을 결정하고 해당 절차를 따르십시오.
스킬을 결정할 수 없으면 반드시 되묻고, 임의로 진행하지 마십시오.
</routing-gate>`,

  gpt: `## 현재 활성 스킬: 없음

No slash command was executed.
Classify the intent from the message, map it to a skill, and follow that skill's procedure.
If intent is ambiguous — use the ask-back template. Do NOT proceed without a determined skill.`,

  gemini: `## 현재 활성 스킬: 없음

슬래시 커맨드 없음. 의도 분류 → 스킬 결정 → 절차 실행.
불명확하면 되묻기 템플릿 사용.`,

  default: `## 현재 활성 스킬: 없음

슬래시 커맨드가 없습니다. 자연어 의도를 분류하여 스킬을 결정하고 절차를 따르십시오.
불명확하면 되묻기 — 임의 진행 금지.`,
}

export const hooks: Partial<Hooks> = {
  "command.execute.before": async (input) => {
    const skillName = COMMAND_SKILL[input.command]
    if (skillName) {
      sessionSkill.set(input.sessionID, loadSkill(skillName))
    }
  },

  "experimental.chat.system.transform": async (input, output) => {
    const family = detectModelFamily(`${input.model.providerID}/${input.model.id}`)
    output.system.push(buildExpertSection(family))

    if (!input.sessionID) return
    const skill = sessionSkill.get(input.sessionID)
    if (skill) {
      output.system.push(skill)
    } else {
      output.system.push(NO_SKILL_PROMPT[family])
    }
  },
}
