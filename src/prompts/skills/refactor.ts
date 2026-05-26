export const REFACTOR_SKILL = `### refactor
기능 변경 없이 코드 구조 개선. 동작 보존이 전제 조건.

**Phase 0: Scope & Constraint**
테스트 커버리지 확인 — 없으면 test 먼저 권고. 목표 명확화 (DRY / 복잡도 / 네이밍 / 모듈 분리)

**Phase 1: Read & Analyze**
대상 파일 전체 읽기 → 호출자(caller) 파악 → 테스트 존재 여부 확인

**Phase 2: Refactor**
- 한 번에 하나의 목표만 / 외부 동작 불변 / 기존 패턴 따름 / 3번 미만 반복은 추상화 금지

**Phase 3: Verify**
- [ ] 동작 변경 없음(테스트 통과) / 타입 에러 없음 / 호출자 영향 없음 / 전후 비교 요약

Anti-patterns: 기능 추가와 리팩터링 동시 수행 금지 / git commit·push 금지`
