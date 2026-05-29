import type { Plugin, PluginModule } from "@opencode-ai/plugin"
import { createHooks } from "./hooks/index"
import { buildOrchestratorPrompt } from "./prompts/orchestrator"
import {
  buildBackendExpertPrompt,
  buildFrontendExpertPrompt,
  buildMobileExpertPrompt,
  buildQaExpertPrompt,
  buildSecurityExpertPrompt,
  buildPerformanceExpertPrompt,
  buildDbaExpertPrompt,
  buildDevopsExpertPrompt,
  buildArchitectureExpertPrompt,
} from "./prompts/agents"
import { detectModelFamily } from "./prompts/types"

const plugin: Plugin = async (ctx) => {
  return {
    ...createHooks(ctx),
    config: async (config) => {
      const model = config.model
      const family = detectModelFamily(model)
      config.agent = config.agent ?? {}
      config.agent.orchestrator = {
        description: "agent-core primary router. Classifies intent, loads skills, delegates to sub-agents.",
        mode: "primary",
        color: "#4A90D9",
        model,
        prompt: buildOrchestratorPrompt(model),
      }

      const experts: Array<{ key: string; description: string; color: string; prompt: string }> = [
        { key: "backend",      description: "API, 비즈니스 로직, 데이터 접근 전문가",              color: "#E8734A", prompt: buildBackendExpertPrompt(family) },
        { key: "frontend",     description: "UI, 컴포넌트, 상태관리, 접근성 전문가",               color: "#61DAFB", prompt: buildFrontendExpertPrompt(family) },
        { key: "mobile",       description: "iOS, Android, React Native, Flutter 전문가",          color: "#34C759", prompt: buildMobileExpertPrompt(family) },
        { key: "qa",           description: "테스트 전략, 엣지케이스, 회귀 검증 전문가",           color: "#FF9500", prompt: buildQaExpertPrompt(family) },
        { key: "security",     description: "OWASP Top 10, 인증·인가, 취약점 분석 전문가",         color: "#FF3B30", prompt: buildSecurityExpertPrompt(family) },
        { key: "performance",  description: "N+1, 렌더링 최적화, 번들 사이즈 전문가",              color: "#AF52DE", prompt: buildPerformanceExpertPrompt(family) },
        { key: "dba",          description: "스키마 설계, 마이그레이션, 쿼리 튜닝 전문가",         color: "#5856D6", prompt: buildDbaExpertPrompt(family) },
        { key: "devops",       description: "CI/CD, 컨테이너, 인프라 배포 전문가",                 color: "#FF6B6B", prompt: buildDevopsExpertPrompt(family) },
        { key: "architecture", description: "모듈 경계, 의존성, 시스템 확장성 전문가",             color: "#30B0C7", prompt: buildArchitectureExpertPrompt(family) },
      ]

      for (const { key, description, color, prompt } of experts) {
        config.agent[key] = { description, mode: "subagent", color, model, prompt }
      }

      config.command = config.command ?? {}
      Object.assign(config.command, {
        "core-dev":      { template: "dev: ", description: "[agent-core] 신규 기능 개발 · 코드 수정", agent: "orchestrator" },
        "core-debug":    { template: "debug: ", description: "[agent-core] 버그 · 오류 진단", agent: "orchestrator" },
        "core-test":     { template: "test: ", description: "[agent-core] 테스트 작성 · 커버리지", agent: "orchestrator" },
        "core-review":   { template: "review: ", description: "[agent-core] 코드 검토 · PR diff 분석", agent: "orchestrator" },
        "core-audit":    { template: "audit: ", description: "[agent-core] 보안 · 성능 감사", agent: "orchestrator" },
        "core-doc":      { template: "doc: ", description: "[agent-core] 문서화", agent: "orchestrator" },
        "core-setup":    { template: "setup: ", description: "[agent-core] 컨텍스트·템플릿 수집 및 관리", agent: "orchestrator" },
      })
    },
  }
}

export default {
  id: "agent-core",
  server: plugin,
} satisfies PluginModule
