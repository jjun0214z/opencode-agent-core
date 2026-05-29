# agent-core-plugin

<p>
  <a href="https://www.npmjs.com/package/agent-core-plugin"><img src="https://img.shields.io/npm/v/agent-core-plugin?style=flat-square&color=blue" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/agent-core-plugin"><img src="https://img.shields.io/npm/dm/agent-core-plugin?style=flat-square" alt="npm downloads"></a>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license">
  <img src="https://img.shields.io/badge/OpenCode-plugin-purple?style=flat-square" alt="opencode plugin">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square" alt="node">
</p>

**[OpenCode](https://github.com/sst/opencode) 플러그인** — 자연어 한 마디로 7개 스킬을 실행하고, 9명의 전문가 에이전트가 병렬로 분석합니다.  
작업 히스토리·컨텍스트는 SQLite에 누적되어 세션이 끊겨도 맥락이 이어집니다.

---

## 개요

`agent-core-plugin`은 [OpenCode](https://github.com/sst/opencode) 위에서 동작하는 플러그인입니다.  
`/core-*` 슬래시 커맨드 또는 **자연어만으로** 작업 의도를 감지하여 적합한 스킬을 실행하고,  
필요 시 도메인별 전문가 에이전트를 병렬로 소환해 구현·리뷰·분석을 수행합니다.

모든 스킬은 **Phase Gate** 구조로 실행됩니다. 각 Phase는 순서대로 실행되고, 유저 입력이 필요한 단계에서는 반드시 응답을 받은 뒤 다음 Phase로 넘어갑니다. 전문가 에이전트는 항상 병렬로 spawn됩니다.

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

## OMO 공존 설정

`oh-my-openagent`와 함께 사용할 때는 에이전트 역할을 분리해서 운영하는 것을 권장합니다.

- `orchestrator` (`agent-core-plugin`) — 스킬 라우팅 / Phase Gate 하네스 적용
- OMO 에이전트 (`Sisyphus - ultraworker` 등) — OMO 워크플로우 전용
- OpenCode 기본 에이전트 — 기본 동작 유지

예시 (`~/.config/opencode/opencode.json`):

```json
{
  "plugin": [
    "/Users/min/Documents/min/agent/agent-core/dist",
    "oh-my-openagent",
    "@ex-machina/opencode-anthropic-auth",
    "cursor-oauth-opencode"
  ]
}
```

운영 팁:

- agent-core 규칙이 필요할 때: `orchestrator` 에이전트 선택
- OMO 모드가 필요할 때: OMO 에이전트 선택 (`Sisyphus - ultraworker` 등)
- 하나의 작업에서는 에이전트를 자주 전환하지 않는 것이 안정적입니다.

---

## 사용 방법

슬래시 커맨드 또는 자연어로 입력합니다.

```
/core-dev   로그인 기능 만들어줘
/core-debug 버튼 클릭하면 오류 나
/core-test  인증 모듈 테스트 짜줘
/core-review PR #42 리뷰해줘
/core-audit 보안 취약점 검토해줘
/core-doc   API 명세 문서화해줘
/core-setup 프로젝트 컨텍스트 저장해줘
```

커맨드 없이 자연어만 입력해도 오케스트레이터가 의도를 감지해 해당 스킬로 라우팅합니다.

### 의도 분류 규칙

오케스트레이터는 모든 메시지를 아래 순서로 처리합니다.

1. **자연어 매핑** — 메시지에서 의도를 감지해 해당 스킬 즉시 실행
2. **스킬 이어받기** — 직전 스킬의 질문에 대한 답변이면 해당 스킬 절차 계속
3. **짧은 되묻기** — 진행 중인 작업이 있고 의도가 모호할 때
4. **자연스러운 응답** — 피드백·메타 질문 등 나머지 경우

---

## 스킬 목록

| 커맨드 | 설명 |
|--------|------|
| `/core-dev` | 신규 기능 개발 및 기존 코드 수정 |
| `/core-debug` | 버그 원인 진단 및 최소 범위 수정 |
| `/core-test` | 테스트 전략 수립 및 코드 작성 |
| `/core-review` | 코드 검토 또는 PR diff 분석 (GitHub · GitLab · Bitbucket) |
| `/core-audit` | 보안 취약점 · 성능 전체 감사 |
| `/core-doc` | 설계 문서 · API 명세 · README 생성 |
| `/core-setup` | 프로젝트 컨텍스트 수집 · 외부파일 등록 · 문서 템플릿 설정 |

---

## Phase Gate 파이프라인

모든 스킬은 아래 규칙으로 실행됩니다.

- 각 Phase는 `✅ Phase N 완료` 마커를 출력한 뒤 다음 Phase로 진입
- 유저 입력이 필요한 Phase에서는 응답 전까지 다음 Phase 진입 금지
- 전문가 spawn은 반드시 `agent` 툴로 병렬 실행 (오케스트레이터 직접 구현 금지)

**`/core-dev` 실행 예시**

```
Phase 0: Scope Check     — Small / Medium / Large 분류
Phase 1: Read Before Write — 대상 파일 전체 읽기, 패턴 파악
Phase 2: Expert 선택     — 번호 입력 후 대기 (유저 입력 게이트)
Phase 3: Spawn Experts   — 선택된 expert 병렬 구현
Phase 4: Verify          — 타입 체크, 범위 초과 확인
```

---

## 전문가 에이전트

스킬 실행 중 도메인별 전문가를 선택하면 병렬로 분석·구현합니다.

| 에이전트 | 담당 영역 |
|---------|---------|
| `backend` | REST/GraphQL API, 비즈니스 로직, 트랜잭션, 인증·인가 |
| `frontend` | 컴포넌트 설계, 상태관리, 렌더링 성능, 접근성 (WCAG 2.1 AA) |
| `mobile` | iOS(Swift), Android(Kotlin), React Native, Flutter — 생명주기, 권한, 오프라인, 스토어 가이드라인 |
| `qa` | 테스트 전략, 엣지케이스 도출, 회귀 위험 분석 |
| `security` | OWASP Top 10, XSS/CSRF/SQLi, 모바일 보안, 시크릿 관리 |
| `performance` | 렌더링 최적화, N+1, 쿼리 튜닝, 번들 사이즈 |
| `dba` | 스키마 정규화, 인덱스 설계, 마이그레이션 안전성 |
| `devops` | CI/CD, Docker/K8s, GitHub Actions, 인프라 as Code |
| `architecture` | 레이어 분리, SOLID, DDD, 모듈 경계, 의존성 |

**실행 예시 (`/core-review`)**

```
리뷰할 전문가를 선택하세요 (번호 입력, 기본값: 4):

1. [ ] backend      — API, 비즈니스 로직
2. [ ] frontend     — UI, 컴포넌트, 상태관리
3. [ ] mobile       — iOS, Android, React Native, Flutter
4. [✓] qa           — 테스트, 엣지케이스
5. [ ] security     — 인증, 취약점
6. [ ] performance  — N+1, 쿼리, 번들
7. [ ] dba          — 스키마, 마이그레이션, 쿼리 튜닝
8. [ ] devops       — CI/CD, 컨테이너, 배포
9. [ ] architecture — 모듈 경계, 의존성, 확장성

입력 예시: 1,3,4 또는 all
```

---

## 컨텍스트 저장소

작업 히스토리와 프로젝트 컨텍스트를 SQLite에 자동 저장합니다.  
저장된 내용은 다음 세션 시작 시 시스템 프롬프트에 자동 주입됩니다.

| 테이블 | 내용 | 저장 방식 |
|--------|------|-----------|
| `context` | 프로젝트 개요, 스택, git 히스토리 | 프로젝트당 1행, upsert |
| `external_files` | 외부 설계 문서 · 스펙 요약 | slug 기반, upsert |
| `templates` | `/core-doc` 실행 시 적용할 문서 템플릿 | slug 기반, upsert |
| `history` | 스킬별 작업 완료 기록 | 월별 누적, append |

**DB 경로**

| OS | 경로 |
|----|------|
| macOS / Linux | `~/.local/share/agent-core/agent-core.db` |
| Windows | `%APPDATA%\agent-core\agent-core.db` |

### `/core-setup` 수집 모드

```
1 — 프로젝트 기준  : git 히스토리, 파일 구조, 스택 자동 수집
2 — 외부파일 기준  : 설계 문서, 스펙, PDF 등 경로 입력 → 요약 저장
3 — 문서 템플릿 설정: 제목 형식, 섹션 순서, 출력 형식, 다이어그램 스타일 등록
```

템플릿을 등록해두면 `/core-doc` 실행 시 목록에서 선택해 해당 구조로 문서를 자동 생성합니다.

---

## PR diff 리뷰 지원 플랫폼

`/core-review` → 유형 2(PR diff 리뷰) 선택 시 아래 플랫폼을 지원합니다.

| 플랫폼 | 인증 방식 | 사전 설정 |
|--------|---------|---------|
| GitHub | `gh` CLI | `gh auth login` |
| GitLab (public) | `glab` CLI | `glab auth login` |
| GitLab (private) | 환경변수 | `GITLAB_HOST` + `GITLAB_TOKEN` |
| Bitbucket | 환경변수 | `BITBUCKET_USERNAME` + `BITBUCKET_TOKEN` |

```bash
# GitLab private 환경변수 설정 예시
export GITLAB_HOST=https://gitlab.mycompany.com
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

---

## 라이선스

MIT
