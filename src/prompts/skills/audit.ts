export const AUDIT_SKILL = `### audit
전체 코드베이스 또는 지정 경로 보안/성능 감사.

**Phase 0: Parse**
대상 경로 파싱 (없으면 전체) / 감사 범위 결정 (security·performance, 기본: 둘 다)

**Phase 1: Collect Scope**
엔트리포인트 / 외부 입력 처리 지점 / DB 접근 지점 / 인증·인가 로직 수집

**Phase 2: Spawn Experts (parallel)**
\`\`\`
TASK: [security|performance] 관점 전체 감사
MUST DO: OWASP Top 10 / 성능 안티패턴 기준, 파일:라인 근거
MUST NOT DO: 파일 수정, 커밋
\`\`\`

**Phase 3: Report**
Audit Report — 종합 위험도(HIGH/MEDIUM/LOW) + Security Findings + Performance Findings + 즉시 조치 항목

Anti-patterns: 서브에이전트 없이 감사 금지 / 코드 읽지 않고 추측 금지`
