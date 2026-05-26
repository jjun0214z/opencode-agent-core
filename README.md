# agent-core-plugin

> OpenCode 플러그인 — 자연어 명령을 11개 스킬로 라우팅하고 8명의 전문가 서브에이전트에 병렬 위임하는 AI 코딩 하네스

---

## 개요

`agent-core-plugin`은 [OpenCode](https://github.com/sst/opencode) 위에서 동작하는 플러그인입니다.  
별도의 슬래시 커맨드 없이 **자연어만으로** 작업 의도를 감지하여 적합한 스킬을 실행하고,  
필요 시 도메인별 전문가 에이전트를 병렬로 소환해 리뷰·분석을 수행합니다.

작업 히스토리와 프로젝트 컨텍스트는 SQLite에 누적 저장되어 세션이 바뀌어도 맥락이 유지됩니다.

---

## 요구 사항

- [OpenCode](https://github.com/sst/opencode) 설치 (Bun 런타임 기반)
- Node.js 18 이상 (로컬 개발 시)

---

## 설치

```bash
npm install -g agent-core-plugin
# 또는
pnpm add -g agent-core-plugin
```

---

## OpenCode 설정

OpenCode 설정 파일(`opencode.json`)에 플러그인을 등록합니다.

### 전역 설정 (모든 프로젝트에 적용)

파일 위치: `~/.config/opencode/opencode.json`

```json
{
  "plugins": ["agent-core-plugin"]
}
```

### 프로젝트별 설정

프로젝트 루트에 `opencode.json` 생성:

```json
{
  "plugins": ["agent-core-plugin"]
}
```

### 로컬 개발 중 (npm 배포 전)

```json
{
  "plugins": ["/절대경로/agent-core/dist/index.js"]
}
```

설정 후 OpenCode를 재시작하면 플러그인이 자동 로드됩니다.

---

## 사용 방법

슬래시 커맨드 없이 **자연어로 말하면** 자동으로 스킬이 선택됩니다.

```
로그인 기능 만들어줘          → dev 스킬
버튼 클릭하면 오류 나         → debug 스킬
PR #42 리뷰해줘               → review-pr 스킬
보안 취약점 검토해줘           → audit 스킬
배포해도 돼?                  → release 스킬
```

키워드를 직접 입력해도 됩니다:

```
dev      → 개발 스킬 즉시 실행
review   → 코드 리뷰 스킬 즉시 실행
setup    → 프로젝트 컨텍스트 수집
```

---

## 스킬 목록 (11개)

| 스킬 | 트리거 예시 | 설명 |
|------|------------|------|
| `plan` | "설계해줘", "어떻게 할지" | 요구사항 분석 → 실행 계획 수립 |
| `dev` | "만들어줘", "수정해줘" | 신규 기능 개발 · 기존 코드 수정 |
| `refactor` | "리팩터해줘" | 동작 변경 없는 구조 개선 |
| `debug` | "오류 고쳐줘", "왜 안돼?" | 버그 원인 진단 · 최소 수정 |
| `test` | "테스트 짜줘" | 테스트 전략 수립 · 코드 작성 |
| `review` | "코드 봐줘", "어때?" | 파일/디렉토리 코드 리뷰 |
| `review-pr` | "PR 리뷰해줘" | PR diff 분석 (GitHub · GitLab · Bitbucket) |
| `audit` | "보안 검토해줘" | 보안 취약점 · 성능 감사 |
| `doc` | "문서화해줘" | 설계 문서 · README · API 문서 생성 |
| `release` | "배포해도 돼?" | 배포 전 안전성 검증 게이트 |
| `setup` | "셋업해줘" | 프로젝트 컨텍스트 수집 · DB 저장 |

---

## 전문가 에이전트 (8명)

스킬 실행 중 필요한 도메인의 전문가를 선택하면 병렬로 분석합니다.

| 에이전트 | 담당 영역 |
|---------|---------|
| `backend` | REST API 설계, 비즈니스 로직, N+1, 트랜잭션, 인증/인가 |
| `frontend` | 컴포넌트 설계, 상태관리, 렌더링 성능, 접근성(WCAG 2.1 AA) |
| `qa` | 테스트 전략, 엣지케이스 도출, Mock 전략, 회귀 위험 분석 |
| `security` | OWASP Top 10, XSS/CSRF/SQLi, 인증 취약점, 데이터 보호 |
| `performance` | Core Web Vitals, 캐싱 전략, DB EXPLAIN, 메모리 누수 |
| `dba` | 스키마 정규화, 인덱스 설계, 마이그레이션 안전성, 락 전략 |
| `devops` | CI/CD, Docker/K8s, SLI/SLO, GitOps, 인시던트 대응 |
| `architecture` | SOLID, Clean Architecture, DDD, CQRS, 마이크로서비스 패턴 |

### 전문가 선택 예시 (review 스킬)

```
리뷰해줘

어느 전문가를 투입할까요? (기본값: qa=3)
1.[ ] backend   / API, 비즈니스 로직, 보안
2.[3] qa        / 테스트, 엣지케이스, 회귀 위험
3.[ ] security  / 인증, 취약점, OWASP
...

→ 번호 입력 or 엔터(기본값 적용)
```

---

## 컨텍스트 저장소

작업 히스토리와 프로젝트 컨텍스트는 SQLite에 자동 저장됩니다.

**DB 경로**

| OS | 경로 |
|----|------|
| macOS / Linux | `~/.local/share/agent-core/agent-core.db` |
| Windows | `%APPDATA%\agent-core\agent-core.db` |

**저장 내용**

- `context` — `setup` 스킬 실행 시 수집한 프로젝트 개요
- `history` — 스킬별 작업 완료 기록 (월별)
- `external_files` — 외부 설계 문서 · 스펙 요약

저장된 컨텍스트는 다음 세션에서 자동으로 시스템 프롬프트에 주입됩니다.

---

## review-pr 스킬 — 지원 플랫폼

PR URL 또는 번호를 넘기면 diff를 자동으로 가져옵니다.

| 플랫폼 | 방식 | 사전 설정 |
|--------|------|---------|
| GitHub | `gh` CLI | `gh auth login` |
| GitLab (public) | `glab` CLI | `glab auth login` |
| GitLab (private) | `GITLAB_HOST` + `GITLAB_TOKEN` 환경변수 | `.env` 또는 셸 설정 |
| Bitbucket | `curl` API | `BITBUCKET_USER` + `BITBUCKET_APP_PASSWORD` |

```bash
# GitHub 예시
gh auth login

# GitLab private 예시
export GITLAB_HOST=https://gitlab.mycompany.com
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

---

## 로컬 개발

```bash
# 의존성 설치
pnpm install

# 빌드
pnpm build

# watch 모드 (개발 중)
pnpm dev

# 타입 체크
pnpm typecheck

# 버전 올리기
pnpm release:patch   # 0.1.0 → 0.1.1
pnpm release:minor   # 0.1.0 → 0.2.0
pnpm release:major   # 0.1.0 → 1.0.0
```

---

## 라이선스

MIT
