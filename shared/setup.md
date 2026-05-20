# MCP 연동 점검 가이드

## 점검 항목

### GitHub MCP (필수)
- ❌ 미연결 시:

```
[GitHub MCP 연동 가이드]

1. GitHub Personal Access Token 발급
   → https://github.com/settings/personal-access-tokens
   → Repository access: All repositories
   → Permissions: Contents (R/W), Pull requests (R/W), Metadata (R)

2. MCP 설정 추가:
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "발급받은_토큰"
    }
  }
}
```

### GitLab MCP (선택)
- ❌ 미연결 시:

```
[GitLab MCP 연동 가이드]

1. GitLab Personal Access Token 발급
   → https://gitlab.com/-/user_settings/personal_access_tokens
   → Scopes: api, read_repository

2. MCP 설정 추가:
{
  "gitlab": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-gitlab"],
    "env": {
      "GITLAB_PERSONAL_ACCESS_TOKEN": "발급받은_토큰",
      "GITLAB_API_URL": "https://gitlab.com/api/v4"
    }
  }
}
```

## 결과 출력 포맷
```
=== PR Review Agent Setup ===
✅ GitHub MCP  연결됨
⚠️  GitLab MCP  미연결 (GitLab PR 리뷰 불가)

준비 완료! 사용법:
  PR 리뷰해줘 <PR_URL>
  PR 리뷰해줘 <PR_URL> 백엔드 프론트 QA
```
