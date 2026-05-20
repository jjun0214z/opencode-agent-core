# /review-pr

PR URL을 받아 전문가 에이전트들이 코드를 리뷰합니다.

## 입력
- `$ARGUMENTS` : `<PR_URL> [에이전트...]`

## 실행 순서

1. `$ARGUMENTS`에서 PR URL과 에이전트 목록 파싱
2. 에이전트 미지정 시 `config.json`의 `default_agents` 사용
3. `orchestrator.md` 지시에 따라 에이전트 순차/병렬 호출
4. 결과를 `logs/YYYY-MM-DD-{PR번호}.md`로 저장
