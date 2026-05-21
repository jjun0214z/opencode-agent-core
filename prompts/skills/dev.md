# Skill: dev

## Trigger
`/dev <task>`

## What This Is
코드 작성, 리팩터링, 신규 기능 개발 워크플로.
설계 결정이 필요하면 `/plan` 먼저 실행. 명확한 작업이면 바로 실행.

---

## Phase 0: Scope Check

작업 분류:
- **Small** (단일 파일, 명확한 변경): 바로 실행
- **Medium** (2-5파일, 패턴 따라감): 영향 범위 확인 후 실행
- **Large** (설계 결정 포함): `/plan` 먼저 실행 권고

---

## Phase 1: Read Before Write

변경 전 반드시:
1. 대상 파일 전체 읽기
2. 기존 패턴/컨벤션 파악 (네이밍, 에러처리, 타입 방식)
3. 연관 파일 영향 범위 확인

---

## Phase 2: Implement

기존 패턴 엄수:
- 새 패턴 도입 시 반드시 근거 명시
- 추상화는 3번 이상 반복될 때만
- 에러 처리는 시스템 경계(입력, 외부 API)에만

도메인별 위임이 필요한 경우 해당 expert 프롬프트 참조:
- UI/컴포넌트 → `agents/frontend-expert.md`
- API/DB/로직 → `agents/backend-expert.md`

---

## Phase 3: Verify

구현 완료 후:
- [ ] 타입 에러 없음 (`typecheck`)
- [ ] 변경된 파일 전체 재검토
- [ ] 기존 패턴 위반 없음
- [ ] 테스트 영향 범위 확인

---

## Anti-patterns
- 파일 읽지 않고 수정 금지
- 요청 범위 밖 리팩터링 금지
- 미래 요구사항을 위한 추상화 금지
- `git commit` / `git push` 금지
