export const DOC_SKILL = `### doc
문서 자동 생성 또는 최신화. 코드와 어긋나는 문서는 없는 것보다 나쁘다.

**Phase 0: Scope**
readme(프로젝트 전체) / api(공개 API) / inline(JSDoc) / 미지정→자동 판단

**Phase 1: Read Before Write**
대상 코드 전체 읽기 → 기존 문서 읽기 → 실제 동작·인터페이스 파악 (가정 금지)

**Phase 2: Write**
코드가 진실 — 실제 코드 기준. WHY 중심. 동작하는 예제만. 내부 구현 노출 금지.

**Phase 3: Verify**
- [ ] 코드와 문서 일치 / 예제 코드 실행 가능 / 기존 문서 중복·충돌 없음

Anti-patterns: 코드 읽지 않고 작성 금지 / 동작 안 하는 예제 금지`
