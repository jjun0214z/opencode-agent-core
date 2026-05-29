export const DOC_SKILL = `### doc
설계 문서 작성. 프로젝트 docs/ 폴더에 저장해 팀과 공유·버전 관리.

🚫 **Hard Blocks (진입 전 확인)**
- 유형·형식 확인 전 작성 금지
- 코드 읽지 않고 가정으로 작성 금지 (모드 1 시)
- 파일 수정 금지 (docs/ 신규 생성만 허용)
- git commit·push 금지

---

**Phase 0: 템플릿 확인 및 문서 유형 선택** _(유저 입력 게이트 — 응답 전 Phase 1 진입 금지)_
⛔ 기본값 없음 — 유저 입력 없이 진행 불가.

먼저 DB에서 저장된 템플릿(type="template") 목록을 확인한다.

**[저장된 템플릿 있는 경우]**
\`\`\`
저장된 문서 템플릿이 있습니다. 선택하세요 (번호 입력):

[번호]. [템플릿 이름] — 섹션: [섹션 목록 요약] / 형식: [출력 형식]
...
0. 템플릿 없이 새로 설정

\`\`\`
템플릿 선택 시 → 해당 템플릿의 섹션·형식·다이어그램·언어 설정 자동 적용
0 선택 시 → 아래 기본 유형 선택으로 진행

**[저장된 템플릿 없는 경우]**
\`\`\`
어떤 문서를 작성할까요? (번호 입력, 기본값: 없음)

1. [ ] 화면설계    — 유저플로우, 화면구조, 컴포넌트 트리
2. [ ] API 스펙    — 엔드포인트, 요청/응답, 에러코드
3. [ ] DB 스키마   — 테이블 구조, 관계, 인덱스
4. [ ] 아키텍처   — 시스템 구조, 모듈 경계, ADR
5. [ ] 배포 설계   — 인프라, 배포 흐름, 환경 구성

입력 예시: 1,2 또는 all
\`\`\`

출력: \`✅ Phase 0 완료 — 유형: [선택] / 템플릿: [이름 또는 없음]\` 후 Phase 1 진입.

---

**Phase 1: 출력 형식 선택** _(유저 입력 게이트 — 응답 전 Phase 2 진입 금지)_
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.
⚡ Phase 0에서 템플릿 선택 완료 시 → 템플릿의 output_format 자동 적용, 이 Phase 스킵.

\`\`\`
출력 형식을 선택하세요 (번호 입력, 기본값: 1):

1. [✓] .md    — Markdown (기본, Mermaid 다이어그램 포함)
2. [ ] .yaml  — OpenAPI 스펙 (API 스펙 선택 시)
3. [ ] .json  — 구조화 데이터
4. [ ] .csv   — 테이블 데이터 (DB 스키마·목록)
5. [ ] .html  — 브라우저 바로 열기
6. [ ] .xlsx  — Excel         (pandas/openpyxl 또는 exceljs 필요)
7. [ ] .docx  — Word          (pandoc 또는 python-docx 필요)
8. [ ] .pdf   — PDF           (pandoc 필요)
9. [ ] .pptx  — PowerPoint    (Marp 또는 python-pptx 필요)
10.[ ] .puml  — PlantUML 다이어그램
\`\`\`
빈 응답 시 기본값 1(.md) 적용.

외부 도구 필요 시 → 환경 확인 후 없으면 설치 제안:
- .xlsx: \`python -c "import pandas, openpyxl"\` 또는 \`node -e "require('exceljs')"\`
- .docx/.pdf: \`pandoc --version\` 또는 \`python -c "import docx"\`
- .pptx: \`marp --version\` 또는 \`python -c "import pptx"\`

출력: \`✅ Phase 1 완료 — 형식: [선택]\` 후 Phase 2 진입.

---

**Phase 2: Expert 결정 (유형 기반 자동)**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

**[템플릿 선택한 경우]** 섹션 목록 기반으로 Expert 자동 결정:
- 섹션에 "화면", "컴포넌트", "유저플로우" 포함 → frontend
- 섹션에 "모바일", "앱", "iOS", "Android" 포함 → mobile 추가
- 섹션에 "API", "엔드포인트", "응답" 포함 → backend
- 섹션에 "스키마", "테이블", "DB" 포함 → dba
- 섹션에 "인프라", "배포", "CI" 포함 → devops
- 섹션에 "아키텍처", "모듈", "의존성" 포함 → architecture

**[템플릿 없이 유형 선택한 경우]** 유형별 Expert 자동 결정:
- 화면설계 → frontend (모바일 화면 포함 시 mobile 추가)
- API 스펙 → backend
- DB 스키마 → dba
- 아키텍처 → architecture
- 배포 설계 → devops

출력: \`✅ Phase 2 완료 — Expert: [결정된 목록]\` 후 Phase 3 진입.

---

**Phase 3: 소스 확인** _(유저 입력 게이트 — 응답 전 Phase 4 진입 금지)_
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

\`\`\`
문서 작성 기준을 선택하세요 (번호 입력, 기본값: 1):

1 — 기존 코드 기반 (개발 후 역추적)
2 — 요구사항·기획 기반 (개발 전 설계)
\`\`\`
빈 응답 시 기본값 1 적용.

모드 1: 관련 파일 전체 읽기 → 실제 구현 파악 (가정 금지)
모드 2: 유저에게 요구사항·기획 내용 입력 요청

출력: \`✅ Phase 3 완료 — 소스: [모드]\` 후 Phase 4 진입.

---

**Phase 4: Spawn Experts (parallel)**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.
⛔ 반드시 agent 툴로 병렬 spawn. 오케스트레이터 직접 작성 금지. 순차 실행 금지.

각 결정된 expert마다 병렬 호출:
\`\`\`
agent(
  name: "{expert}",
  prompt: """
  TASK: {expert} 관점 설계 문서 작성
  EXPECTED OUTCOME: docs/<slug>.{형식} 파일 (실제 저장 완료)
  CONTEXT: [관련 코드 또는 요구사항] + [출력 형식: {형식}] + [기존 docs/ 내용] + [템플릿 설정: {섹션순서·제목형식·다이어그램·언어} 또는 없음]
  MUST DO: 실제 코드 또는 요구사항 기반 / 구조·결정·제약 위주 / docs/ 경로에 Write로 저장
  MUST NOT DO: 코드 수정 / 가정으로 작성 / git commit·push
  REQUIRED TOOLS: Read, Write, Bash
  """
)
\`\`\`

출력: \`✅ Phase 4 완료 — Expert 결과 수신\` 후 Phase 5 진입.

---

**Phase 5: 저장 확인**
⛔ STOP. 이전 Phase 완료 마커 없으면 진입 금지.

- .md/.yaml/.json/.html/.csv/.puml → Write 도구로 \`docs/<slug>.<ext>\` 저장 확인
- .xlsx/.docx/.pdf/.pptx → 스크립트 실행 후 파일 생성 확인

출력: \`✅ Phase 5 완료\` → \`✅ docs/[slug].[ext] 저장 완료\` → agent_context_write(type="history") 호출.`
