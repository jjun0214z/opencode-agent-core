export function buildCompactionContext(sessionID: string, sessionSkill: Map<string, string>): string {
  const lines: string[] = ["## agent-core: 압축 전 컨텍스트 보존"]

  const skill = sessionSkill.get(sessionID)
  if (skill) {
    const preview = skill.length > 1500 ? skill.slice(0, 1500) + "\n\n[truncated]" : skill
    lines.push("\n### 활성 스킬", preview)
  } else {
    lines.push("\n### 활성 스킬", "없음 (스킬 라우팅 게이트 유지)")
  }

  lines.push(
    "\n### 압축 후 지시",
    "- 위 스킬이 있으면 해당 절차를 그대로 이어서 따른다",
    "- 스킬 게이트 규칙은 압축 후에도 동일하게 적용된다",
    "- 새 메시지가 오면 다시 스킬 라우팅부터 시작한다"
  )

  return lines.join("\n")
}
