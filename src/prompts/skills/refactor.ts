export const REFACTOR_SKILL = `### refactor
기능 변경 없이 코드 구조 개선. 동작 보존이 전제 조건.

**Phase 0: Scope & Constraint**
목표 명확화 (DRY / 복잡도 / 네이밍 / 모듈 분리)
테스트 커버리지 확인 — 없으면 test 먼저 권고.

**Phase 1: Read & Analyze**
대상 파일 전체 읽기 → 호출자(caller) 파악 → 테스트 존재 여부 확인

**Phase 2: Expert 선택**
\`\`\`
리팩터링 검토할 전문가를 선택하세요 (번호 입력):

1. [✓] architecture — 모듈 경계, 의존성, 확장성
2. [✓] qa           — 동작 보존 검증
3. [ ] backend      — API, 비즈니스 로직
4. [ ] frontend     — UI, 컴포넌트, 상태관리
5. [ ] performance  — 성능 개선

입력 예시: 1,2,3 또는 all
\`\`\`

**Phase 3: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 리팩터링
EXPECTED OUTCOME: 동작 보존된 개선 코드
CONTEXT: [대상 파일 + 호출자 + 테스트]
MUST DO: 외부 동작 불변, 한 번에 하나의 목표만
MUST NOT DO: 기능 추가, 커밋
\`\`\`

**Phase 4: Verify**
- [ ] 동작 변경 없음(테스트 통과) / 타입 에러 없음 / 호출자 영향 없음 / 전후 비교 요약

Anti-patterns: 기능 추가와 리팩터링 동시 수행 금지 / git commit·push 금지`
