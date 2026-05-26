import { Database } from "bun:sqlite"
import { mkdirSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

function getDbPath(): string {
  const base =
    process.platform === "win32"
      ? join(process.env.APPDATA ?? homedir(), "agent-core")
      : join(homedir(), ".local", "share", "agent-core")
  mkdirSync(base, { recursive: true })
  return join(base, "agent-core.db")
}

let _db: Database | null = null

export function getDb(): Database {
  if (_db) return _db
  _db = new Database(getDbPath())
  _db.exec(`
    CREATE TABLE IF NOT EXISTS context (
      project_dir TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS external_files (
      project_dir TEXT NOT NULL,
      slug TEXT NOT NULL,
      source_path TEXT,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (project_dir, slug)
    );
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_dir TEXT NOT NULL,
      skill TEXT NOT NULL,
      content TEXT NOT NULL,
      year_month TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_history_project_month
      ON history(project_dir, year_month);
    CREATE INDEX IF NOT EXISTS idx_external_project
      ON external_files(project_dir);
  `)
  return _db
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
