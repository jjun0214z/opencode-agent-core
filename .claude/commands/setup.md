# /setup

PR Review Agent 사용 전 MCP 연동 상태를 점검하고 미연동 항목의 설정 가이드를 제공합니다.

## 실행 순서

### 1. 전역 설정 파일 읽기
`~/.claude/settings.json` 을 읽어 `mcpServers` 항목을 확인합니다.

### 2. 필수 MCP 점검

아래 항목을 순서대로 체크합니다.

#### GitHub MCP (필수)
- `mcpServers.github` 존재 여부 확인
- `GITHUB_PERSONAL_ACCESS_TOKEN` 값 존재 여부 확인
- ❌ 없으면 아래 가이드 출력:

```
[GitHub MCP 연동 가이드]

1. GitHub Personal Access Token 발급
   → https://github.com/settings/personal-access-tokens
   → Fine-grained token 생성
   → Repository access: All repositories
   → Permissions:
       - Contents: Read and write
       - Pull requests: Read and write
       - Metadata: Read-only

2. ~/.claude/settings.json 에 추가:
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "발급받은_토큰"
      }
    }
  }
}

3. 터미널에서 확인:
   claude mcp list
```

#### GitLab MCP (선택)
- `mcpServers.gitlab` 존재 여부 확인
- ❌ 없으면 아래 가이드 출력:

```
[GitLab MCP 연동 가이드] (GitLab PR 리뷰 시 필요)

1. GitLab Personal Access Token 발급
   → https://gitlab.com/-/user_settings/personal_access_tokens
   → Scopes: api, read_repository

2. ~/.claude/settings.json 에 추가:
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gitlab"],
      "env": {
        "GITLAB_PERSONAL_ACCESS_TOKEN": "발급받은_토큰",
        "GITLAB_API_URL": "https://gitlab.com/api/v4"
      }
    }
  }
}
```

### 3. 점검 결과 출력

모든 항목 점검 후 아래 포맷으로 결과를 출력합니다:

```
=== PR Review Agent Setup ===

✅ GitHub MCP    연결됨
⚠️  GitLab MCP   미연결 (GitLab PR 리뷰 불가)

지원 플랫폼: GitHub ✅ / GitLab ❌

준비 완료! 사용법:
  /review-pr <PR_URL>
  /review-pr <PR_URL> 백엔드 프론트 QA
```
