# Skill: test

## Trigger
`/test [path]`

## What This Is
테스트 작성 및 실행. qa expert를 위임해 커버리지와 엣지케이스를 점검한다.

---

## Phase 0: Scope

1. 대상 파일/모듈 확인
2. 기존 테스트 현황 파악
3. 테스트 프레임워크/컨벤션 확인 (vitest, jest 등)

---

## Phase 1: Analyze (qa expert 위임)

```
TASK:            [path] 테스트 커버리지 분석 및 테스트 작성
EXPECTED OUTCOME: 핵심 로직 + 엣지케이스 커버하는 테스트 파일
REQUIRED TOOLS:  read, write (테스트 파일만)
MUST DO:         기존 패턴 따를 것, 각 케이스에 의도 명시
MUST NOT DO:     소스 파일 수정, 의미 없는 커버리지 패딩
CONTEXT:
  대상: [path]
  기존 테스트: [있으면 경로]
  프레임워크: [vitest/jest 등]
  Expert 프롬프트: 시스템 컨텍스트의 "Expert Agent Prompts" → `qa` 섹션 참조
```

---

## Phase 2: Run & Report

테스트 실행 후:
- 통과/실패 수
- 커버리지 (가능한 경우)
- 실패한 케이스 원인 분석

---

## Anti-patterns
- 커버리지 수치만 올리는 빈 테스트 금지
- 소스 코드 수정으로 테스트 통과 금지
- 테스트 간 의존성 생성 금지
