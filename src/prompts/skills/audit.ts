export const AUDIT_SKILL = `### audit
전체 코드베이스 또는 지정 경로 보안/성능 감사.

**Phase 0: Scope**
대상 경로 확인 (없으면 전체)
엔트리포인트 / 외부 입력 처리 지점 / DB 접근 지점 / 인증·인가 로직 수집

**Phase 1: Expert 선택**
\`\`\`
감사할 전문가를 선택하세요 (번호 입력, 기본값: 1,2):

1. [✓] security     — OWASP Top 10, 인증, 취약점
2. [✓] performance  — N+1, 쿼리, 번들, 병목
3. [ ] dba          — 스키마, 인덱스, 쿼리 튜닝
4. [ ] devops       — CI/CD, 컨테이너, 시크릿 노출
5. [ ] architecture — 모듈 경계, 의존성

입력 예시: 1,2,3 또는 all
\`\`\`

**Phase 2: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 코드 감사
EXPECTED OUTCOME: HIGH/MEDIUM/LOW 분류 소견
CONTEXT: [대상 코드 전체]
MUST DO: OWASP Top 10 / 성능 안티패턴 기준, 파일:라인 근거
MUST NOT DO: 파일 수정, 커밋, 추측성 소견
\`\`\`

**Phase 3: Report**
종합 위험도 + 심각도별 병합:
- 🔴 HIGH — 즉시 조치 필요
- 🟡 MEDIUM — 개선 권고
- 🔵 LOW — 참고

Anti-patterns: 서브에이전트 없이 감사 금지 / 코드 읽지 않고 추측 금지 / 순차 실행 금지`
