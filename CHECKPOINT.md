# 재개 체크포인트

갱신: 2026-09-23 KST

## 확정된 목적

- 원격: https://github.com/PhrenO0/09project
- 한국어 일반 독자 대상 iOS·Android 공유 독서 앱. 블랙 테마와 광안리 밤 책방 분위기.
- 합법적 콘텐츠 경로를 먼저 확정하고, 독서방·진도·감상 공유부터 검증한다.
- Astra는 전략·권리·아키텍처 판단, 하위 모델은 경계가 분명한 단순 작업에만 배분한다. 현재 세션에서 별도 에이전트가 자동 활성화된다는 뜻은 아니다.

## 완료된 자료와 코드

- `docs/research/service-references.md`: 기존 서비스 6종 비교.
- `docs/research/opensource-inventory.md`: 모바일·EPUB·백엔드·개발 도구 12개 후보 기술 조사.
- `docs/research/opensource-business-stack.md`: 디자인·UX·기능·운영·사업화 전 분야 GitHub 후보와 도입 우선순위(2026-09-23).
- `docs/PRODUCT.md`, `CONTENT.md`, `DESIGN.md`, `ARCHITECTURE.md`, `PARTNERSHIP.md`, `WORKFLOW.md`, `VALIDATION.md`.
- `apps/mobile`: Expo 기반 로컬 프로토타입. 자체 작성 샘플 글, 독서방 참여, 챕터 진도, 북마크, 감상, 스포일러 제한. 계정/서버/실시간 동기화/상업 EPUB/DRM/결제는 미구현.
- `.github/workflows/verify.yml`, 루트 `npm run verify`/`export`/`checkpoint`, `scripts/reading-state.test.mjs`.

## 작업 상태

- 2026-09-23의 Git 상태와 브랜치는 반드시 `git status --short --branch`로 다시 확인한다. 문서 기준 커밋 `0923f77`이 있으며 모바일 코드와 이 조사 문서는 아직 커밋되지 않았을 수 있다.
- 2026-09-23 `npm run verify` 타입검사·9개 테스트 모두 통과, `npm run export` 웹·iOS·Android JS 번들 생성 성공. 네이티브 설치/실기기 검증은 아직이다.
- 공개 저장소에 비밀키·사용자 데이터·권리 없는 책 원문을 넣지 않는다. `.work/`는 로컬 체크포인트이며 백업이 아니다.

## 다음 단계

1. Git diff와 생성물/라이선스 점검 후 커밋·GitHub 검토 링크 확보.
2. 실제 기기 테스트, 온라인 MVP의 계정/방 권한·동기화, 콘텐츠 계약 범위는 별도 작업.

## 고정된 주의점

- 도서 메타데이터 API는 상업 원문 이용권이 아니다. 현대 도서의 수기 타이핑/OCR도 권리 문제를 해결하지 않는다.
- 고전 원작과 현대 번역의 권리를 따로 확인한다.
- 알라딘 OpenAPI는 2026-10-30 종료 공지가 확인되어 신규 핵심 의존처로 두지 않는다.
- 실시간 공유·전자책 판매는 콘텐츠 권리와 앱마켓 결제 규칙을 함께 검토한다.
