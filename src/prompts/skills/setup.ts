export const SETUP_SKILL = `### setup
컨텍스트를 수집해 DB에 저장한다. 매 턴 자동 주입됨.

🚫 **Hard Blocks (진입 전 확인)**
- 모드 선택 전 수집 시작 금지
- 실제 파일 읽지 않고 요약 금지
- git commit·push 금지

---

**Phase 0: 모드 선택** _(유저 입력 게이트 — 응답 전 Phase 1 진입 금지)_
⛔ \`/core-setup\` 커맨드 진입 자체는 모드 선택으로 간주하지 않는다.
⛔ 기본값 없음 — 1/2/3/4 중 유저가 직접 입력해야만 진행. 빈 입력 = 대기.

\`\`\`
컨텍스트 수집 방식을 선택하세요 (번호 입력):

1 — 프로젝트 기준 (git 히스토리, 파일 구조)
2 — 외부파일 기준 (설계 문서, 스펙, PDF 등)
3 — 문서 템플릿 설정 (core-doc 실행 시 적용할 템플릿 등록)
4 — 저장 항목 관리 (목록 확인 · 삭제)
\`\`\`

출력: \`✅ Phase 0 완료 — 모드: [선택]\` 후 Phase 1 진입.

---

**Phase 1: 수집**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.
⚡ 모드 4 선택 시 → 이 Phase와 Phase 2 스킵. 아래 **[모드 4: 저장 항목 관리]** 섹션으로 즉시 이동.

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

참조 파일 경로 _(유저 입력 게이트)_:
\`\`\`
참고할 문서 파일 경로를 입력하세요 (없으면 Enter로 스킵):
예) /path/to/spec.md, /path/to/design.pdf
\`\`\`

- 경로가 입력된 경우: Read 도구로 파일을 읽고, 구조·섹션·스타일을 분석해 아래 항목의 기본값을 자동 추출한다.
  - 파일 읽기 실패 시 해당 파일만 스킵 후 계속.
  - 분석 완료 후 출력: \`📄 참조 파일 분석 완료 — [파일명] 기반으로 항목을 제안합니다\`
- 경로 없이 스킵 시: 항목별 기본값 없이 직접 입력 받는다.

템플릿 이름 입력 _(유저 입력 게이트)_:
\`\`\`
템플릿 이름을 입력하세요 (예: 기획서, API명세, 화면설계)
\`\`\`

항목별 순서대로 묻는다. 참조 파일이 있으면 분석된 값을 기본값으로 제시하고 사용자가 수정 가능 (Enter = 제안값 그대로 적용):

**[구조]**

1. 문서 제목 형식
   예시: "# {제목} — {날짜}" 또는 "# {프로젝트명} {유형}"

2. 포함할 섹션 (순서 입력)
   예시: 개요, 배경, 요구사항, 화면구조, 컴포넌트, API, 미결사항

3. 기본 출력 형식
   .md / .yaml / .html / .docx / .pdf / .xlsx 중 선택

4. 문서 언어
   한국어 / 영어 / 혼합

**[디자인 — Markdown 공통]**

5. 섹션 구분 방식
   - \`---\` 구분선
   - 이모지 헤딩 (예: ## 📋 개요)
   - 없음

6. 콜아웃 스타일
   - GitHub style (\`> [!NOTE]\` / \`> [!WARNING]\` / \`> [!TIP]\`)
   - 일반 blockquote (\`>\`)
   - 없음

7. 코드블록 언어 태깅
   자동 (언어 명시) / 없음

8. 다이어그램 스타일
   mermaid / plantuml / 없음

**[디자인 — 리치 포맷 (docx · pdf · pptx 선택 시)]**

9. 컬러 테마
   브랜드 컬러 HEX 입력 (예: #0066CC) 또는 "기본"

10. 폰트
    제목 폰트 / 본문 폰트 (예: Noto Sans / Pretendard) 또는 "기본"

11. 표지 포함 여부
    포함 / 없음

12. 로고·워터마크 (선택)
    파일 경로 입력 또는 "없음"

**[공통]**

13. 커스텀 헤더·푸터 (선택)
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
language: [한국어 | 영어 | 혼합]
section_divider: [--- | emoji-heading | none]
callout_style: [github | blockquote | none]
code_lang_tag: [auto | none]
diagram: [mermaid | plantuml | none]
color_theme: [HEX 또는 none]
font_title: [폰트명 또는 none]
font_body: [폰트명 또는 none]
cover_page: [true | false]
logo_path: [파일 경로 또는 none]
header: [헤더 내용 또는 none]
footer: [푸터 내용 또는 none]
reference_files: [참조 파일 경로 목록 또는 none]
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
\`\`\`
- 모드 4: 관리 완료 리포트 출력

---

**[모드 4: 저장 항목 관리]**

**Step 1: 목록 조회**
\`agent_context_manage\` 도구 호출 (action="list") → 결과 출력.

출력 예시:
\`\`\`
## 저장된 항목
📍 DB: /path/to/agent-core.db  |  프로젝트: /path/to/project

- context: 있음  (업데이트: 2026-05-10)
- external (2개):
  - design-spec  ← /path/to/spec.md
  - api-doc      ← /path/to/api.yaml
- template (1개):
  - doc-template-기획서  (형식: .md / 섹션: 개요, 배경, 요구사항)
- history (3건):
  - [41] setup        2026-05-10  프로젝트 컨텍스트 저장 완료 — agent-core-plugin ...
  - [42] dev          2026-05-12  로그인 기능 구현 완료 — JWT 발급·검증 로직 추가
  - [43] debug        2026-05-15  버튼 클릭 오류 수정 — onClick 핸들러 null 체크 누락
\`\`\`

출력: \`✅ Step 1 완료 — 목록 조회\` 후 Step 2 진입.

---

**Step 2: 삭제 방식 선택** _(유저 입력 게이트 — 응답 전 Step 3 진입 금지)_
⛔ STOP. 이전 Step 완료 마커 없으면 진입 금지.

\`\`\`
삭제 방식을 선택하세요 (번호 입력):

1 — 항목 선택 삭제  (모든 항목 번호 목록에서 직접 선택)
2 — 종류 선택 후 삭제  (종류 먼저 고르고 해당 항목 선택)
3 — 전체 초기화  (DB 내 모든 항목 삭제)
0 — 취소
\`\`\`
빈 응답 또는 0 선택 시 종료.

출력: \`✅ Step 2 완료 — 방식: [선택]\` 후 Step 3 진입.

---

**Step 3: 삭제 대상 확정** _(유저 입력 게이트 — 응답 전 Step 4 진입 금지)_
⛔ STOP. 이전 Step 완료 마커 없으면 진입 금지.
Step 1에서 이미 호출한 \`list\` 결과를 재사용한다 (재호출 금지).
- context · external · history: 현재 프로젝트 범위
- template: 전체 공용 — 삭제 시 모든 프로젝트 세션에 영향. 삭제 전 경고 문구 표시.

**[방식 1: 항목 선택 삭제]**
Step 1 \`list\` 결과를 기반으로 항목에 번호를 부여해 표시. history는 row 단위:
\`\`\`
삭제할 항목 번호를 입력하세요 (쉼표 구분, 예: 1,3,5):

[context]
  1. context  (업데이트: YYYY-MM-DD)

[external]
  2. design-spec  ← /path/to/spec.md
  3. api-doc      ← /path/to/api.yaml

[template]
  4. doc-template-기획서  (형식: .md / 섹션: ...)

[history]
  5. [41] setup        2026-05-10  프로젝트 컨텍스트 저장 완료 ...
  6. [42] dev          2026-05-12  로그인 기능 구현 완료 ...
  7. [43] debug        2026-05-15  버튼 클릭 오류 수정 ...
\`\`\`
존재하는 항목만 번호 부여. history row의 \`[숫자]\`는 DB row ID. 빈 응답 시 취소.

**[방식 2: 종류 선택 후 삭제]** _(2-round)_

_Round 1 — 종류 선택_ _(유저 입력 게이트)_
\`\`\`
삭제할 종류를 선택하세요 (번호 입력):

1 — context
2 — external  ([N]개)
3 — template  ([N]개, 공용 — 삭제 시 전 프로젝트 영향)
4 — history   ([N]건)
\`\`\`
빈 응답 시 취소.

_Round 2 — 해당 종류의 항목 선택_ _(유저 입력 게이트)_
Step 1 \`list\` 결과에서 선택된 종류의 항목만 번호 목록으로 표시 (현재 프로젝트 범위):
\`\`\`
삭제할 항목 번호를 입력하세요 (쉼표 구분, 또는 "전체"):

  1. [41] setup   2026-05-10  ...   ← history 선택 시 예시
  2. [42] dev     2026-05-12  ...
  3. [43] debug   2026-05-15  ...
\`\`\`
- context: 항목이 1개이므로 번호 없이 "삭제하시겠습니까? (Enter = 확인, 그 외 = 취소)" 출력
- external·template: slug 목록 번호로 표시
- history: DB row ID \`[숫자]\`와 함께 번호로 표시
- "전체" 입력 시 해당 종류 전체 삭제
- 빈 응답 시 취소

**[방식 3: 전체 초기화]**
\`\`\`
⚠️  현재 프로젝트의 context·external·history와 공용 template 전체가 삭제됩니다.
    template 삭제는 모든 프로젝트 세션에 영향을 줍니다.
    확인하려면 "전체삭제" 를 입력하세요:
\`\`\`
정확히 "전체삭제" 입력 시에만 진행. 그 외 입력 시 취소.

출력: \`✅ Step 3 완료 — 삭제 대상: [확정 목록]\` 후 Step 4 진입.

---

**Step 4: 삭제 실행**
⛔ STOP. 이전 Step 완료 마커 없으면 진입 금지.

확정된 항목마다 \`agent_context_manage\` 도구 호출:
- context: action="delete", type="context"
- external: action="delete", type="external", slug=[slug]
- template: action="delete", type="template", slug=[slug]
- history 개별 row: action="delete", type="history", id=[row ID]
- history 월 전체: action="delete", type="history", slug="YYYY-MM"
- history 전체: action="delete", type="history"
- 방식 3(전체 초기화): context → external 각 slug → template 각 slug → history 순서로 개별 호출.
- 실패한 항목은 오류 메시지 표시 후 계속 진행.

삭제 완료 후:
\`\`\`
✅ 삭제 완료
- [삭제된 항목 목록]
\`\`\`
→ agent_context_write(type="history") 호출.`
