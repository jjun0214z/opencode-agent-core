export const DEBUG_SKILL = `### debug
버그를 진단하고 최소 범위로 수정한다. 진단 없이 수정하지 않는다.

**Phase 0: Reproduce**
증상·에러 정확히 파악 → 재현 조건 확인 → 스택트레이스 수집

**Phase 1: Locate**
파일:라인 특정 → 호출 스택 역추적 → 코드 읽기(가정 금지) → 원인 가설 수립 → 코드로 검증
원인 특정 전 수정 금지.

**Phase 2: Expert 선택**
버그 위치 기반 기본값 제안:
\`\`\`
진단할 전문가를 선택하세요 (번호 입력, 기본값: 1):

1. [✓] qa           — 재현·엣지케이스 검증
2. [ ] backend      — API, 비즈니스 로직
3. [ ] frontend     — UI, 컴포넌트, 상태관리
4. [ ] performance  — 성능·메모리 이슈
5. [ ] dba          — 쿼리·트랜잭션 이슈
6. [ ] security     — 인증·권한 이슈

입력 예시: 1,2 또는 all
\`\`\`

**Phase 3: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 버그 진단 및 수정
EXPECTED OUTCOME: 원인 특정 + 최소 수정 코드
CONTEXT: [증상 + 스택트레이스 + 관련 파일]
MUST DO: 원인 코드로 검증, 최소 수정
MUST NOT DO: 증상 억제(try-catch 삼키기), 커밋
\`\`\`

**Phase 4: Verify**
- [ ] 에러 재현 안 됨 / 기존 동작 영향 없음 / 타입 에러 없음 / 원인→수정 한 줄 요약

Anti-patterns: 코드 읽지 않고 수정 금지 / try-catch로 에러 삼키기 금지 / git commit·push 금지`
