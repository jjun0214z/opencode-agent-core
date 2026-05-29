# agent-core-plugin

<p>
  <a href="https://www.npmjs.com/package/agent-core-plugin"><img src="https://img.shields.io/npm/v/agent-core-plugin?style=flat-square&color=blue" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/agent-core-plugin"><img src="https://img.shields.io/npm/dm/agent-core-plugin?style=flat-square" alt="npm downloads"></a>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license">
  <img src="https://img.shields.io/badge/OpenCode-plugin-purple?style=flat-square" alt="opencode plugin">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square" alt="node">
</p>

**[OpenCode](https://github.com/sst/opencode) 플러그인** — `orchestrator` 에이전트가 의도를 분류하고 7개 스킬을 Phase Gate로 실행합니다.  
9명의 전문가 에이전트가 병렬로 구현·분석하며, 작업 히스토리와 컨텍스트는 SQLite에 누적됩니다.

---

## 🗂️ 개요

`agent-core-plugin`은 [OpenCode](https://github.com/sst/opencode) 위에서 동작하는 플러그인입니다.

플러그인을 등록하면 **`orchestrator`** 라는 primary 에이전트와 **9개의 전문가 서브에이전트**가 자동으로 등록됩니다.  
`/core-*` 슬래시 커맨드 또는 자연어로 작업을 요청하면, orchestrator가 의도를 분류해 적합한 스킬을 Phase Gate 규칙에 따라 실행합니다.

작업 히스토리·프로젝트 컨텍스트·문서 템플릿은 SQLite에 저장되어 세션이 바뀌어도 맥락이 유지됩니다.

---

## ⚡ 시작하기

### 1. OpenCode 설치

```bash
# macOS / Linux
curl -fsSL https://opencode.ai/install | bash

# 설치 확인
opencode --version
```

> OpenCode는 Bun 런타임 기반입니다. 자세한 내용은 [공식 문서](https://opencode.ai/docs)를 참고하세요.

### 2. OpenCode에 플러그인 등록

`~/.config/opencode/opencode.json` (전역) 또는 프로젝트 루트 `opencode.json`:

```json
{
  "plugins": ["agent-core-plugin"]
}
```

> OpenCode가 플러그인을 자동으로 설치합니다. 별도 `npm install` 불필요.

OpenCode 재시작 후 즉시 사용 가능합니다.

---

## 🤝 OMO 공존 설정

`oh-my-openagent`와 함께 사용할 때는 에이전트 역할을 분리해서 운영하는 것을 권장합니다.

| 에이전트 | 역할 |
|---------|------|
| **orchestrator** (agent-core) | 스킬 라우팅 · Phase Gate 하네스 적용 |
| **Sisyphus** 등 (OMO) | OMO 워크플로우 전용 |
| OpenCode 기본 에이전트 | 기본 동작 유지 |

```json
{
  "plugins": [
    "agent-core-plugin",
    "oh-my-openagent",
    "@ex-machina/opencode-anthropic-auth",
    "cursor-oauth-opencode"
  ]
}
```

| 플러그인 | 설명 |
|---------|------|
| `agent-core-plugin` | 이 플러그인 |
| `oh-my-openagent` | OMO 워크플로우 에이전트 |
| `@ex-machina/opencode-anthropic-auth` | Anthropic 계정 인증 |
| `cursor-oauth-opencode` | Cursor OAuth 연동 |

> 하나의 작업에서는 에이전트를 자주 전환하지 않는 것이 안정적입니다.

---

## 🧠 에이전트 구조

### Orchestrator (primary)

`@orchestrator` 로 직접 지정하거나, `/core-*` 커맨드 실행 시 자동으로 활성화됩니다.

**역할:**
- 모든 메시지를 7개 스킬 중 하나로 분류
- 각 스킬을 Phase Gate 규칙에 따라 단계적으로 실행
- 전문가 에이전트를 병렬 spawn해 실제 작업 위임

**하네스 규칙 (Hard Blocks):**
- 스킬 없이 진행 금지 — 모든 요청은 반드시 스킬로 분류 후 처리
- Phase 순서 위반 금지 — `✅ Phase N 완료` 마커 없이 다음 Phase 진입 불가
- 직접 구현 금지 — trivial(단일 파일, 5줄 이하) 외에는 반드시 전문가에게 위임
- 병렬 강제 — 복수 전문가는 순차 실행 금지, 항상 동시 spawn
- `git commit·push` 절대 금지
- `.env`, `secrets.*` 읽기·쓰기 금지

**의도 분류 순서:**

```
1. 자연어 매핑   → 스킬 감지 즉시 실행
2. 스킬 이어받기 → 직전 질문의 답변이면 해당 스킬 계속
3. 짧은 되묻기   → 진행 중인 작업이 있고 의도 모호할 때
4. 일반 응답     → 피드백·메타 질문 등 나머지 경우
```

### Expert Subagents

orchestrator가 스킬 실행 중 `agent(name: "...")` 툴로 spawn하는 전문가 서브에이전트입니다.  
각 에이전트는 도메인 특화 시스템 프롬프트를 가지며, **복수 선택 시 항상 병렬로 실행**됩니다.

| 에이전트 | 담당 영역 |
|---------|---------|
| 🔧 `backend` | REST/GraphQL API, 비즈니스 로직, 트랜잭션, 인증·인가 |
| 🎨 `frontend` | 컴포넌트 설계, 상태관리, 렌더링 성능, 접근성 (WCAG 2.1 AA) |
| 📱 `mobile` | iOS(Swift), Android(Kotlin), React Native, Flutter — 생명주기·권한·오프라인·스토어 가이드라인 |
| 🧪 `qa` | 테스트 전략, 엣지케이스 도출, 회귀 위험 분석 |
| 🔒 `security` | OWASP Top 10, XSS/CSRF/SQLi, 모바일 보안, 시크릿 관리 |
| ⚡ `performance` | 렌더링 최적화, N+1, 쿼리 튜닝, 번들 사이즈 |
| 🗄️ `dba` | 스키마 정규화, 인덱스 설계, 마이그레이션 안전성 |
| 🚀 `devops` | CI/CD, Docker/K8s, GitHub Actions, 인프라 as Code |
| 🏛️ `architecture` | 레이어 분리, SOLID, DDD, 모듈 경계, 의존성 |

---

## 📋 스킬 목록

| 커맨드 | 설명 |
|--------|------|
| `/core-dev` | 신규 기능 개발 및 기존 코드 수정 |
| `/core-debug` | 버그 원인 진단 및 최소 범위 수정 |
| `/core-test` | 테스트 전략 수립 및 코드 작성 |
| `/core-review` | 코드 검토 또는 PR diff 분석 (GitHub · GitLab · Bitbucket) |
| `/core-audit` | 보안 취약점 · 성능 전체 감사 |
| `/core-doc` | 설계 문서 · API 명세 · README 생성 |
| `/core-setup` | 프로젝트 컨텍스트 수집 · 외부파일 등록 · 문서 템플릿 설정 |

```
/core-dev   로그인 기능 만들어줘
/core-debug 버튼 클릭하면 오류 나
/core-test  인증 모듈 테스트 짜줘
/core-review PR #42 리뷰해줘
/core-audit 보안 취약점 검토해줘
/core-doc   API 명세 문서화해줘
/core-setup 프로젝트 컨텍스트 저장해줘
```

> 커맨드 없이 자연어만 입력해도 orchestrator가 의도를 감지해 라우팅합니다.

---

## 🔄 Phase Gate 파이프라인

모든 스킬은 Phase Gate 구조로 실행됩니다.

- **순서 보장** — `✅ Phase N 완료` 마커 출력 후 다음 Phase 진입
- **유저 입력 게이트** — 입력이 필요한 Phase에서는 응답 전까지 진행 금지
- **병렬 spawn 강제** — 전문가는 반드시 `agent` 툴로 동시 실행

**`/core-dev` 실행 흐름:**

```
Phase 0: Scope Check      — Small(직접 실행) / Medium / Large 분류
Phase 1: Read Before Write — 대상 파일 전체 읽기, 패턴·컨벤션 파악
Phase 2: Expert 선택      — 번호 입력 대기 [유저 입력 게이트]
Phase 3: Spawn Experts    — 선택된 expert 병렬 구현
Phase 4: Verify           — 타입 체크, 변경 범위 확인
          └─ agent_context_write(type="history") → 완료 리포트
```

**전문가 선택 화면 예시 (`/core-review`):**

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

## 💾 컨텍스트 저장소

저장된 내용은 다음 세션 시작 시 시스템 프롬프트에 **자동 주입**됩니다.

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
1 — 프로젝트 기준   : git 히스토리, 파일 구조, 스택 자동 수집
2 — 외부파일 기준   : 설계 문서, 스펙, PDF 등 경로 입력 → 요약 저장
3 — 문서 템플릿 설정 : 제목 형식, 섹션 순서, 출력 형식, 다이어그램 스타일 등록
```

> 템플릿을 등록해두면 `/core-doc` 실행 시 목록에서 선택해 해당 구조로 문서를 자동 생성합니다.

---

## 🔍 PR diff 리뷰 지원 플랫폼

`/core-review` → **유형 2 (PR diff 리뷰)** 선택 시 지원합니다.

| 플랫폼 | 인증 방식 | 사전 설정 |
|--------|---------|---------|
| GitHub | `gh` CLI | `gh auth login` |
| GitLab (public) | `glab` CLI | `glab auth login` |
| GitLab (private) | 환경변수 | `GITLAB_HOST` + `GITLAB_TOKEN` |
| Bitbucket | 환경변수 | `BITBUCKET_USERNAME` + `BITBUCKET_TOKEN` |

```bash
export GITLAB_HOST=https://gitlab.mycompany.com
export GITLAB_TOKEN=glpat-xxxxxxxxxxxx
```

---

## 📄 라이선스

MIT
