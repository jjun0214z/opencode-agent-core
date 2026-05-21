# agent-core

OpenCode 플러그인 하네스. 자연어 명령을 스킬로 라우팅하고 전문가 서브에이전트에 위임한다.

## 구조

```
src/
  index.ts              # 플러그인 진입점
  hooks/index.ts        # OpenCode 훅 (system.transform, tool.execute.after 등)
  prompts/
    orchestrator.ts     # 오케스트레이터 시스템 프롬프트
    agents/index.ts     # 전문가 서브에이전트 프롬프트 (모델별)
    types.ts            # ModelFamily 타입
  context/
    readme-injector.ts  # 파일 읽기 시 README 자동 주입
    compaction.ts       # 세션 압축 전 컨텍스트 보존
    storage.ts          # 파일 기반 스토리지

prompts/skills/         # 슬래시 커맨드별 스킬 파일 (.md)
```

## 스킬

| 커맨드 | 설명 |
|--------|------|
| /plan | 요구사항 분석 → 실행 계획 |
| /dev | 신규 기능 개발 |
| /refactor | 구조 개선 |
| /debug | 버그 진단 |
| /test | 테스트 작성 |
| /review | 코드 검토 |
| /review-pr | PR diff 분석 |
| /audit | 보안/성능 감사 |
| /doc | 문서화 |
| /release | 배포 게이트 |
| /setup | 환경 점검 |

## 개발

```bash
pnpm build       # 빌드
pnpm typecheck   # 타입 체크
pnpm dev         # watch 모드
```
