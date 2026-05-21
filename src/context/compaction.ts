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
