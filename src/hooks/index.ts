import type { Hooks } from "@opencode-ai/plugin"
import { readFileSync } from "node:fs"
import { join } from "node:path"

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

export const hooks: Partial<Hooks> = {
  "command.execute.before": async (input) => {
    const skillName = COMMAND_SKILL[input.command]
    if (skillName) {
      sessionSkill.set(input.sessionID, loadSkill(skillName))
    }
  },

  "experimental.chat.system.transform": async (input, output) => {
    if (!input.sessionID) return
    const skill = sessionSkill.get(input.sessionID)
    if (skill) {
      output.system.push(skill)
    }
  },
}
