# Skill: review-pr

## Trigger
`/review-pr <PR_URL> [expert1 expert2 ...]`

## What This Is
PR diff를 GitHub MCP로 수집하고, 전문가 서브에이전트를 병렬 스폰해 리뷰 리포트를 생성한다.
오케스트레이터는 수집/종합/리포트만 담당한다. 코드 판단은 전문가에게 위임한다.

---

## Phase 0: Parse Input

1. PR URL에서 `owner`, `repo`, `PR번호` 추출
2. 명시된 expert 목록 파싱 (없으면 기본값: `backend`, `qa`)
3. 플랫폼 판별: `github.com` → GitHub MCP

---

## Phase 1: Collect PR Data (GitHub MCP)

병렬로 수집:
- PR 제목, 설명, 상태
- 변경 파일 목록 + diff
- 커밋 목록

---

## Phase 2: Spawn Expert Sub-agents (parallel)

선택된 각 expert에 대해 동시에 task() 스폰.
각 task에 전달할 delegation prompt (6요소 필수):

```
TASK:            [expert 도메인] 관점에서 PR diff 리뷰
EXPECTED OUTCOME: Critical / Warning / Info 분류된 소견 목록
REQUIRED TOOLS:  read (diff만, 파일 직접 수정 금지)
MUST DO:         구체적 파일:라인 근거 명시, 모든 소견에 심각도 표시
MUST NOT DO:     파일 수정, 커밋, 추측성 소견
CONTEXT:
  PR: [URL]
  변경 파일: [목록]
  Diff:
  [diff 전문]
  
  Expert 프롬프트:
  [해당 expert .md 내용]
```

### Expert 매핑
각 expert 프롬프트는 시스템 컨텍스트의 **"Expert Agent Prompts"** 섹션에 자동 주입된다.

| Key | 역할 |
|-----|------|
| `backend` | API, DB, 비즈니스 로직 검토 |
| `frontend` | UI, 컴포넌트, 상태관리 검토 |
| `qa` | 테스트, 엣지케이스, 회귀 위험 검토 |
| `security` | OWASP Top 10 기준 취약점 검토 |
| `performance` | N+1, 쿼리, 번들, 메모리 검토 |

---

## Phase 3: Collect & Synthesize

모든 서브에이전트 완료 후:
1. 결과 수집
2. 심각도별 중복 제거 및 병합: Critical → Warning → Info
3. 전체 종합 의견 1단락 작성

---

## Phase 4: Report

```markdown
# PR Review Report

- PR: {URL}
- 날짜: {YYYY-MM-DD}
- 투입 에이전트: {목록}

## 종합 의견
{1단락}

## Critical
- [파일:라인] 내용 (출처: expert)

## Warning
- ...

## Info
- ...
```

---

## Anti-patterns
- 전문가 결과 없이 종합 의견 작성 금지
- diff 없이 추측성 소견 금지
- 서브에이전트 순차 실행 금지 (반드시 병렬)
