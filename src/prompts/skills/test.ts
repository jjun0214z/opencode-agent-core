export const TEST_SKILL = `### test
테스트 작성 및 실행. expert에게 위임해 전략·엣지케이스·코드 작성까지 수행.

**Phase 0: 환경 파악**
대상 파일·모듈 확인 → 유저에게 테스트 케이스 힌트 수집 (없으면 expert가 코드 분석해서 도출)

package.json / pyproject.toml / go.mod 읽어 프레임워크 감지:
- frontend: vitest / jest / @testing-library / cypress / playwright
- backend: pytest / junit / go test / rspec 등
- 설정 파일: vitest.config.ts / jest.config.ts / playwright.config.ts

프레임워크 미감지 시 설치 제안:
\`\`\`
테스트 프레임워크가 없습니다. 설치할까요?
- Vite 계열  → vitest + @testing-library
- Next.js    → jest + @testing-library
- E2E        → playwright
- Python     → pytest
\`\`\`

**Phase 1: 레이어 선택**
\`\`\`
어떤 테스트를 작성할까요?
1. [ ] Unit/Component — 함수·컴포넌트 단위
2. [ ] Integration    — 여러 모듈 연동
3. [ ] E2E            — 전체 유저 플로우

입력 예시: 1 또는 1,3
\`\`\`

**Phase 2: Expert 선택**
\`\`\`
테스트 작성할 전문가를 선택하세요 (번호 입력, 기본값: 1):

1. [✓] qa           — 테스트 전략, 엣지케이스
2. [ ] frontend     — 컴포넌트·E2E 테스트
3. [ ] backend      — API·로직 테스트
4. [ ] dba          — DB·쿼리 테스트

입력 예시: 1,2 또는 all
\`\`\`

**Phase 3: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 테스트 작성
EXPECTED OUTCOME: 실행 가능한 테스트 파일
CONTEXT: [대상 코드 + 프레임워크 + 기존 패턴 + 유저 힌트]
MUST DO: 기존 패턴 엄수, 각 케이스에 의도 명시, 실제 실행 가능한 코드
MUST NOT DO: 소스 파일 수정, 의미 없는 커버리지 패딩, 커밋
\`\`\`

**Phase 4: Run & Report**
테스트 실행 → 통과/실패 수 / 커버리지 / 실패 원인 분석

Anti-patterns: 빈 테스트로 커버리지 채우기 금지 / 소스 수정으로 테스트 통과 금지 / 프레임워크 확인 전 코드 작성 금지`
