export const TEST_SKILL = `### test
테스트 작성 및 실행. 프레임워크 확인 → 전략 수립 → Expert 작성.

🚫 **Hard Blocks (진입 전 확인)**
- 프레임워크 확인 전 코드 작성 금지
- 소스 파일 수정으로 테스트 통과 금지
- 빈 테스트로 커버리지 채우기 금지
- git commit·push 금지

---

**Phase 0: 환경 파악**
⛔ 프레임워크 미확인 상태에서 Phase 1 진입 금지.

1. 대상 파일·모듈 확인
2. package.json / pyproject.toml / go.mod / pubspec.yaml 읽어 프레임워크 감지:
   - frontend: vitest / jest / @testing-library / cypress / playwright
   - backend: pytest / junit / go test / rspec
   - mobile: detox / @testing-library/react-native / xctest / espresso / flutter_test
3. 설정 파일 확인: vitest.config.ts / jest.config.ts / playwright.config.ts / detox.config.js

프레임워크 미감지 시 유저에게 설치 제안:
\`\`\`
테스트 프레임워크가 없습니다. 설치할까요? (번호 입력, 기본값: 없음)
1. Vite 계열     → vitest + @testing-library
2. Next.js       → jest + @testing-library
3. E2E           → playwright
4. Python        → pytest
5. React Native  → jest + detox
6. Flutter       → flutter_test
\`\`\`
유저 응답 전 Phase 1 진입 금지.

출력: \`✅ Phase 0 완료 — 프레임워크: [감지 결과]\` 후 Phase 1 진입.

---

**Phase 1: 레이어 선택** _(유저 입력 게이트 — 응답 전 Phase 2 진입 금지)_
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

\`\`\`
어떤 테스트를 작성할까요? (번호 입력, 기본값: 없음)

1. [ ] Unit/Component — 함수·컴포넌트 단위
2. [ ] Integration    — 여러 모듈 연동
3. [ ] E2E            — 전체 유저 플로우

입력 예시: 1 또는 1,3
\`\`\`
⛔ 기본값 없음 — 유저 입력 없이 진행 불가.

출력: \`✅ Phase 1 완료 — 레이어: [선택]\` 후 Phase 2 진입.

---

**Phase 2: Expert 선택** _(유저 입력 게이트 — 응답 전 Phase 3 진입 금지)_
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

\`\`\`
테스트 작성할 전문가를 선택하세요 (번호 입력, 기본값: 1):

1. [✓] qa           — 테스트 전략, 엣지케이스
2. [ ] frontend     — 컴포넌트·E2E 테스트
3. [ ] mobile       — iOS·Android·RN·Flutter 테스트
4. [ ] backend      — API·로직 테스트
5. [ ] dba          — DB·쿼리 테스트

입력 예시: 1,2 또는 all
\`\`\`

출력: \`✅ Phase 2 완료 — Expert: [선택 목록]\` 후 Phase 3 진입.

---

**Phase 3: Spawn Experts (parallel)**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.
⛔ 반드시 agent 툴로 병렬 spawn. 오케스트레이터 직접 작성 금지. 순차 실행 금지.

각 선택된 expert마다 병렬 호출:
\`\`\`
agent(
  name: "{expert}",
  prompt: """
  TASK: {expert} 관점 테스트 작성
  EXPECTED OUTCOME: 실행 가능한 테스트 파일 (실제 통과 확인)
  CONTEXT: [대상 코드] + [프레임워크: {감지 결과}] + [레이어: {선택}] + [기존 패턴]
  MUST DO: 기존 테스트 패턴 엄수 / 각 케이스 의도 명시 / 실제 실행 가능한 코드
  MUST NOT DO: 소스 파일 수정 / 빈 테스트로 커버리지 패딩 / git commit·push
  REQUIRED TOOLS: Read, Write, Bash
  """
)
\`\`\`

출력: \`✅ Phase 3 완료 — Expert 결과 수신\` 후 Phase 4 진입.

---

**Phase 4: Run & Report**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

테스트 실행: \`bash: [프레임워크 실행 커맨드]\`

- [ ] 통과/실패 수 확인
- [ ] 실패 시 원인 분석 → Expert에게 재위임 또는 직접 수정
- [ ] 커버리지 수치 (가능 시)

출력: \`✅ Phase 4 완료\` → 완료 리포트 → agent_context_write(type="history") 호출.`
