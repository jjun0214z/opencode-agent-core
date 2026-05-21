export function buildCompactionPrompt(directory: string): string {
  const historyPath = `${directory}/.agent-core/history.md`
  return `대화를 압축하기 전에 먼저 이번 세션 히스토리를 기록하세요.

## 1단계: 히스토리 기록

Write 도구로 \`${historyPath}\` 파일에 아래 형식을 **append** 하세요.
파일이 이미 있으면 기존 내용 뒤에 추가하고, 없으면 새로 만드세요.

\`\`\`markdown
---
## [오늘 날짜 YYYY-MM-DD] 세션

### 실행 스킬
[이번 세션에서 실행된 스킬 목록]

### 작업 내용
[주요 변경·결정 사항 3-5줄]

### 미완료 항목
[다음 세션에서 이어가야 할 작업 — 없으면 이 섹션 생략]
\`\`\`

## 2단계: 대화 압축

전체 대화를 읽고 다음 세션이 컨텍스트를 이어받을 수 있도록 핵심만 압축하세요.
- 현재 작업 상태
- 내린 결정 사항
- 미해결 이슈
- 활성 스킬 절차 (진행 중이던 것이 있으면)
`
}

export function buildCompactionContext(): string {
  return [
    "## agent-core: 압축 전 컨텍스트 보존",
    "",
    "### 압축 후 지시",
    "- 오케스트레이터 스킬 라우팅 규칙은 압축 후에도 동일하게 적용된다",
    "- 새 메시지가 오면 의도 분류부터 시작한다",
    "- 진행 중이던 스킬 절차가 있으면 이어서 따른다",
  ].join("\n")
}
