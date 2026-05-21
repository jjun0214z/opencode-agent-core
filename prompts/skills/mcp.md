# Skill: mcp

## Trigger
`/mcp`

## What This Is
MCP 서버 연동 상태를 점검하고 미연결 항목의 설정 가이드를 제공한다.

---

## Phase 0: MCP 상태 점검

각 MCP 도구의 존재 여부로 연결 상태를 확인한다. 실제 호출 없이 도구 목록만 확인한다.

| MCP | 확인 도구 | 용도 |
|-----|----------|------|
| GitHub MCP | `list_pull_requests` | `/review-pr`, `/release` |
| GitLab MCP | `list_merge_requests` | GitLab PR 리뷰 |
| Notion MCP | `notion-search` | 문서/백로그 연동 |
| Linear MCP | `list_issues` | 태스크 관리 |

---

## Phase 1: 리포트

```
=== MCP 연동 상태 ===

✅ / ❌  GitHub MCP
✅ / ❌  GitLab MCP
✅ / ❌  Notion MCP
✅ / ❌  Linear MCP
```

---

## Phase 2: 미연결 항목 가이드

**GitHub MCP:**
```json
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

**Notion MCP:**
```json
{
  "mcp": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": { "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer YOUR_TOKEN\"}" }
    }
  }
}
```

## Anti-patterns
- 연결 안 된 MCP를 연결됐다고 가정 금지
- 토큰/시크릿 실제 값 출력 금지
