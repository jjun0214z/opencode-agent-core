import { tool, type ToolDefinition } from "@opencode-ai/plugin"
import {
  appendHistory,
  clearContext,
  clearHistory,
  deleteExternalFile,
  deleteHistoryById,
  deleteTemplate,
  getOtherProjectDirs,
  listAll,
  upsertContext,
  upsertExternalFile,
  upsertTemplate,
} from "./db"
import type { HistoryRow } from "./db"

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
        upsertTemplate(slug, content)
        return `template/${slug} 저장 완료`
      }
      return `오류: 알 수 없는 type: ${type}`
    },
  })
}

function templateSummary(content: string): string {
  const fmt = /^output_format:\s*(.+)$/m.exec(content)?.[1]?.trim()
  const sec = /^sections:\s*(.+)$/m.exec(content)?.[1]?.trim()
  const parts = [fmt && `형식: ${fmt}`, sec && `섹션: ${sec}`].filter(Boolean)
  return parts.length > 0 ? `  (${parts.join(" / ")})` : ""
}

function renderContext(context: { updatedAt: number } | null): string {
  if (!context) return "- context: 없음"
  const date = new Date(context.updatedAt).toISOString().slice(0, 10)
  return `- context: 있음  (업데이트: ${date})`
}

function renderExternals(externals: Array<{ slug: string; source_path: string }>): string[] {
  if (externals.length === 0) return ["- external: 없음"]
  return [
    `- external (${externals.length}개):`,
    ...externals.map((e) => `  - ${e.slug}  ← ${e.source_path || "경로 없음"}`),
  ]
}

function renderTemplates(templates: Array<{ slug: string; content: string }>): string[] {
  if (templates.length === 0) return ["- template: 없음  (공용)"]
  return [
    `- template (${templates.length}개, 공용):`,
    ...templates.map((t) => `  - ${t.slug}${templateSummary(t.content)}`),
  ]
}

function renderHistoryRows(rows: HistoryRow[]): string[] {
  if (rows.length === 0) return ["- history: 없음"]
  return [
    `- history (${rows.length}건):`,
    ...rows.map((h) => {
      const date = new Date(h.created_at).toISOString().slice(0, 10)
      return `  - [${h.id}] ${h.skill.padEnd(12)}${date}  ${h.preview}`
    }),
  ]
}

function handleList(projectDir: string): string {
  const { dbPath, context, externals, templates, historyRows } = listAll(projectDir)
  const lines: string[] = [
    "## 저장된 항목",
    `📍 DB: ${dbPath}  |  프로젝트: ${projectDir}`,
    "",
    renderContext(context),
    ...renderExternals(externals),
    ...renderTemplates(templates),
    ...renderHistoryRows(historyRows),
  ]

  const others = getOtherProjectDirs(projectDir)
  if (others.length > 0) {
    lines.push(
      "",
      "ℹ️  이 DB에 다른 프로젝트 데이터가 있습니다. 해당 세션 루트에서 /core-setup 실행 시 관리 가능합니다:",
      ...others.map((d) => `   - ${d}`),
    )
  }

  return lines.join("\n")
}

function handleDelete(
  projectDir: string,
  type: "context" | "external" | "template" | "history" | undefined,
  slug: string | undefined,
  id: number | undefined,
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
    deleteTemplate(slug)
    return `template/${slug} 삭제 완료`
  }
  // type === "history"
  if (id !== undefined) {
    deleteHistoryById(projectDir, id)
    return `history row #${id} 삭제 완료`
  }
  clearHistory(projectDir, slug)
  return slug ? `history/${slug} 삭제 완료` : "history 전체 삭제 완료"
}

export function createAgentContextManageTool(projectDir: string): ToolDefinition {
  return tool({
    description:
      "agent-core DB 항목을 조회·삭제한다. " +
      "context·external·history는 현재 프로젝트 범위. template은 전체 공용(삭제 시 모든 프로젝트에 영향). " +
      "action=list: 저장 항목 전체 목록 반환. " +
      "action=delete: 항목 삭제 (type 필수). " +
      "  type=context → 현재 프로젝트 컨텍스트 삭제. " +
      "  type=external, slug 필수 → 현재 프로젝트 외부파일 삭제. " +
      "  type=template, slug 필수 → 공용 템플릿 삭제 (전 프로젝트 영향). " +
      "  type=history, id 지정 → 특정 row 삭제. slug=YYYY-MM 지정 → 해당 월 전체 삭제. 둘 다 생략 → 전체 삭제.",
    args: {
      action: tool.schema.enum(["list", "delete"]),
      type: tool.schema
        .enum(["context", "external", "template", "history"])
        .optional()
        .describe("delete 시 필수"),
      slug: tool.schema
        .string()
        .optional()
        .describe("external·template 삭제 시 슬러그 / history 월 삭제 시 YYYY-MM"),
      id: tool.schema
        .number()
        .optional()
        .describe("history 개별 row 삭제 시 row ID (list에서 확인)"),
    },
    async execute({ action, type, slug, id }): Promise<string> {
      if (action === "list") return handleList(projectDir)
      if (action === "delete") return handleDelete(projectDir, type, slug, id)
      return "오류: 알 수 없는 action"
    },
  })
}
