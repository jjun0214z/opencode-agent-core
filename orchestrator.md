# Orchestrator

## 역할
에이전트를 선택하고 조율해 최종 리뷰 리포트를 생성합니다.

## 실행 순서

### 1. PR 정보 수집 (GitHub MCP)
- PR diff, 변경 파일 목록, 제목, 설명, 커밋 목록 가져오기
- 플랫폼 판별: `github.com` → GitHub MCP / `gitlab.com` → GitLab MCP

### 2. 에이전트 선택
- 명령어에 에이전트 명시 → 해당 에이전트 사용
- 미명시 → `config.json`의 `default_agents` 사용

### 3. 에이전트 호출
- 선택된 에이전트들을 병렬로 호출
- 각 에이전트에게 전달: PR diff, 파일 목록, PR 메타정보

### 4. 결과 종합
- 각 에이전트 결과 수집
- 심각도별 정렬: Critical → Warning → Info
- 최종 리포트 생성

### 5. 저장
- `logs/YYYY-MM-DD-{PR번호}.md` 로 저장

## 리포트 포맷
```
# PR Review Report
- PR: {URL}
- 날짜: {날짜}
- 투입 에이전트: {목록}

## 종합 의견

## Critical
## Warning  
## Info
```
