export const DOC_SKILL = `### doc
설계 문서 작성. 프로젝트 docs/ 폴더에 저장해 팀과 공유·버전 관리.

**Phase 0: 문서 유형 선택**
\`\`\`
어떤 문서를 작성할까요?
1. [ ] 화면설계    — 유저플로우, 화면구조, 컴포넌트 트리
2. [ ] API 스펙    — 엔드포인트, 요청/응답, 에러코드
3. [ ] DB 스키마   — 테이블 구조, 관계, 인덱스
4. [ ] 아키텍처    — 시스템 구조, 모듈 경계, ADR
5. [ ] 배포 설계   — 인프라, 배포 흐름, 환경 구성

입력 예시: 1,2 또는 all
\`\`\`

**Phase 1: 출력 형식 선택**
\`\`\`
출력 형식을 선택하세요:
1.  .md    — Markdown (기본, Mermaid 다이어그램 포함)
2.  .yaml  — OpenAPI 스펙 (API 스펙 선택 시)
3.  .json  — 구조화 데이터
4.  .csv   — 테이블 데이터 (DB 스키마·목록)
5.  .html  — 브라우저 바로 열기
6.  .xlsx  — Excel         (pandas/openpyxl 또는 exceljs 필요)
7.  .docx  — Word          (pandoc 또는 python-docx 필요)
8.  .pdf   — PDF           (pandoc 필요)
9.  .pptx  — PowerPoint    (Marp 또는 python-pptx 필요)
10. .puml  — PlantUML 다이어그램

입력 없으면 .md 기본.
\`\`\`

외부 도구 필요 시 → 환경 확인 후 없으면 설치 제안:
- .xlsx: \`python -c "import pandas, openpyxl"\` 또는 \`node -e "require('exceljs')"\`
- .docx/.pdf: \`pandoc --version\` 또는 \`python -c "import docx"\`
- .pptx: \`marp --version\` 또는 \`python -c "import pptx"\`

**Phase 2: Expert 선택 (유형 기반 자동 결정)**
- 화면설계 → frontend
- API 스펙 → backend
- DB 스키마 → dba
- 아키텍처 → architecture
- 배포 설계 → devops

**Phase 3: 소스 확인**
유저에게 묻는다:
\`\`\`
문서 작성 기준을 선택하세요:
1 — 기존 코드 기반 (개발 후 역추적)
2 — 요구사항·기획 기반 (개발 전 설계)
\`\`\`

모드 1: 관련 파일 읽기 → 실제 구현 파악 (가정 금지)
모드 2: 유저에게 요구사항·기획 내용 입력 요청 → DB 주입 컨텍스트 참고

**Phase 4: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 설계 문서 작성
EXPECTED OUTCOME: 선택한 형식의 문서
CONTEXT: [관련 코드 + 출력 형식 + 기존 문서]
MUST DO: 실제 코드 기반, 구조·결정·제약 위주
MUST NOT DO: 코드 수정, 가정으로 작성, 커밋
\`\`\`

**Phase 5: 저장**
- .md/.yaml/.json/.html/.csv/.puml → Write 도구로 \`docs/<slug>.<ext>\` 저장
- .xlsx/.docx/.pdf/.pptx → 스크립트 생성 후 Bash로 실행해 파일 생성

리포트: \`✅ docs/[slug].[ext] 저장 완료\`

Anti-patterns: 소스 모드 확인 전 작성 금지 / 형식 확인 전 작성 금지 / 모드1에서 코드 읽지 않고 가정으로 작성 금지`
