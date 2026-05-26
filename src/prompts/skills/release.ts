export const RELEASE_SKILL = `### release
배포 전 게이트. 증거 기반 판단. "아마 괜찮을 것"은 BLOCK 사유.

**Phase 0: 기준점 확인**
\`git tag --sort=-v:refname | head -1\` → 마지막 태그 확인
없으면 유저에게 비교 기준 브랜치 입력 요청 (예: main, develop)

**Phase 1: 변경사항 수집**
\`\`\`
git log <last_tag>..HEAD --oneline
git diff <last_tag>..HEAD --stat
\`\`\`

**Phase 2: Expert 선택**
\`\`\`
검토할 전문가를 선택하세요 (번호 입력, 기본값: 1,2):

1. [✓] security     — secrets 노출, 취약점
2. [✓] qa           — 테스트 통과, 미완성 코드
3. [ ] backend      — API 브레이킹체인지
4. [ ] frontend     — UI 브레이킹체인지
5. [ ] devops       — 배포 설정, 환경변수
6. [ ] dba          — 마이그레이션 안전성

입력 예시: 1,2,3 또는 all
\`\`\`

**Phase 3: Spawn Experts (parallel)**
\`\`\`
TASK: [expert] 관점 배포 안전성 검토
EXPECTED OUTCOME: SAFE/CAUTION/BLOCK 판정 + 근거
CONTEXT: [변경 커밋 목록 + diff stat]
MUST DO: 파일:라인 근거, 증거 기반 판정
MUST NOT DO: 파일 수정, 커밋, 배포 명령 실행
\`\`\`

**Phase 4: 체크리스트**
- [ ] 타입 에러 없음
- [ ] 테스트 통과
- [ ] secrets·API키 커밋 없음
- [ ] TODO/FIXME/WIP 미완성 코드 없음
- [ ] 브레이킹체인지 문서화됨
- [ ] DB 마이그레이션 순서 안전

**Phase 5: Report**
\`\`\`
## Release Gate

판정: 🟢 SAFE / 🟡 CAUTION / 🔴 BLOCK

권장 버전: x.y.z (semver 기준)
브레이킹체인지: [있음/없음]

### Expert 소견
[각 expert 판정 요약]

### 체인지로그 초안
[변경사항 요약]

### 조치 필요 항목 (BLOCK·CAUTION 시)
[즉시 해결해야 할 항목]
\`\`\`

Anti-patterns: 체크리스트 미완료 SAFE 판정 금지 / git push·tag·배포 명령 실행 금지 / 증거 없이 판정 금지`
