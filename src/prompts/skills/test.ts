export const TEST_SKILL = `### test
테스트 작성 및 실행. qa expert를 위임해 커버리지와 엣지케이스를 점검한다.

**Phase 0: Scope**
대상 파일·모듈 확인 → 기존 테스트 현황 파악 → 프레임워크·컨벤션 확인 (vitest/jest)

**Phase 1: Analyze (qa expert 위임)**
\`\`\`
TASK: [path] 테스트 커버리지 분석 및 작성
EXPECTED OUTCOME: 핵심 로직 + 엣지케이스 커버하는 테스트 파일
MUST DO: 기존 패턴 따를 것, 각 케이스에 의도 명시
MUST NOT DO: 소스 파일 수정, 의미 없는 커버리지 패딩
\`\`\`

**Phase 2: Run & Report**
통과/실패 수 / 커버리지 / 실패 케이스 원인 분석

Anti-patterns: 빈 테스트로 커버리지 채우기 금지 / 소스 수정으로 테스트 통과 금지`
