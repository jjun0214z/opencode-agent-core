# PR Review Agent

PR 코드 리뷰 전용 하네스입니다.

## 역할
- GitHub MCP를 통해 PR diff를 가져와 전문가 에이전트들이 코드를 검토합니다.
- 오케스트레이터가 에이전트를 조율하고 결과를 종합해 리포트를 생성합니다.

## 사용법

```
/review-pr <PR_URL>
/review-pr <PR_URL> [에이전트1] [에이전트2] ...
```

### 예시
```
/review-pr https://github.com/owner/repo/pull/123
/review-pr https://github.com/owner/repo/pull/123 백엔드 프론트 QA
```

## 에이전트 목록
| 키 | 역할 |
|----|------|
| `frontend` | 프론트엔드 전문가 |
| `backend` | 백엔드 전문가 |
| `qa` | QA 전문가 |
| `security` | 보안 전문가 |
| `performance` | 성능 전문가 |

## 기본값
`config.json`의 `default_agents` 참고 (기본: frontend, qa)

## 결과
`logs/` 폴더에 리뷰 결과가 날짜별로 저장됩니다.
