export const REVIEW_SKILL = `### review
파일/디렉토리 코드 검토 또는 PR diff 리뷰. Expert 병렬 리뷰.

🚫 **Hard Blocks (진입 전 확인)**
- 파일/diff 읽지 않고 소견 금지
- 추측성 소견 금지 (파일:라인 근거 필수)
- 파일 수정 금지
- git commit·push 금지

---

**Phase 0: 리뷰 유형 선택** _(유저 입력 게이트 — 응답 전 Phase 1 진입 금지)_
⛔ 유형 미확정 상태에서 Phase 1 진입 금지.

\`\`\`
리뷰 유형을 선택하세요 (번호 입력, 기본값: 1):

1 — 코드 검토  (파일 또는 디렉토리)
2 — PR diff 리뷰
\`\`\`
빈 응답 시 기본값 1(코드 검토) 적용.

출력: \`✅ Phase 0 완료 — 유형: [선택]\` 후 Phase 1 진입.

---

**Phase 1: 대상 확보**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

**[유형 1: 코드 검토]**
경로 미입력 시 유저에게 묻는다:
\`\`\`
검토할 파일 또는 디렉토리 경로를 입력하세요.
(없으면 현재 git 변경 파일 자동 수집)
\`\`\`
대상 파일 목록 수집 → 전체 내용 읽기.

**[유형 2: PR diff 리뷰]**
유저에게 묻는다:
\`\`\`
diff를 어떻게 제공하시겠어요? (번호 입력)

1 — 파일 경로 (직접 export한 diff 파일)
2 — URL 또는 PR 번호 (자동 추출)
\`\`\`

모드 1: 경로 입력받아 Read로 읽기

모드 2: URL/번호로 자동 추출
- github.com → \`gh pr diff <번호>\`
- gitlab.com → \`glab mr diff <번호>\`
- 사설 GitLab → \`GITLAB_HOST=<host> glab mr diff <번호>\` (실패 시 REST API)
- bitbucket.org → \`curl -u "$BITBUCKET_USERNAME:$BITBUCKET_TOKEN" ...\`

CLI 미로그인·환경변수 미설정 시에만 유저에게 자격증명 요청.

출력: \`✅ Phase 1 완료 — 대상: [파일 목록 또는 diff 출처]\` 후 Phase 2 진입.

---

**Phase 2: Expert 선택** _(유저 입력 게이트 — 응답 전 Phase 3 진입 금지)_
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

\`\`\`
리뷰할 전문가를 선택하세요 (번호 입력, 기본값: 3):

1. [ ] backend      — API, 비즈니스 로직
2. [ ] frontend     — UI, 컴포넌트, 상태관리
3. [ ] mobile       — iOS, Android, React Native, Flutter
4. [✓] qa           — 테스트, 엣지케이스
5. [ ] security     — 인증, 취약점
6. [ ] performance  — N+1, 쿼리, 번들
7. [ ] dba          — 스키마, 마이그레이션, 쿼리 튜닝
8. [ ] devops       — CI/CD, 컨테이너, 배포
9. [ ] architecture — 모듈 경계, 의존성, 확장성

입력 예시: 1,3,4 또는 all
\`\`\`
빈 응답 시 기본값 4(qa) 적용.

출력: \`✅ Phase 2 완료 — Expert: [선택 목록]\` 후 Phase 3 진입.

---

**Phase 3: Spawn Experts (parallel)**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.
⛔ 반드시 agent 툴로 병렬 spawn. 오케스트레이터 직접 리뷰 금지. 순차 실행 금지.

각 선택된 expert마다 병렬 호출:
\`\`\`
agent(
  name: "{expert}",
  prompt: """
  TASK: {expert} 관점 코드 검토
  EXPECTED OUTCOME: Critical/Warning/Info 분류 소견 (파일:라인 근거 포함)
  CONTEXT: [대상 파일 전체 내용 또는 diff]
  MUST DO: 파일:라인 근거 명시 / 심각도 표시 (🔴/🟡/🔵) / {expert} 관점에만 집중
  MUST NOT DO: 파일 수정 / 추측성 소견 / 타 도메인 소견 / git commit·push
  REQUIRED TOOLS: Read
  """
)
\`\`\`

출력: \`✅ Phase 3 완료 — Expert 소견 수신\` 후 Phase 4 진입.

---

**Phase 4: Report**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

종합 의견 1단락 + 심각도별 병합:
- 🔴 Critical — 즉시 수정 필요
- 🟡 Warning — 권고
- 🔵 Info — 참고

출력: \`✅ Phase 4 완료\` → agent_context_write(type="history") 호출.`
