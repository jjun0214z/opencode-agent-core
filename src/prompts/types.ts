export type ModelFamily = "claude" | "gpt" | "gemini" | "default"

export function detectModelFamily(model?: string): ModelFamily {
  if (!model) return "default"
  const m = model.toLowerCase()
  if (m.includes("claude")) return "claude"
  // Cursor model IDs like cursor/codex-5.3 or cursor/composer-2.5
  // should follow GPT-style response formatting hints.
  if (
    m.includes("gpt") ||
    m.includes("codex") ||
    m.includes("composer") ||
    m.includes("/o1") ||
    m.includes("/o3") ||
    m.includes("/o4")
  ) return "gpt"
  if (m.includes("gemini")) return "gemini"
  return "default"
}
