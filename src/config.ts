import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { homedir } from "node:os"

export interface ModelEntry {
  model: string
}

export interface AgentCoreConfig {
  model: string
  fallback_models: ModelEntry[]
}

const DEFAULT_CONFIG: AgentCoreConfig = {
  model: "anthropic/claude-sonnet-4-6",
  fallback_models: [
    { model: "opencode/claude-sonnet-4-6" },
    { model: "anthropic/claude-opus-4-7" },
    { model: "opencode/claude-opus-4-7" },
    { model: "openai/gpt-5.5" },
    { model: "opencode/gpt-5.5" },
    { model: "opencode/big-pickle" },
  ],
}

export function loadConfig(): AgentCoreConfig {
  const configPath = join(homedir(), ".config", "opencode", "agent-core.json")
  if (!existsSync(configPath)) return DEFAULT_CONFIG

  try {
    const raw = readFileSync(configPath, "utf-8")
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_CONFIG
  }
}
