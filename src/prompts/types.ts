export type ModelFamily = "claude" | "gpt" | "gemini" | "default"

export function detectModelFamily(model?: string): ModelFamily {
  if (!model) return "default"
  const m = model.toLowerCase()
  if (m.includes("claude")) return "claude"
  if (m.includes("gpt") || m.includes("/o1") || m.includes("/o3") || m.includes("/o4")) return "gpt"
  if (m.includes("gemini")) return "gemini"
  return "default"
}
