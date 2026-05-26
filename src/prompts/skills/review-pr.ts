export const REVIEW_PR_SKILL = `### review-pr
PR/MR diff를 읽고 전문가 서브에이전트 병렬 리뷰. MCP 불필요.

**Phase 0: Diff 수집**
유저에게 묻는다:
\`\`\`
diff를 어떻게 제공하시겠어요?
1 — 파일 경로 (직접 export한 diff 파일)
2 — URL 또는 번호 입력 (자동 추출)
\`\`\`

모드 1: 경로 입력받아 Read로 읽기

모드 2: URL 파싱 → diff 수집
URL 구조 분석:
- 번호 추출: .../merge_requests/123 → 123 / .../pull/123 → 123
- host가 github.com → GitHub
- host가 gitlab.com → GitLab 공개
- host가 그 외 IP/도메인 → 사설 GitLab
- host가 bitbucket.org → Bitbucket

인증은 CLI 로그인 상태를 우선 사용. 각 CLI는 한 번 로그인하면 자격증명을 로컬에 저장함:
- GitHub: \`gh auth login\` → ~/.config/gh/
- GitLab: \`glab auth login\` → ~/.config/glab-cli/
- Bitbucket: \`BITBUCKET_USERNAME\`, \`BITBUCKET_TOKEN\` 환경변수

GitHub:
  \`gh pr diff <번호>\`

GitLab (gitlab.com):
  \`glab mr diff <번호>\`

GitLab (사설 인스턴스):
  \`GITLAB_HOST=<host> glab mr diff <번호>\`
  실패 시 → REST API:
  \`curl -s -H "PRIVATE-TOKEN: $GITLAB_TOKEN" http://<host>/api/v4/projects/<namespace%2Fpath>/merge_requests/<번호>/diffs\`
  (예: ConvergenceGroup/AMS/POM_WEB → ConvergenceGroup%2FAMS%2FPOM_WEB)

Bitbucket:
  \`curl -s -u "$BITBUCKET_USERNAME:$BITBUCKET_TOKEN" https://api.bitbucket.org/2.0/repositories/<workspace>/<repo>/pullrequests/<번호>/diff\`

CLI 미로그인·환경변수 미설정 시에만 유저에게 자격증명 요청.

**Phase 1: Expert 선택**
유저에게 묻는다:
\`\`\`
리뷰할 전문가를 선택하세요 (번호 입력, 기본값: 3):

1. [ ] backend      — API, 비즈니스 로직
2. [ ] frontend     — UI, 컴포넌트, 상태관리
3. [✓] qa           — 테스트, 엣지케이스
4. [ ] security     — 인증, 취약점
5. [ ] performance  — N+1, 쿼리, 번들
6. [ ] dba          — 스키마, 마이그레이션, 쿼리 튜닝
7. [ ] devops       — CI/CD, 컨테이너, 배포
8. [ ] architecture — 모듈 경계, 의존성, 확장성

입력 예시: 1,3,4 또는 all
\`\`\`
입력 없으면 qa(3)만 실행.

**Phase 2: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 PR diff 리뷰
EXPECTED OUTCOME: Critical/Warning/Info 분류 소견
CONTEXT: [diff 전체]
MUST DO: 파일:라인 근거, 심각도 표시
MUST NOT DO: 파일 수정, 커밋, 추측성 소견
\`\`\`

**Phase 3: Report**
종합 의견 1단락 + 심각도별 병합:
- 🔴 Critical — 즉시 수정 필요
- 🟡 Warning — 권고
- 🔵 Info — 참고

Anti-patterns: diff 없이 추측 금지 / 순차 실행 금지(반드시 병렬)`
