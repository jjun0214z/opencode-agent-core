import { Database } from "bun:sqlite"
import { mkdirSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

export function getDbPath(): string {
  const base =
    process.platform === "win32"
      ? join(process.env.APPDATA ?? homedir(), "agent-core")
      : join(homedir(), ".local", "share", "agent-core")
  mkdirSync(base, { recursive: true })
  return join(base, "agent-core.db")
}

let _db: Database | undefined

function getDb(): Database {
  if (_db) return _db
  const db = new Database(getDbPath())
  for (const sql of [
    `CREATE TABLE IF NOT EXISTS context (
      project_dir TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS external_files (
      project_dir TEXT NOT NULL,
      slug TEXT NOT NULL,
      source_path TEXT,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (project_dir, slug)
    )`,
    `CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_dir TEXT NOT NULL,
      skill TEXT NOT NULL,
      content TEXT NOT NULL,
      year_month TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS templates (
      slug TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_history_project_month ON history(project_dir, year_month)`,
    `CREATE INDEX IF NOT EXISTS idx_external_project ON external_files(project_dir)`,
  ]) {
    db.prepare(sql).run()
  }
  _db = db
  return db
}

function currentYearMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export function upsertContext(projectDir: string, content: string): void {
  getDb()
    .prepare("INSERT OR REPLACE INTO context (project_dir, content, updated_at) VALUES (?, ?, ?)")
    .run(projectDir, content, Date.now())
}

export function upsertExternalFile(
  projectDir: string,
  slug: string,
  sourcePath: string,
  content: string,
): void {
  getDb()
    .prepare(
      "INSERT OR REPLACE INTO external_files (project_dir, slug, source_path, content, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .run(projectDir, slug, sourcePath, content, Date.now())
}

export function appendHistory(projectDir: string, skill: string, content: string): void {
  getDb()
    .prepare(
      "INSERT INTO history (project_dir, skill, content, year_month, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .run(projectDir, skill, content, currentYearMonth(), Date.now())
}

export function getContext(projectDir: string): string | null {
  const row = getDb()
    .prepare("SELECT content FROM context WHERE project_dir = ?")
    .get(projectDir) as { content: string } | null
  return row?.content ?? null
}

export function getExternalFiles(
  projectDir: string,
): Array<{ slug: string; source_path: string; content: string }> {
  return getDb()
    .prepare(
      "SELECT slug, source_path, content FROM external_files WHERE project_dir = ? ORDER BY created_at",
    )
    .all(projectDir) as Array<{ slug: string; source_path: string; content: string }>
}

export function upsertTemplate(slug: string, content: string): void {
  getDb()
    .prepare("INSERT OR REPLACE INTO templates (slug, content, updated_at) VALUES (?, ?, ?)")
    .run(slug, content, Date.now())
}

export function getTemplates(): Array<{ slug: string; content: string }> {
  return getDb()
    .prepare("SELECT slug, content FROM templates ORDER BY updated_at")
    .all() as Array<{ slug: string; content: string }>
}

export function deleteExternalFile(projectDir: string, slug: string): void {
  getDb()
    .prepare("DELETE FROM external_files WHERE project_dir = ? AND slug = ?")
    .run(projectDir, slug)
}

export function deleteTemplate(slug: string): void {
  getDb()
    .prepare("DELETE FROM templates WHERE slug = ?")
    .run(slug)
}

export function clearContext(projectDir: string): void {
  getDb()
    .prepare("DELETE FROM context WHERE project_dir = ?")
    .run(projectDir)
}

export function clearHistory(projectDir: string, yearMonth?: string): void {
  if (yearMonth) {
    getDb()
      .prepare("DELETE FROM history WHERE project_dir = ? AND year_month = ?")
      .run(projectDir, yearMonth)
  } else {
    getDb()
      .prepare("DELETE FROM history WHERE project_dir = ?")
      .run(projectDir)
  }
}

export function deleteHistoryById(projectDir: string, id: number): void {
  getDb()
    .prepare("DELETE FROM history WHERE project_dir = ? AND id = ?")
    .run(projectDir, id)
}

export type HistoryRow = {
  id: number
  skill: string
  created_at: number
  preview: string
}

export function listAll(projectDir: string): {
  dbPath: string
  context: { updatedAt: number } | null
  externals: Array<{ slug: string; source_path: string }>
  templates: Array<{ slug: string; content: string }>
  historyRows: HistoryRow[]
} {
  const db = getDb()

  const context = db
    .prepare("SELECT updated_at FROM context WHERE project_dir = ?")
    .get(projectDir) as { updated_at: number } | null

  const externals = db
    .prepare("SELECT slug, source_path FROM external_files WHERE project_dir = ? ORDER BY created_at")
    .all(projectDir) as Array<{ slug: string; source_path: string }>

  const templates = db
    .prepare("SELECT slug, content FROM templates ORDER BY updated_at")
    .all() as Array<{ slug: string; content: string }>

  const rawHistory = db
    .prepare(
      "SELECT id, skill, content, created_at FROM history WHERE project_dir = ? ORDER BY created_at DESC",
    )
    .all(projectDir) as Array<{ id: number; skill: string; content: string; created_at: number }>

  const historyRows: HistoryRow[] = rawHistory.map((r) => ({
    id: r.id,
    skill: r.skill,
    created_at: r.created_at,
    preview: r.content.slice(0, 80).replaceAll("\n", " "),
  }))

  return {
    dbPath: getDbPath(),
    context: context ? { updatedAt: context.updated_at } : null,
    externals,
    templates,
    historyRows,
  }
}

export function getOtherProjectDirs(projectDir: string): string[] {
  const rows = getDb()
    .prepare(
      `SELECT project_dir FROM context WHERE project_dir != ?
       UNION SELECT project_dir FROM external_files WHERE project_dir != ?
       UNION SELECT project_dir FROM history WHERE project_dir != ?`,
    )
    .all(projectDir, projectDir, projectDir) as Array<{ project_dir: string }>
  return rows.map((r) => r.project_dir).sort((a, b) => a.localeCompare(b))
}

export function getCurrentMonthHistory(
  projectDir: string,
): Array<{ skill: string; content: string; created_at: number }> {
  return getDb()
    .prepare(
      "SELECT skill, content, created_at FROM history WHERE project_dir = ? AND year_month = ? ORDER BY created_at",
    )
    .all(projectDir, currentYearMonth()) as Array<{
    skill: string
    content: string
    created_at: number
  }>
}
