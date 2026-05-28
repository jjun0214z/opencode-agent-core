export const DEV_SKILL = `### dev
신규 기능 개발 및 기존 코드 수정. 설계 결정이 필요하면 plan 먼저.

**Phase 0: Scope Check**
Small(단일 파일) → 바로 실행
Medium(2-5파일) → 영향 범위 확인 후 실행
Large(설계 포함) → plan 먼저

**Phase 1: Read Before Write**
대상 파일 전체 읽기 → 기존 패턴·컨벤션 파악 → 연관 파일 영향 범위 확인

**Phase 2: Expert 선택**
변경 대상 기반 기본값 제안 후 유저 확인:
\`\`\`
구현할 전문가를 선택하세요 (번호 입력, 기본값: 3):

1. [ ] backend      — API, 비즈니스 로직
2. [ ] frontend     — UI, 컴포넌트, 상태관리
3. [✓] qa           — 테스트, 엣지케이스
4. [ ] security     — 인증, 취약점
5. [ ] performance  — N+1, 쿼리, 번들
6. [ ] dba          — 스키마, 마이그레이션

입력 예시: 1,3 또는 all
\`\`\`
UI 포함 시 frontend 기본 추가 / DB 포함 시 dba 기본 추가.

**Phase 3: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 구현
EXPECTED OUTCOME: 완성된 코드
CONTEXT: [요구사항 + 기존 패턴 + 연관 파일]
MUST DO: 기존 패턴 엄수, 타입 에러 없음
MUST NOT DO: 요청 범위 밖 리팩터링, 커밋
\`\`\`

**Phase 4: Verify**
- [ ] 타입 에러 없음 / 변경 파일 재검토 / 기존 패턴 위반 없음 / 요청 범위 초과 없음

Anti-patterns: 파일 읽지 않고 수정 금지 / 요청 범위 밖 리팩터링 금지 / git commit·push 금지`
