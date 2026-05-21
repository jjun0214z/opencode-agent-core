# Skill: setup

## Trigger
`/setup`

## What This Is
agent-core 연동 환경을 점검하고 설정 가이드를 제공한다.
처음 사용하거나 MCP/플러그인이 동작하지 않을 때 실행한다.

---

## Phase 0: Check Runtime

현재 런타임 환경 확인:
- OpenCode 버전
- agent-core 플러그인 로드 여부
- 활성화된 에이전트 목록

---

## Phase 1: Check MCP Servers

| MCP | 용도 | 상태 확인 방법 |
|-----|------|---------------|
| GitHub MCP | `/review-pr`, `/release` | `list_pull_requests` 도구 존재 여부 |
| GitLab MCP | GitLab PR 리뷰 | `list_merge_requests` 도구 존재 여부 |

---

## Phase 2: Report & Guide

```
=== agent-core Setup ===

[Runtime]
✅ / ❌  OpenCode
✅ / ❌  agent-core 플러그인

[MCP Servers]
✅ / ❌  GitHub MCP
✅ / ❌  GitLab MCP (선택)

[Available Skills]
/plan /dev /refactor /debug /test
/review /review-pr /audit /doc /release /setup
```

미연결 항목에 대해 설정 가이드 출력:

**GitHub MCP 미연결 시:**
```
1. GitHub Personal Access Token 발급
   → https://github.com/settings/personal-access-tokens
   → Permissions: Contents (R), Pull requests (R), Metadata (R)

2. opencode.json 에 추가:
{
  "mcp": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN" }
    }
  }
}
```

---

## Anti-patterns
- 실제 확인 없이 연결됐다고 가정 금지
- 토큰/시크릿 값 출력 금지
