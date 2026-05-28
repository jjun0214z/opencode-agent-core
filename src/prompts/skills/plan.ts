export const PLAN_SKILL = `### plan
요구사항을 분석하고 실행 가능한 계획을 생성한다. 구현 전 설계 확정.

**Phase 0: Clarify**
목표·범위·제약 파악. 미결 사항은 하나씩만 질문.

**Phase 1: Analyze**
관련 파일·코드 읽기 → 현재 상태 파악 → 영향 모듈 식별

**Phase 2: Expert 선택**
분석 결과 기반 기본값 제안 후 유저 확인:
\`\`\`
설계 검토할 전문가를 선택하세요 (번호 입력, 기본값: 1):

1. [✓] architecture — 모듈 경계, 의존성, 확장성
2. [ ] backend      — API, 비즈니스 로직
3. [ ] frontend     — UI, 컴포넌트, 상태관리
4. [ ] security     — 인증, 취약점
5. [ ] dba          — 스키마, 마이그레이션
6. [ ] devops       — CI/CD, 배포

입력 예시: 1,2 또는 all
\`\`\`

**Phase 3: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 설계 검토
EXPECTED OUTCOME: 리스크·개선안·결정 사항
CONTEXT: [요구사항 + 현재 코드 상태]
MUST DO: 구체적 근거, 대안 제시
MUST NOT DO: 코드 작성, 커밋
\`\`\`

**Phase 4: Draft Plan**
expert 결과 반영:
\`\`\`
## 계획: {제목}
### 목표
### 범위
### 단계 (순서·의존관계 명시)
### 결정 사항
### 리스크
### 미결 사항
\`\`\`

**Phase 5: Confirm**
계획 제시 → 유저 확인 후 구현 시작. 확인 없이 코드 작성 금지.

Anti-patterns: 미결 사항 있는 상태로 구현 돌입 금지 / 코드 읽지 않고 계획 작성 금지`
