import type { Config } from "@opencode-ai/plugin"
import type { AgentCoreConfig } from "./config"

export function resolveModel(agentConfig: AgentCoreConfig, opencode: Config): string {
  const chain = [
    { model: agentConfig.model },
    ...agentConfig.fallback_models,
  ]

  for (const entry of chain) {
    if (isAvailable(entry.model, opencode)) return entry.model
  }

  return "opencode/big-pickle"
}

function isAvailable(model: string, config: Config): boolean {
  const [provider] = model.split("/")

  // opencode/* 는 항상 사용 가능 (OpenCode 구독 커버)
  if (provider === "opencode") return true

  // disabled_providers 에 명시된 경우 제외
  if (config.disabled_providers?.includes(provider)) return false

  // enabled_providers 가 있으면 그 안에 있어야 함
  if (config.enabled_providers?.length) {
    return config.enabled_providers.includes(provider)
  }

  // provider 설정이 있거나 env에 API key가 있으면 사용 가능으로 간주
  if (config.provider?.[provider]) return true

  const envKey = `${provider.toUpperCase().replace(/-/g, "_")}_API_KEY`
  if (process.env[envKey]) return true

  return false
}
