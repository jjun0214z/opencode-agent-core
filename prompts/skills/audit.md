# Skill: audit

## Trigger
`/audit [--security] [--performance] [path]`

## What This Is
전체 코드베이스 또는 지정 경로에 대한 보안/성능 감사.
security, performance expert를 병렬 스폰해 종합 감사 리포트 생성.

---

## Phase 0: Parse Input

- 대상 경로 파싱 (없으면 전체 프로젝트)
- 감사 범위: `--security`, `--performance`, 둘 다 (기본값: 둘 다)

---

## Phase 1: Collect Scope

대상 파일 목록 수집:
- 엔트리포인트 파악
- 외부 입력 처리 지점 (API, 폼, 파일 업로드 등)
- DB/쿼리 접근 지점
- 인증/인가 로직

---

## Phase 2: Spawn Expert Sub-agents (parallel)

```
TASK:            [security|performance] 관점 전체 감사
EXPECTED OUTCOME: Critical / Warning / Info 분류 소견
REQUIRED TOOLS:  read only
MUST DO:         OWASP Top 10 / 성능 안티패턴 기준, 파일:라인 근거 명시
MUST NOT DO:     파일 수정, 커밋
CONTEXT:
  대상 경로: [path]
  파일 목록: [list]
  Expert 프롬프트: [해당 .md 내용]
```

---

## Phase 3: Synthesize & Report

```markdown
# Audit Report

- 대상: {path}
- 날짜: {YYYY-MM-DD}
- 범위: security / performance / both

## 종합 위험도: HIGH / MEDIUM / LOW

## Security Findings
### Critical
- [파일:라인] 내용

### Warning
- ...

## Performance Findings
### Critical
- ...

### Warning
- ...

## 즉시 조치 필요 항목
1. {항목} — {조치 방법}
```

---

## Anti-patterns
- 서브에이전트 없이 직접 감사 금지
- 코드 읽지 않고 추측 금지
- 수정 제안 없이 소견만 나열 금지
