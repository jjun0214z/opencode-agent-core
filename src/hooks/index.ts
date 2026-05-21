import type { Hooks, PluginInput } from "@opencode-ai/plugin"
import { readFileSync } from "node:fs"
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
import { detectModelFamily, type ModelFamily } from "../prompts/types"

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

const SKILL_TABLE = `어떤 작업인가요?

/plan — 요구사항 분석 → 실행 계획
/dev — 신규 기능 개발
/refactor — 기능 변경 없는 구조 개선
/debug — 버그 진단 + 최소 수정
/test — 테스트 작성/실행
/review — 코드 검토
/review-pr — PR diff 분석
/audit — 보안/성능 전체 감사
/doc — 문서 자동화
/release — 배포 전 게이트
/setup — 환경/MCP 연동 점검`

const NO_SKILL_PROMPT: Record<ModelFamily, string> = {
  claude: `## 현재 활성 스킬: 없음

<routing-gate>
STOP. 인사·잡담·질문 포함 모든 메시지는 스킬 없이 응답 금지.

- 자연어 의도가 스킬에 매핑되면 → 해당 스킬 절차 실행
- 매핑 불가 또는 인사/잡담 → 아래를 그대로 출력

${SKILL_TABLE}
</routing-gate>`,

  gpt: `## 현재 활성 스킬: 없음

STOP. Every message — including greetings — requires skill routing.

- If intent maps to a skill → follow that skill's procedure
- If intent is ambiguous or a greeting → output the following exactly:

${SKILL_TABLE}`,

  gemini: `## 현재 활성 스킬: 없음

STOP. 모든 메시지 스킬 라우팅 필수.

매핑 가능 → 스킬 절차 실행
매핑 불가(인사 포함) → 아래를 그대로 출력:

${SKILL_TABLE}`,

  default: `## 현재 활성 스킬: 없음

STOP. 인사 포함 모든 메시지 스킬 라우팅 필수.

매핑 가능 → 스킬 절차 실행
매핑 불가 → 아래를 그대로 출력:

${SKILL_TABLE}`,
}

export function createHooks(ctx: PluginInput): Partial<Hooks> {
  const sessionSkill = new Map<string, string>()
  const readmeInjector = createReadmeInjector(ctx.directory)

  return {
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

    // 파일 읽을 때 해당 디렉토리부터 루트까지 README.md 자동 주입
    "tool.execute.after": async (input, output) => {
      if (input.tool.toLowerCase() === "read") {
        await readmeInjector.processFileRead({
          filePath: output.title,
          sessionID: input.sessionID,
          output,
        })
      }
    },

    // 컨텍스트 압축 전 활성 스킬 보존 → 압축 모델에 전달
    "experimental.session.compacting": async (input, output) => {
      output.context.push(buildCompactionContext(input.sessionID, sessionSkill))
    },

    // 세션 종료/압축 시 메모리 정리
    event: async ({ event }) => {
      const props = event.properties as Record<string, unknown> | undefined
      const sessionID = (props?.sessionID ?? props?.id) as string | undefined
      if (sessionID && (event.type === "session.deleted" || event.type === "session.compacted")) {
        sessionSkill.delete(sessionID)
        readmeInjector.clearSession(sessionID)
      }
    },
  }
}
