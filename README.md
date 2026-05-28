# agent-core-plugin

<p>
  <a href="https://www.npmjs.com/package/agent-core-plugin"><img src="https://img.shields.io/npm/v/agent-core-plugin?style=flat-square&color=blue" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/agent-core-plugin"><img src="https://img.shields.io/npm/dm/agent-core-plugin?style=flat-square" alt="npm downloads"></a>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license">
  <img src="https://img.shields.io/badge/OpenCode-plugin-purple?style=flat-square" alt="opencode plugin">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square" alt="node">
</p>

**[OpenCode](https://github.com/sst/opencode) 플러그인** — 자연어 한 마디로 11개 스킬을 실행하고, 8명의 전문가 에이전트가 병렬로 분석합니다.  
작업 히스토리·컨텍스트는 SQLite에 누적되어 세션이 끊겨도 맥락이 이어집니다.

---

## 개요

`agent-core-plugin`은 [OpenCode](https://github.com/sst/opencode) 위에서 동작하는 플러그인입니다.  
별도의 슬래시 커맨드 없이 **자연어만으로** 작업 의도를 감지하여 적합한 스킬을 실행하고,  
필요 시 도메인별 전문가 에이전트를 병렬로 소환해 리뷰·분석을 수행합니다.

작업 히스토리와 프로젝트 컨텍스트는 SQLite에 누적 저장되어 세션이 바뀌어도 맥락이 유지됩니다.

---

## 시작하기

### 1. OpenCode 설치

```bash
# macOS / Linux
curl -fsSL https://opencode.ai/install | bash

# npm
npm install -g opencode-ai

# 설치 확인
opencode --version
```

> OpenCode는 Bun 런타임 기반입니다. 자세한 내용은 [공식 문서](https://opencode.ai/docs)를 참고하세요.

### 2. 플러그인 설치

```bash
npm install -g agent-core-plugin
```

### 3. OpenCode에 등록

`~/.config/opencode/opencode.json` (전역) 또는 프로젝트 루트 `opencode.json`:

```json
{
  "plugins": ["agent-core-plugin"]
}
```

OpenCode 재시작 후 즉시 사용 가능합니다.

---

## 사용 방법

자연어로 말하거나, 스킬명을 직접 입력하면 됩니다.

```
로그인 기능 만들어줘     →  /dev
버튼 클릭하면 오류 나    →  /debug
PR #42 리뷰해줘          →  /review-pr
보안 취약점 검토해줘      →  /audit
배포해도 돼?             →  /release
```

### 의도 분류 규칙

오케스트레이터는 모든 메시지를 아래 순서로 처리합니다.

1. **자연어 매핑** — 메시지에서 의도를 감지해 해당 스킬 즉시 실행
2. **스킬 이어받기** — 직전 스킬의 질문에 대한 답변이면 해당 스킬 절차 계속
3. **짧은 되묻기** — 진행 중인 작업이 있고 의도가 모호할 때
4. **스킬 목록 출력** — "스킬 뭐 있어", "어떤 작업 할 수 있어" 등 명시적으로 요청할 때만
5. **자연스러운 응답** — 피드백·메타 질문·잡담 등 나머지 모든 경우

---

## 스킬 목록

| 커맨드 | 설명 |
|--------|------|
| `/plan` | 요구사항 분석 → 단계별 실행 계획 수립 |
| `/dev` | 신규 기능 개발 및 기존 코드 수정 |
| `/refactor` | 동작 변경 없는 구조 개선 |
| `/debug` | 버그 원인 진단 및 최소 범위 수정 |
| `/test` | 테스트 전략 수립 및 코드 작성 |
| `/review` | 파일·디렉토리 단위 코드 리뷰 |
| `/review-pr` | PR diff 분석 (GitHub · GitLab · Bitbucket) |
| `/audit` | 보안 취약점 · 성능 전체 감사 |
| `/doc` | 설계 문서 · README · API 문서 생성 |
| `/release` | 배포 전 안전성 검증 게이트 |
| `/setup` | 프로젝트 컨텍스트 수집 및 DB 저장 |

---

## 전문가 에이전트

스킬 실행 중 도메인별 전문가를 선택하면 병렬로 분석합니다.

| 에이전트 | 담당 영역 |
|---------|---------|
| `backend` | REST API 설계, 비즈니스 로직, N+1, 트랜잭션, 인증/인가 |
| `frontend` | 컴포넌트 설계, 상태관리, 렌더링 성능, 접근성 (WCAG 2.1 AA) |
| `qa` | 테스트 전략, 엣지케이스 도출, Mock 전략, 회귀 위험 분석 |
| `security` | OWASP Top 10, XSS/CSRF/SQLi, 인증 취약점, 데이터 보호 |
| `performance` | Core Web Vitals, 캐싱 전략, DB EXPLAIN 분석, 메모리 누수 |
| `dba` | 스키마 정규화, 인덱스 설계, 마이그레이션 안전성, 락 전략 |
| `devops` | CI/CD, Docker/K8s, SLI/SLO, GitOps, 인시던트 대응 |
| `architecture` | SOLID, Clean Architecture, DDD, CQRS, 마이크로서비스 |

**실행 예시 (`/review`)**

```
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
```

---

## 컨텍스트 저장소

작업 히스토리와 프로젝트 컨텍스트를 SQLite에 자동 저장합니다.  
저장된 내용은 다음 세션 시작 시 시스템 프롬프트에 자동 주입됩니다.

| 항목 | 내용 |
|------|------|
| `context` | `/setup` 실행 시 수집한 프로젝트 개요 |
| `history` | 스킬별 작업 완료 기록 (월별 누적) |
| `external_files` | 외부 설계 문서 · 스펙 요약 |

**DB 경로**

| OS | 경로 |
|----|------|
| macOS / Linux | `~/.local/share/agent-core/agent-core.db` |
| Windows | `%APPDATA%\agent-core\agent-core.db` |

---

## `/review-pr` 지원 플랫폼

| 플랫폼 | 인증 방식 | 사전 설정 |
|--------|---------|---------|
| GitHub | `gh` CLI | `gh auth login` |
| GitLab (public) | `glab` CLI | `glab auth login` |
| GitLab (private) | 환경변수 | `GITLAB_HOST` + `GITLAB_TOKEN` |
| Bitbucket | 환경변수 | `BITBUCKET_USER` + `BITBUCKET_APP_PASSWORD` |

```bash
# GitLab private 환경변수 설정 예시
export GITLAB_HOST=https://gitlab.mycompany.com
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

---

## 라이선스

MIT
