# Skill: review

## Trigger
`/review [path] [expert1 expert2 ...]`

## What This Is
PR 없이 파일/디렉토리 단위 코드 검토. 전문가 서브에이전트를 병렬 스폰해 소견을 종합한다.

---

## Phase 0: Parse

1. 대상 경로 확인 (없으면 현재 변경 파일)
2. 검토할 expert 파싱 (없으면 기본값: `backend`, `qa`)

---

## Phase 1: Collect Code

대상 파일 목록 수집 → 내용 읽기

---

## Phase 2: Spawn Expert Sub-agents (parallel)

```
TASK:            [expert 도메인] 관점에서 코드 검토
EXPECTED OUTCOME: Critical / Warning / Info 분류 소견
REQUIRED TOOLS:  read only
MUST DO:         파일:라인 근거 명시, 모든 소견에 심각도 표시
MUST NOT DO:     파일 수정, 추측성 소견
CONTEXT:
  대상 파일: [목록]
  코드:
  [파일 내용]
  Expert 프롬프트: [해당 .md 내용]
```

---

## Phase 3: Report

```markdown
# Code Review

- 대상: {path}
- 날짜: {YYYY-MM-DD}
- 검토 에이전트: {목록}

## 종합 의견
{1단락}

## Critical
- [파일:라인] 내용

## Warning
- ...

## Info
- ...
```

---

## Anti-patterns
- 서브에이전트 없이 직접 소견 작성 금지
- 코드 읽지 않고 추측 금지
- 서브에이전트 순차 실행 금지
