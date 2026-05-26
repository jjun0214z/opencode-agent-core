export const REVIEW_SKILL = `### review
파일/디렉토리 단위 코드 검토. 전문가 서브에이전트 병렬 스폰.

**Phase 0: 대상 확인**
경로 미입력 시 유저에게 묻는다: "검토할 파일 또는 디렉토리 경로를 입력하세요 (없으면 현재 변경 파일)"
대상 파일 목록 수집 → 내용 읽기

**Phase 1: Expert 선택**
유저에게 묻는다:
\`\`\`
리뷰할 전문가를 선택하세요 (번호 입력, 기본값: 3):

1. [ ] backend      — API, 비즈니스 로직
2. [ ] frontend     — UI, 컴포넌트, 상태관리
3. [✓] qa           — 테스트, 엣지케이스
4. [ ] security     — 인증, 취약점
5. [ ] performance  — N+1, 쿼리, 번들
6. [ ] dba          — 스키마, 마이그레이션, 쿼리 튜닝
7. [ ] devops       — CI/CD, 컨테이너, 배포
8. [ ] architecture — 모듈 경계, 의존성, 확장성

입력 예시: 1,3,4 또는 all
\`\`\`
입력 없으면 qa(3)만 실행.

**Phase 2: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 코드 검토
EXPECTED OUTCOME: Critical/Warning/Info 분류 소견
CONTEXT: [대상 파일 내용]
MUST DO: 파일:라인 근거 명시, 심각도 표시
MUST NOT DO: 파일 수정, 추측성 소견
\`\`\`

**Phase 3: Report**
종합 의견 1단락 + 심각도별 병합:
- 🔴 Critical — 즉시 수정 필요
- 🟡 Warning — 권고
- 🔵 Info — 참고

Anti-patterns: 파일 읽지 않고 소견 금지 / 순차 실행 금지(반드시 병렬)`
