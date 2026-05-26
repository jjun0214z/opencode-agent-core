import { tool, type ToolDefinition } from "@opencode-ai/plugin"
import { appendHistory, upsertContext, upsertExternalFile } from "./db"

export function createAgentContextWriteTool(projectDir: string): ToolDefinition {
  return tool({
    description:
      "agent-core DB에 컨텍스트를 저장한다. " +
      "type=context: 프로젝트 컨텍스트 저장 (setup 모드1). " +
      "type=external: 외부파일 요약 저장 (setup 모드2, slug·source_path 필수). " +
      "type=history: 스킬 완료 기록 (skill 필수).",
    args: {
      type: tool.schema.enum(["context", "history", "external"]),
      content: tool.schema.string().describe("저장할 내용"),
      skill: tool.schema.string().optional().describe("history 타입 시 스킬명 (예: setup, dev, debug)"),
      slug: tool.schema.string().optional().describe("external 타입 시 파일 슬러그"),
      source_path: tool.schema.string().optional().describe("external 타입 시 원본 파일 경로"),
    },
    async execute({ type, content, skill, slug, source_path }) {
      if (type === "context") {
        upsertContext(projectDir, content)
        return "context 저장 완료"
      }
      if (type === "history") {
        appendHistory(projectDir, skill ?? "unknown", content)
        return "history 저장 완료"
      }
      if (type === "external") {
        if (!slug) return { title: "오류", output: "slug 필수" }
        upsertExternalFile(projectDir, slug, source_path ?? "", content)
        return `external/${slug} 저장 완료`
      }
      return { title: "오류", output: `알 수 없는 type: ${type}` }
    },
  })
}
