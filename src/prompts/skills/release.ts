export const RELEASE_SKILL = `### release
배포 전 게이트. 증거 기반 판단. "아마 괜찮을 것"은 BLOCK 사유.

**Phase 0: Collect**
\`git log {last_tag}..HEAD --oneline\` + \`git diff {last_tag}..HEAD --stat\`

**Phase 1: Analyze (parallel)**
브레이킹체인지 탐지 / 버전 결정(semver) / 체크리스트
- [ ] 타입 에러 없음 / 테스트 통과 / secrets 커밋 없음 / 미완성 코드 없음

**Phase 2: Report**
Release Gate — SAFE/CAUTION/BLOCK 판정 + 권장 버전 + 브레이킹체인지 + 체인지로그 초안

Anti-patterns: 체크리스트 미완료 SAFE 판정 금지 / git push·tag·배포 명령 실행 금지`
