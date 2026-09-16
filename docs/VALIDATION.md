# 검증 기록

기준일: 2026-09-16. 이 문서는 실행 결과로만 갱신한다.

## 완료

- 공식 템플릿 기반 Expo 57 설치 및 SDK 호환 패키지 설치 완료.
- 복구 스크립트 회귀검사: 4/4 통과 (한글/공백 경로·dirty, unborn, non-git, 반복 실행/체크포인트 보존).
- 프로젝트 `reading-slice` 스킬 형식 검증 통과.

## 진행 중

- 모바일 UI 구현 후 타입검사·로컬 상태 행동·브라우저·3플랫폼 번들 검증.

## 알려진 의존성 이슈

`npm audit` 결과 moderate 10, high/critical 0. 동일 `uuid <11.1.1` advisory의 Expo→config-plugins→xcode 전이 경로가 여러 상위 패키지에 계산된다. npm이 제시한 자동 해결에는 Expo 46으로의 큰 버전 변경이 포함돼 적용하지 않았다. 현재 Expo 57 호환성을 깨뜨리는 `audit fix --force`는 실행하지 않았다. 앱이 이 취약 호출을 사용한다고 확인된 것은 아니며, Xcode 프로젝트 생성 경로를 포함한 영향과 상류 해결 버전을 출시 전에 재검토한다. [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)

## 미검증·미구현

실제 iOS/Android 바이너리 설치·실기기, VoiceOver/TalkBack, 네트워크 다중 사용자, 서버/RLS, 계정·신고/차단, EPUB/DRM, 계약 콘텐츠, 결제, 스토어 심사, 운영 배포. 웹 또는 bundle export 통과로 이를 통과했다고 표시하지 않는다.
