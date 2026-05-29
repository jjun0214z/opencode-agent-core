export const AUDIT_SKILL = `### audit
전체 코드베이스 또는 지정 경로 보안/성능 감사.

🚫 **Hard Blocks (진입 전 확인)**
- 코드 읽지 않고 소견 금지
- 추측성 소견 금지 (파일:라인 근거 필수)
- 파일 수정 금지
- git commit·push 금지

---

**Phase 0: Scope 확인**
⛔ 대상 미확정 상태에서 Phase 1 진입 금지.

경로 미입력 시 유저에게 묻는다:
\`\`\`
감사할 경로를 입력하세요.
(없으면 전체 코드베이스 대상)
\`\`\`

대상 확정 후:
- 엔트리포인트 / 외부 입력 처리 지점 수집
- DB 접근 지점 / 인증·인가 로직 수집

출력: \`✅ Phase 0 완료 — 대상: [경로 또는 전체]\` 후 Phase 1 진입.

---

**Phase 1: Expert 선택** _(유저 입력 게이트 — 응답 전 Phase 2 진입 금지)_
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

\`\`\`
감사할 전문가를 선택하세요 (번호 입력, 기본값: 1,2):

1. [✓] security     — OWASP Top 10, 인증, 취약점
2. [✓] performance  — N+1, 쿼리, 번들, 병목
3. [ ] mobile       — 모바일 보안, 권한, 오프라인 처리
4. [ ] dba          — 스키마, 인덱스, 쿼리 튜닝
5. [ ] devops       — CI/CD, 컨테이너, 시크릿 노출
6. [ ] architecture — 모듈 경계, 의존성

입력 예시: 1,2,3 또는 all
\`\`\`
빈 응답 시 기본값 1,2(security + performance) 적용.

출력: \`✅ Phase 1 완료 — Expert: [선택 목록]\` 후 Phase 2 진입.

---

**Phase 2: Spawn Experts (parallel)**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.
⛔ 반드시 agent 툴로 병렬 spawn. 오케스트레이터 직접 감사 금지. 순차 실행 금지.

각 선택된 expert마다 병렬 호출:
\`\`\`
agent(
  name: "{expert}",
  prompt: """
  TASK: {expert} 관점 코드 감사
  EXPECTED OUTCOME: HIGH/MEDIUM/LOW 분류 소견 (파일:라인 근거 포함)
  CONTEXT: [대상 코드 전체 내용]
  MUST DO: OWASP Top 10 / 성능 안티패턴 기준 / 파일:라인 근거 명시 / {expert} 관점에만 집중
  MUST NOT DO: 파일 수정 / 추측성 소견 / 타 도메인 소견 / git commit·push
  REQUIRED TOOLS: Read, Bash
  """
)
\`\`\`

출력: \`✅ Phase 2 완료 — Expert 소견 수신\` 후 Phase 3 진입.

---

**Phase 3: Report**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

종합 위험도 1단락 + 심각도별 병합:
- 🔴 HIGH — 즉시 조치 필요
- 🟡 MEDIUM — 개선 권고
- 🔵 LOW — 참고

출력: \`✅ Phase 3 완료\` → agent_context_write(type="history") 호출.`
