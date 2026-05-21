# Skill: release

## Trigger
`/release`

## What This Is
배포 전 게이트. 마지막 배포 이후 변경사항을 분석하고 배포 가능 여부를 판단한다.
판단은 증거 기반이다. "아마 괜찮을 것"은 BLOCK 사유다.

---

## Phase 0: Collect Changes

```bash
# 마지막 태그 이후 변경사항
git log {last_tag}..HEAD --oneline
git diff {last_tag}..HEAD --stat
```

변경 파일 목록, 커밋 수, diff 수집.

---

## Phase 1: Analyze

병렬로 점검:

**1. 브레이킹체인지 탐지**
- 공개 API 변경
- 설정 스키마 변경
- 동작 변경 (기존 사용자 영향)

**2. 버전 결정 (semver)**
| 변경 유형 | 버전 |
|-----------|------|
| 브레이킹 변경 | MAJOR |
| 신규 기능 (호환) | MINOR |
| 버그 수정만 | PATCH |

**3. 체크리스트**
- [ ] 타입 에러 없음
- [ ] 테스트 통과
- [ ] `.env`, secrets 커밋 없음
- [ ] 미완성 코드 (`TODO`, `FIXME`, `console.log`) 없음

---

## Phase 2: Report

```markdown
# Release Gate

- 기준: {last_tag} → HEAD
- 커밋 수: {N}
- 변경 파일: {N}

## 판정: SAFE / CAUTION / BLOCK

## 권장 버전: {current} → {next}
사유: {한 줄}

## 브레이킹체인지
- 없음 / {목록}

## 블로킹 이슈
- 없음 / {즉시 조치 필요 항목}

## 체인지로그 초안
### feat
### fix
### refactor
```

---

## Anti-patterns
- 체크리스트 미완료 상태로 SAFE 판정 금지
- 브레이킹체인지 있는데 PATCH 권고 금지
- `git push`, `git tag`, 배포 명령 실행 금지 (판단만, 실행은 사용자)
