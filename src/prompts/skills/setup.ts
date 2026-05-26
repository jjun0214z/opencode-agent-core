export const SETUP_SKILL = `### setup
컨텍스트를 수집해 \`.agent-core/\` 에 저장한다. 매 턴 자동 주입됨.

**Phase 0: 모드 선택**
먼저 유저에게 묻는다:
\`\`\`
컨텍스트 수집 방식을 선택하세요:
1 — 프로젝트 기준 (git 히스토리, 파일 구조)
2 — 외부파일 기준 (설계 문서, 스펙, PDF 등)
\`\`\`

---

**[모드 1: 프로젝트 기준]**

Phase 1-A: git 범위 선택
\`\`\`
git 히스토리 범위를 선택하세요:
1 — 1개월
2 — 3개월
3 — 전체
\`\`\`

Phase 1-B: 수집
\`\`\`
bash: git log --oneline [선택 범위]
bash: git branch -a / git remote get-url origin / git shortlog -sn --no-merges -10
bash: ls -la
read: README.md / package.json / pyproject.toml / go.mod / Cargo.toml (있으면)
\`\`\`

Phase 1-C: \`.agent-core/context.md\` 작성
개요 / 스택 / 구조 / 브랜치 / 주요 기여자 / 커밋 히스토리

리포트: \`✅ .agent-core/context.md 생성 완료\`

---

**[모드 2: 외부파일 기준]**

Phase 2-A: 파일 경로 수집
유저에게 묻는다: "참조할 파일 경로를 입력하세요 (여러 개면 줄바꿈으로 구분)"

Phase 2-B: 파일별 개별 처리
입력된 경로를 순서대로 read → 파일명 slug화 → \`.agent-core/external/<slug>.md\` 로 각각 저장.
읽기 실패 시 해당 파일만 스킵. 여러 파일을 하나로 합치기 금지.

각 파일 저장 형식:
\`\`\`markdown
# [원본 파일 경로]
> 생성: [날짜]

[핵심 내용 요약 — 구조·결정 사항·제약 위주로 압축]
\`\`\`

리포트:
\`\`\`
✅ 외부 컨텍스트 저장 완료
- .agent-core/external/[slug].md  ← [원본 경로]
이후 매 턴 자동 주입됩니다.
\`\`\`

---

Anti-patterns: 실제 파일 읽지 않고 요약 금지 / 모드 선택 전 수집 시작 금지`
