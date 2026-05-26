export const REVIEW_SKILL = `### review
파일/디렉토리 단위 코드 검토. 전문가 서브에이전트 병렬 스폰.

**Phase 0: Parse**
대상 경로 확인 (없으면 현재 변경 파일) → expert 결정 (기본값: backend, qa)

**Phase 1: Collect Code**
대상 파일 목록 수집 → 내용 읽기

**Phase 2: Spawn Expert Sub-agents (parallel)**
\`\`\`
TASK: [expert 도메인] 관점 코드 검토
EXPECTED OUTCOME: Critical/Warning/Info 분류 소견
MUST DO: 파일:라인 근거 명시
MUST NOT DO: 파일 수정, 추측성 소견
\`\`\`

**Phase 3: Report**
종합 의견 + Critical / Warning / Info 분류 리포트

Anti-patterns: 서브에이전트 없이 직접 소견 금지 / 순차 실행 금지(반드시 병렬)`
