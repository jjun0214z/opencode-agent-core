# Skill: setup

## What This Is
컨텍스트를 수집해 `.agent-core/` 에 저장한다. 매 턴 자동 주입됨.

---

## Phase 0: 모드 선택

먼저 유저에게 묻는다:

```
컨텍스트 수집 방식을 선택하세요:
1 — 프로젝트 기준 (git 히스토리, 파일 구조)
2 — 외부파일 기준 (설계 문서, 스펙, PDF 등)
```

---

## [모드 1: 프로젝트 기준]

### Phase 1-A: git 범위 선택

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

### Phase 1-B: 수집

```
bash: git log --oneline [선택한 범위]
bash: git branch -a
bash: git remote get-url origin
bash: git shortlog -sn --no-merges -10
bash: ls -la
read: README.md (있으면)
read: package.json / pyproject.toml / go.mod / Cargo.toml (있으면)
```

### Phase 1-C: `.agent-core/context.md` 작성

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

리포트:
```
✅ .agent-core/context.md 생성 완료
히스토리 범위: [선택값] | 커밋 수: [N]개
이후 매 턴 자동 주입됩니다.
```

---

## [모드 2: 외부파일 기준]

### Phase 2-A: 파일 경로 수집

유저에게 묻는다: "참조할 파일 경로를 입력하세요 (여러 개면 줄바꿈으로 구분)"

### Phase 2-B: 파일별 개별 처리

입력된 경로를 순서대로 처리한다:
- 각 파일을 read
- 파일명을 slug화 (경로 구분자 → `-`, 확장자 제거)
- `.agent-core/external/<slug>.md` 로 저장
- 읽기 실패 시 해당 파일만 스킵하고 계속 진행

저장 형식:
```markdown
# [원본 파일 경로]
> 생성: [날짜]

[핵심 내용 요약 — 구조·결정 사항·제약 위주로 압축]
```

### Phase 2-C: 리포트

```
✅ 외부 컨텍스트 저장 완료
- .agent-core/external/[slug].md  ← [원본 경로]
- .agent-core/external/[slug].md  ← [원본 경로]
...
이후 매 턴 자동 주입됩니다.
```

---

## Anti-patterns
- 실제 파일 읽지 않고 요약 금지
- 모드 선택 전 수집 시작 금지
- 여러 외부파일을 하나로 합치기 금지 (파일별 개별 저장)
