export const DEBUG_SKILL = `### debug
버그를 진단하고 최소 범위로 수정한다. 진단 없이 수정하지 않는다.

**Phase 0: Reproduce**
증상·에러 정확히 파악 → 재현 조건 확인 → 스택트레이스 수집

**Phase 1: Locate**
파일:라인 특정 → 호출 스택 역추적 → 코드 읽기(가정 금지) → 원인 가설 수립 → 코드로 검증
원인 특정 전 수정 금지.

**Phase 2: Fix**
최소 수정 — 원인 지점만 고침. 증상 억제(suppress) 금지. 수정 범위 크면 plan 먼저.

**Phase 3: Verify**
- [ ] 에러 재현 안 됨 / 기존 동작 영향 없음 / 타입 에러 없음 / 원인→수정 한 줄 요약

Anti-patterns: 코드 읽지 않고 수정 금지 / try-catch로 에러 삼키기 금지 / git commit·push 금지`
