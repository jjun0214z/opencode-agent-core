export const DEBUG_SKILL = `### debug
버그를 진단하고 최소 범위로 수정한다.

🚫 **Hard Blocks (진입 전 확인)**
- 원인 특정 전 수정 금지
- 코드 읽지 않고 가정으로 수정 금지
- try-catch로 에러 삼키기 금지
- git commit·push 금지

---

**Phase 0: Reproduce**
⛔ 재현 불가 상태에서 Phase 1 진입 금지.

1. 증상·에러 메시지 정확히 파악
2. 재현 조건 확인 (입력값, 환경, 순서)
3. 스택트레이스 수집

재현 불가 시 유저에게 묻는다: "어떤 조건에서 발생하나요?"
출력: \`✅ Phase 0 완료 — 재현 조건: [요약]\` 후 Phase 1 진입.

---

**Phase 1: Locate**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

1. 스택트레이스 기반 파일:라인 특정
2. 호출 스택 역추적 — 관련 파일 전체 읽기 (가정 금지)
3. 원인 가설 수립 → 코드로 검증
4. ⛔ 원인 특정 전 Phase 2 진입 금지

출력: \`✅ Phase 1 완료 — 원인: [파일:라인] [요약]\` 후 Phase 2 진입.

---

**Phase 2: Expert 선택** _(유저 입력 게이트 — 응답 전 Phase 3 진입 금지)_
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

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

출력: \`✅ Phase 2 완료 — Expert: [선택 목록]\` 후 Phase 3 진입.

---

**Phase 3: Spawn Experts (parallel)**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.
⛔ 반드시 agent 툴로 병렬 spawn. 오케스트레이터 직접 수정 금지. 순차 실행 금지.

각 선택된 expert마다 병렬 호출:
\`\`\`
agent(
  name: "{expert}",
  prompt: """
  TASK: {expert} 관점 버그 진단 및 최소 수정
  EXPECTED OUTCOME: 원인 특정 + 최소 수정 코드 (재현 안 됨 확인)
  CONTEXT: [증상] + [스택트레이스] + [원인 파일:라인] + [관련 코드]
  MUST DO: 원인을 코드로 검증 후 수정 / 최소 범위만 수정 / 수정 후 재현 확인
  MUST NOT DO: try-catch 삼키기 / 증상 억제 / 범위 밖 수정 / git commit·push
  REQUIRED TOOLS: Read, Edit, Bash
  """
)
\`\`\`

출력: \`✅ Phase 3 완료 — Expert 결과 수신\` 후 Phase 4 진입.

---

**Phase 4: Verify**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

- [ ] 에러 재현 안 됨 (재현 조건으로 재테스트)
- [ ] 기존 동작에 부작용 없음
- [ ] 타입 에러 없음
- [ ] 원인→수정 한 줄 요약 가능

출력: \`✅ Phase 4 완료\` → 완료 리포트 → agent_context_write(type="history") 호출.`
