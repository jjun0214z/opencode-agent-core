import type { ModelFamily } from "../types"

export function outputFormat(family: ModelFamily): string {
  if (family === "claude") return `
## Output Format
<findings>
  <critical>[파일:라인] 내용</critical>
  <warning>...</warning>
  <info>...</info>
</findings>`
  return `
## Output Format
\`\`\`
### Critical
- [파일:라인] 내용

### Warning
- ...

### Info
- ...
\`\`\``
}
