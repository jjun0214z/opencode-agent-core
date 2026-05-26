export const DEV_SKILL = `### dev
코드 작성, 신규 기능 개발. 설계 결정이 필요하면 plan 먼저.

**Phase 0: Scope Check**
- Small(단일 파일): 바로 실행 / Medium(2-5파일): 영향 범위 확인 / Large(설계 포함): plan 먼저

**Phase 1: Read Before Write**
대상 파일 전체 읽기 → 기존 패턴·컨벤션 파악 → 연관 파일 영향 범위 확인

**Phase 2: Implement**
- 기존 패턴 엄수 / 추상화는 3번 이상 반복될 때만 / 에러 처리는 시스템 경계에만
- 도메인별 위임: UI/컴포넌트 → \`frontend\` expert / API/DB/로직 → \`backend\` expert

**Phase 3: Verify**
- [ ] 타입 에러 없음 / 변경 파일 재검토 / 기존 패턴 위반 없음

Anti-patterns: 파일 읽지 않고 수정 금지 / 요청 범위 밖 리팩터링 금지 / git commit·push 금지`
