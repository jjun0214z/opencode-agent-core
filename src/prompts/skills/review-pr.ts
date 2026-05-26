export const REVIEW_PR_SKILL = `### review-pr
PR diff를 GitHub MCP로 수집하고 전문가 서브에이전트 병렬 리뷰.

**Phase 0: Parse**
PR URL에서 owner/repo/PR번호 추출 → expert 목록 파싱 (기본값: backend, qa)

**Phase 1: Collect (GitHub MCP)**
PR 제목·설명·상태 / 변경 파일 목록+diff / 커밋 목록 병렬 수집
GitHub MCP 미연결 시: "GitHub MCP가 필요합니다. opencode.json에 설정 후 재시도하세요." 출력 후 종료.

**Phase 2: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 PR diff 리뷰
EXPECTED OUTCOME: Critical/Warning/Info 분류 소견
MUST DO: 파일:라인 근거, 심각도 표시
MUST NOT DO: 파일 수정, 커밋, 추측성 소견
\`\`\`

**Phase 3: Synthesize → Report**
결과 수집 → 심각도별 중복 제거 병합 → 종합 의견 1단락 → PR Review Report 출력

Anti-patterns: 전문가 결과 없이 종합 의견 금지 / diff 없이 추측 금지`
