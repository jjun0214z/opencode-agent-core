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

      config.command = config.command ?? {}
      Object.assign(config.command, {
        "core-plan":     { template: "plan: {{}}", description: "[agent-core] 요구사항 분석 → 실행 계획", agent: "orchestrator" },
        "core-dev":      { template: "dev: {{}}", description: "[agent-core] 신규 기능 개발 · 코드 수정", agent: "orchestrator" },
        "core-refactor": { template: "refactor: {{}}", description: "[agent-core] 기능 변경 없는 구조 개선", agent: "orchestrator" },
        "core-debug":    { template: "debug: {{}}", description: "[agent-core] 버그 · 오류 진단", agent: "orchestrator" },
        "core-test":     { template: "test: {{}}", description: "[agent-core] 테스트 작성 · 커버리지", agent: "orchestrator" },
        "core-review":   { template: "review: {{}}", description: "[agent-core] 코드 검토", agent: "orchestrator" },
        "core-review-pr":{ template: "review-pr: {{}}", description: "[agent-core] PR diff 분석", agent: "orchestrator" },
        "core-audit":    { template: "audit: {{}}", description: "[agent-core] 보안 · 성능 감사", agent: "orchestrator" },
        "core-doc":      { template: "doc: {{}}", description: "[agent-core] 문서화", agent: "orchestrator" },
        "core-release":  { template: "release: {{}}", description: "[agent-core] 배포 게이트", agent: "orchestrator" },
        "core-setup":    { template: "setup: {{}}", description: "[agent-core] 프로젝트 컨텍스트 수집", agent: "orchestrator" },
      })
    },
  }
}

export default {
  id: "agent-core",
  server: plugin,
} satisfies PluginModule
