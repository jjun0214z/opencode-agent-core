# Skill: setup

## Trigger
`/setup`

## What This Is
프로젝트 컨텍스트를 수집하여 `.agent-core/context.md`에 저장한다.
처음 사용하거나 프로젝트가 크게 바뀌었을 때 실행한다.

---

## Phase 0: git 히스토리 범위 선택

먼저 유저에게 묻는다:

```
git 히스토리 범위를 선택하세요:

1 — 1개월
2 — 3개월
3 — 전체
```

선택에 따라:
- `1` → `git log --oneline --since="1 month ago"`
- `2` → `git log --oneline --since="3 months ago"`
- `3` → `git log --oneline`

---

## Phase 1: 프로젝트 정보 수집

아래 항목을 도구로 직접 수집한다. 추측 금지.

```
bash: git log --oneline [선택한 범위]   → 커밋 히스토리
bash: git branch -a                     → 전체 브랜치
bash: git remote get-url origin         → 원격 저장소
bash: git shortlog -sn --no-merges -10  → 주요 기여자
bash: ls -la                            → 루트 구조
read: README.md (있으면)
read: package.json / pyproject.toml / go.mod / Cargo.toml (있으면)
```

---

## Phase 2: `.agent-core/context.md` 작성

수집한 내용으로 아래 형식에 맞춰 작성한다:

```markdown
# 프로젝트 컨텍스트
> 생성: [날짜] | 히스토리 범위: [선택값]

## 개요
[README 또는 package.json 기반 설명]

## 스택
[언어, 프레임워크, 주요 라이브러리]

## 구조
[루트 디렉토리 주요 항목]

## 브랜치
현재: [브랜치명]
원격: [URL]
전체: [git branch -a 결과]

## 주요 기여자
[git shortlog 결과]

## 커밋 히스토리 ([범위])
[git log 결과]
```

---

## Phase 3: 완료 리포트

```
✅ .agent-core/context.md 생성 완료
히스토리 범위: [선택값]
커밋 수: [N]개
이후 매 턴 자동 주입됩니다.
```

## Anti-patterns
- 실제 수집 없이 작성 금지
- 범위 선택 전 수집 시작 금지
