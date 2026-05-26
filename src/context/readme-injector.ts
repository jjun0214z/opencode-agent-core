import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { access, readFile } from "node:fs/promises"
import { dirname, isAbsolute, join, resolve } from "node:path"
import { STORAGE_DIR } from "./storage"

const README_STORAGE = join(STORAGE_DIR, "readme")
const MAX_README_SIZE = 4000

async function findReadmeMdUp(startDir: string, rootDir: string): Promise<string[]> {
  const found: string[] = []
  let current = startDir

  while (true) {
    const readmePath = join(current, "README.md")
    try {
      await access(readmePath)
      found.push(readmePath)
    } catch {}

    if (current === rootDir) break
    const parent = dirname(current)
    if (parent === current || (!parent.startsWith(rootDir + "/") && parent !== rootDir)) break
    current = parent
  }

  return found.reverse()
}

function loadInjectedPaths(sessionID: string): Set<string> {
  const filePath = join(README_STORAGE, `${sessionID}.json`)
  if (!existsSync(filePath)) return new Set()
  try {
    const data = JSON.parse(readFileSync(filePath, "utf-8")) as { paths?: string[] }
    return new Set(data.paths ?? [])
  } catch {
    return new Set()
  }
}

function saveInjectedPaths(sessionID: string, paths: Set<string>): void {
  mkdirSync(README_STORAGE, { recursive: true })
  writeFileSync(
    join(README_STORAGE, `${sessionID}.json`),
    JSON.stringify({ sessionID, paths: [...paths], updatedAt: Date.now() }, null, 2)
  )
}

export function createReadmeInjector(rootDir: string) {
  const sessionCaches = new Map<string, Set<string>>()

  function getCache(sessionID: string): Set<string> {
    if (!sessionCaches.has(sessionID)) {
      sessionCaches.set(sessionID, loadInjectedPaths(sessionID))
    }
    return sessionCaches.get(sessionID)!
  }

  async function processFileRead(params: {
    filePath: string
    sessionID: string
    output: { output: string }
  }): Promise<void> {
    const { filePath, sessionID, output } = params
    const resolved = isAbsolute(filePath) ? filePath : resolve(rootDir, filePath)
    const dir = dirname(resolved)
    const cache = getCache(sessionID)
    const readmePaths = await findReadmeMdUp(dir, rootDir)

    let dirty = false
    for (const readmePath of readmePaths) {
      const readmeDir = dirname(readmePath)
      if (cache.has(readmeDir)) continue

      try {
        let content = await readFile(readmePath, "utf-8")
        if (content.length > MAX_README_SIZE) {
          content = content.slice(0, MAX_README_SIZE) + "\n\n[truncated — read full file if needed]"
        }
        output.output += `\n\n---\n[README: ${readmePath}]\n${content}`
        cache.add(readmeDir)
        dirty = true
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
          console.warn(`[agent-core] README 읽기 실패: ${readmePath}`, err)
        }
      }
    }

    if (dirty) saveInjectedPaths(sessionID, cache)
  }

  function clearSession(sessionID: string): void {
    sessionCaches.delete(sessionID)
  }

  return { processFileRead, clearSession }
}
