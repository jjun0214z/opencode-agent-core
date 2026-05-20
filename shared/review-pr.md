# PR 리뷰 실행 로직

## 1. 입력 파싱
- PR URL 추출
- 에이전트 목록 추출 (없으면 `config.json`의 `default_agents` 사용)
- 플랫폼 판별: `github.com` → GitHub MCP / `gitlab.com` → GitLab MCP

## 2. PR 정보 수집 (MCP)
- PR diff (변경된 코드)
- 변경 파일 목록
- PR 제목 / 설명
- 커밋 목록

## 3. 에이전트 호출
`agents/` 폴더에서 선택된 에이전트 프롬프트를 읽어 순서대로 검토합니다.

| 키 | 파일 |
|----|------|
| `프론트` | `agents/frontend-expert.md` |
| `백엔드` | `agents/backend-expert.md` |
| `QA` | `agents/qa-expert.md` |
| `보안` | `agents/security-expert.md` |
| `성능` | `agents/performance-expert.md` |

## 4. 결과 저장
`logs/YYYY-MM-DD-{PR번호}.md` 로 저장합니다.
