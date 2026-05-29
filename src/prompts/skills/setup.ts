export const SETUP_SKILL = `### setup
컨텍스트를 수집해 DB에 저장한다. 매 턴 자동 주입됨.

🚫 **Hard Blocks (진입 전 확인)**
- 모드 선택 전 수집 시작 금지
- 실제 파일 읽지 않고 요약 금지
- git commit·push 금지

---

**Phase 0: 모드 선택** _(유저 입력 게이트 — 응답 전 Phase 1 진입 금지)_
⛔ 기본값 없음 — 유저 입력 없이 진행 불가.

\`\`\`
컨텍스트 수집 방식을 선택하세요 (번호 입력, 기본값: 1):

1 — 프로젝트 기준 (git 히스토리, 파일 구조)
2 — 외부파일 기준 (설계 문서, 스펙, PDF 등)
3 — 문서 템플릿 설정 (core-doc 실행 시 적용할 템플릿 등록)
\`\`\`
빈 응답 시 기본값 1 적용.

출력: \`✅ Phase 0 완료 — 모드: [선택]\` 후 Phase 1 진입.

---

**Phase 1: 수집**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

**[모드 1: 프로젝트 기준]**

git 범위 선택 _(유저 입력 게이트)_:
\`\`\`
git 히스토리 범위를 선택하세요 (번호 입력, 기본값: 1):

1 — 1개월
2 — 3개월
3 — 전체
\`\`\`
빈 응답 시 기본값 1(1개월) 적용.

수집:
\`\`\`
bash: git log --oneline [선택 범위]
bash: git branch -a / git remote get-url origin / git shortlog -sn --no-merges -10
bash: ls -la
read: README.md / package.json / pyproject.toml / go.mod / Cargo.toml (있으면)
\`\`\`

출력: \`✅ Phase 1 완료 — 수집: 프로젝트 컨텍스트\` 후 Phase 2 진입.

---

**[모드 2: 외부파일 기준]**

파일 경로 수집 _(유저 입력 게이트)_:
\`\`\`
참조할 파일 경로를 입력하세요 (여러 개면 줄바꿈으로 구분)
\`\`\`

입력된 경로를 순서대로 Read → 파일명 slug화.
읽기 실패 시 해당 파일만 스킵. 여러 파일을 한 번에 합치기 금지.

출력: \`✅ Phase 1 완료 — 수집: [파일 목록]\` 후 Phase 2 진입.

---

**[모드 3: 문서 템플릿 설정]**

템플릿 이름 입력 _(유저 입력 게이트)_:
\`\`\`
템플릿 이름을 입력하세요 (예: 기획서, API명세, 화면설계)
\`\`\`

항목별 순서대로 묻는다 (각 항목 응답 후 다음으로):

1. 문서 제목 형식
   예시: "# {제목} — {날짜}" 또는 "# {프로젝트명} {유형}"

2. 포함할 섹션 (순서 입력)
   예시: 개요, 배경, 요구사항, 화면구조, 컴포넌트, API, 미결사항

3. 기본 출력 형식
   .md / .yaml / .html / .docx / .pdf / .xlsx 중 선택

4. 다이어그램 스타일
   mermaid / plantuml / 없음

5. 문서 언어
   한국어 / 영어 / 혼합

6. 커스텀 헤더·푸터 (선택)
   내용 직접 입력 또는 "없음"

출력: \`✅ Phase 1 완료 — 템플릿: [이름]\` 후 Phase 2 진입.

---

**Phase 2: 저장**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

**[모드 1]** \`agent_context_write\` 도구 호출:
- type: \`"context"\`
- content: 개요 / 스택 / 구조 / 브랜치 / 주요 기여자 / 커밋 히스토리

**[모드 2]** 파일마다 \`agent_context_write\` 도구 개별 호출:
- type: \`"external"\`
- slug: 파일명 기반 slug (예: \`design-spec\`)
- source_path: 원본 파일 경로
- content: 핵심 내용 요약 (구조·결정 사항·제약 위주로 압축)

**[모드 3]** \`agent_context_write\` 도구 호출:
- type: \`"template"\`
- slug: 템플릿 이름 기반 slug (예: \`기획서\` → \`doc-template-기획서\`)
- content: 아래 형식으로 저장
\`\`\`
name: [템플릿 이름]
title_format: [제목 형식]
sections: [섹션 목록, 순서대로]
output_format: [기본 출력 형식]
diagram: [mermaid | plantuml | none]
language: [한국어 | 영어 | 혼합]
header: [헤더 내용 또는 없음]
footer: [푸터 내용 또는 없음]
\`\`\`

출력: \`✅ Phase 2 완료\` → 완료 리포트 → agent_context_write(type="history") 호출.

리포트 형식:
- 모드 1·2:
\`\`\`
✅ 컨텍스트 저장 완료
- [저장 항목 목록]
이후 매 턴 자동 주입됩니다.
\`\`\`
- 모드 3:
\`\`\`
✅ 문서 템플릿 저장 완료
- 템플릿명: [이름]
- 섹션: [섹션 목록]
- 형식: [출력 형식] / 다이어그램: [스타일] / 언어: [언어]
core-doc 실행 시 템플릿 목록에 표시됩니다.
\`\`\``
