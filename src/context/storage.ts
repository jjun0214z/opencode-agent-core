import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

function getStorageDir(): string {
  const dataHome = process.env.XDG_DATA_HOME ?? join(homedir(), ".local", "share")
  return join(dataHome, "opencode", "storage", "agent-core")
}

export const STORAGE_DIR = getStorageDir()

export function readJSON<T>(filePath: string, fallback: T): T {
  if (!existsSync(filePath)) return fallback
  try {
    return JSON.parse(readFileSync(filePath, "utf-8")) as T
  } catch {
    return fallback
  }
}

export function writeJSON(filePath: string, data: unknown): void {
  mkdirSync(join(filePath, ".."), { recursive: true })
  writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export function deleteFile(filePath: string): void {
  if (existsSync(filePath)) {
    try { unlinkSync(filePath) } catch {}
  }
}
