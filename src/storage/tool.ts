import { tool, type ToolDefinition } from "@opencode-ai/plugin"
import {
  appendHistory,
  clearContext,
  clearHistory,
  deleteExternalFile,
  deleteTemplate,
  listAll,
  upsertContext,
  upsertExternalFile,
  upsertTemplate,
} from "./db"

export function createAgentContextWriteTool(projectDir: string): ToolDefinition {
  return tool({
    description:
      "agent-core DB에 컨텍스트를 저장한다. " +
      "type=context: 프로젝트 컨텍스트 저장 (setup 모드1). " +
      "type=external: 외부파일 요약 저장 (setup 모드2, slug·source_path 필수). " +
      "type=template: 문서 템플릿 저장 (setup 모드3, slug 필수). " +
      "type=history: 스킬 완료 기록 (skill 필수).",
    args: {
      type: tool.schema.enum(["context", "history", "external", "template"]),
      content: tool.schema.string().describe("저장할 내용"),
      skill: tool.schema.string().optional().describe("history 타입 시 스킬명 (예: setup, dev, debug)"),
      slug: tool.schema.string().optional().describe("external·template 타입 시 슬러그"),
      source_path: tool.schema.string().optional().describe("external 타입 시 원본 파일 경로"),
    },
    async execute({ type, content, skill, slug, source_path }): Promise<string> {
      if (type === "context") {
        upsertContext(projectDir, content)
        return "context 저장 완료"
      }
      if (type === "history") {
        appendHistory(projectDir, skill ?? "unknown", content)
        return "history 저장 완료"
      }
      if (type === "external") {
        if (!slug) return "오류: slug 필수"
        upsertExternalFile(projectDir, slug, source_path ?? "", content)
        return `external/${slug} 저장 완료`
      }
      if (type === "template") {
        if (!slug) return "오류: slug 필수"
        upsertTemplate(projectDir, slug, content)
        return `template/${slug} 저장 완료`
      }
      return `오류: 알 수 없는 type: ${type}`
    },
  })
}

function handleList(projectDir: string): string {
  const { context, externals, templates, historyMonths } = listAll(projectDir)
  const lines: string[] = ["## 저장된 항목"]
  lines.push(`- context: ${context ? "있음" : "없음"}`)
  if (externals.length > 0) {
    lines.push(`- external (${externals.length}개):`)
    for (const e of externals) lines.push(`  - ${e.slug}  ← ${e.source_path || "경로 없음"}`)
  } else {
    lines.push("- external: 없음")
  }
  if (templates.length > 0) {
    lines.push(`- template (${templates.length}개):`)
    for (const t of templates) lines.push(`  - ${t.slug}`)
  } else {
    lines.push("- template: 없음")
  }
  lines.push(historyMonths.length > 0 ? `- history: ${historyMonths.join(", ")}` : "- history: 없음")
  return lines.join("\n")
}

function handleDelete(
  projectDir: string,
  type: "context" | "external" | "template" | "history" | undefined,
  slug: string | undefined,
): string {
  if (!type) return "오류: delete 시 type 필수"
  if (type === "context") {
    clearContext(projectDir)
    return "context 삭제 완료"
  }
  if (type === "external") {
    if (!slug) return "오류: external 삭제 시 slug 필수"
    deleteExternalFile(projectDir, slug)
    return `external/${slug} 삭제 완료`
  }
  if (type === "template") {
    if (!slug) return "오류: template 삭제 시 slug 필수"
    deleteTemplate(projectDir, slug)
    return `template/${slug} 삭제 완료`
  }
  // type === "history"
  clearHistory(projectDir, slug)
  return slug ? `history/${slug} 삭제 완료` : "history 전체 삭제 완료"
}

export function createAgentContextManageTool(projectDir: string): ToolDefinition {
  return tool({
    description:
      "agent-core DB에 저장된 컨텍스트를 조회·삭제한다. " +
      "action=list: 저장된 항목 전체 목록 반환. " +
      "action=delete: 항목 삭제 (type 필수). " +
      "  type=context → 프로젝트 컨텍스트 삭제. " +
      "  type=external, slug 필수 → 외부파일 삭제. " +
      "  type=template, slug 필수 → 템플릿 삭제. " +
      "  type=history → 히스토리 전체 삭제. slug=YYYY-MM 형식 지정 시 해당 월만 삭제.",
    args: {
      action: tool.schema.enum(["list", "delete"]),
      type: tool.schema
        .enum(["context", "external", "template", "history"])
        .optional()
        .describe("delete 시 필수"),
      slug: tool.schema.string().optional().describe("external·template 삭제 시 슬러그, history 삭제 시 YYYY-MM"),
    },
    async execute({ action, type, slug }): Promise<string> {
      if (action === "list") return handleList(projectDir)
      if (action === "delete") return handleDelete(projectDir, type, slug)
      return "오류: 알 수 없는 action"
    },
  })
}
