export const DEV_SKILL = `### dev
신규 기능 개발 및 기존 코드 수정.

🚫 **Hard Blocks (진입 전 확인)**
- 파일 읽지 않고 수정 금지
- 요청 범위 밖 리팩터링 금지
- git commit·push 금지
- Expert 없이 오케스트레이터가 직접 구현 금지 (trivial 제외)

---

**Phase 0: Scope Check**
요청을 분류한다:
- Small (단일 파일, 5줄 이하) → Phase 1 → 오케스트레이터 직접 실행 (Phase 2·3 스킵)
- Medium (2-5파일) → Phase 1 → Phase 2 (Expert 1개)
- Large (설계 포함, 6파일+) → Phase 1 → Phase 2 (Expert 복수 병렬)

분류 불명확 시 유저에게 묻는다: "변경 범위가 어느 정도인가요?"
출력: \`✅ Phase 0 완료 — 규모: [Small·Medium·Large]\` 후 Phase 1 진입.

---

**Phase 1: Read Before Write**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

1. 대상 파일 전체 읽기 (추측·가정 금지)
2. 기존 패턴·네이밍·컨벤션 파악
3. 연관 파일 및 영향 범위 확인

출력: \`✅ Phase 1 완료 — 읽은 파일: [목록]\` 후 Phase 2 진입.

---

**Phase 2: Expert 선택** _(유저 입력 게이트 — 응답 전 Phase 3 진입 금지)_
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

변경 대상 기반 기본값 제안:
\`\`\`
구현할 전문가를 선택하세요 (번호 입력, 기본값: 1):

1. [✓] backend      — API, 비즈니스 로직
2. [ ] frontend     — UI, 컴포넌트, 상태관리
3. [ ] mobile       — iOS, Android, React Native, Flutter
4. [ ] qa           — 테스트, 엣지케이스
5. [ ] security     — 인증, 취약점
6. [ ] performance  — N+1, 쿼리, 번들
7. [ ] dba          — 스키마, 마이그레이션

입력 예시: 1,3 또는 all
\`\`\`
UI 포함 → frontend 기본 추가 / 모바일 포함 → mobile 기본 추가 / DB 포함 → dba 기본 추가.

출력: \`✅ Phase 2 완료 — Expert: [선택 목록]\` 후 Phase 3 진입.

---

**Phase 3: Spawn Experts (parallel)**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.
⛔ 반드시 agent 툴로 병렬 spawn. 오케스트레이터 직접 구현 금지. 순차 실행 금지.

각 선택된 expert마다 병렬 호출:
\`\`\`
agent(
  name: "{expert}",
  prompt: """
  TASK: {expert} 관점 구현
  EXPECTED OUTCOME: 완성된 코드 (타입 에러 없음, 기존 패턴 준수)
  CONTEXT: [요구사항] + [읽은 파일 내용] + [기존 패턴 요약]
  MUST DO: 기존 패턴·네이밍 엄수 / 타입 에러 없음 / 변경 파일만 수정
  MUST NOT DO: 요청 범위 밖 리팩터링 / git commit·push / 소스 삭제
  REQUIRED TOOLS: Read, Edit, Write, Bash
  """
)
\`\`\`

출력: \`✅ Phase 3 완료 — Expert 결과 수신\` 후 Phase 4 진입.

---

**Phase 4: Verify**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

- [ ] 타입 에러 없음 (tsc / 해당 언어 타입 검사 실행)
- [ ] 변경 파일 재검토 — 요청 범위 초과 없음
- [ ] 기존 패턴 위반 없음
- [ ] 연관 파일 부작용 없음

출력: \`✅ Phase 4 완료\` → 완료 리포트 → agent_context_write(type="history") 호출.`
