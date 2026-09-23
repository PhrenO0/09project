# 공유 독서 앱: GitHub 오픈소스 전체 스택 조사

확인일: 2026-09-23. 대상: 한국어 일반 독자용 iOS·Android 앱. 아래 표는 **후보 조사**이며 설치·기능 구현·상용 서비스 계약을 뜻하지 않는다. 저장소의 공개 소스와 호스팅 서비스의 요금/약관, 전자책 원문 이용권은 각각 다른 문제다. 버전과 라이선스는 실제 도입할 태그에서 다시 확인한다.

## 제품에 맞는 기본 조합

- **지금:** [Expo](https://github.com/expo/expo) + React Native, 현재 자체 블랙 테마, [Penpot](https://github.com/penpot/penpot) 디자인 원본, 자체 집필 샘플로 독서방·진도·감상 흐름 검증.
- **온라인 MVP:** [Supabase](https://github.com/supabase/supabase) Auth/Postgres/Realtime와 RLS 권한 테스트. 필요 시 [TanStack Query](https://github.com/TanStack/query)로 원격 상태 캐시. [Sentry React Native SDK](https://github.com/getsentry/sentry-react-native)로 장애 파악.
- **EPUB 파일을 실제 제공할 때:** [epubjs-react-native](https://github.com/victorsoares96/epubjs-react-native)와 [Readium Swift](https://github.com/readium/swift-toolkit)/[Kotlin](https://github.com/readium/kotlin-toolkit)을 같은 한국어 EPUB으로 비교. 파일 제공권·대여권·DRM 요건이 먼저 확정되어야 한다.
- **출시 후:** 개인정보 동의와 이벤트 정의 후 [PostHog React Native SDK](https://github.com/PostHog/posthog-js/tree/main/packages/react-native) 같은 분석 도구, 고객 문의가 생기면 [Chatwoot](https://github.com/chatwoot/chatwoot). 결제는 수익 모델·앱마켓 정책을 확정한 뒤 [OpenIAP](https://github.com/hyodotdev/openiap) 검토.

UI 키트 여러 개, 상태 관리 라이브러리 여러 개, 분석 플랫폼 여러 개를 동시에 도입하지 않는다. 현재 프로토타입의 작은 상태 모델에는 Zustand도 필요하지 않다.

## 완성형 독서 서비스에서 배울 점

- [Kavita](https://github.com/Kareadita/Kavita)(GPL-3.0)는 EPUB/PDF/코믹스 라이브러리, 읽기 상태, 주석, 개인 서버 운영의 정보 구조를 참고하기 좋다. 유료 `Kavita+` 기능은 별도이며, GPL 코드를 상용 앱에 섞어 가져오는 일은 라이선스 검토 없이는 하지 않는다. 우리 제품의 중심은 개인 서버가 아니라 소규모 독서방이다.
- [BookWyrm](https://github.com/bookwyrm-social/bookwyrm)은 독서 기록·리뷰·공개 범위·커뮤니티 운영의 UX 참고 자료다. 다만 [현재 라이선스](https://github.com/bookwyrm-social/bookwyrm/blob/main/LICENSE.md)는 Anti-Capitalist Software License 1.4로 상업 조직 사용에 제한이 있으며 일반적인 오픈소스 라이선스가 아니다. 저장소는 AI 생성 기여도 받지 않는다고 명시한다. **아이디어 조사만 하고 코드·디자인 자산은 복사하지 않는다.**
- [Standard Ebooks 도구](https://github.com/standardebooks/tools)는 퍼블릭 도메인 영어책의 교정·EPUB 제작 절차를 배우는 자료다. 도구의 공개 라이선스와 개별 책 파일의 권리·한국 내 원문/번역 권리는 별도 확인한다.

## 분야별 후보와 판단

`즉시`는 현 제품에 바로 유용, `조건부`는 해당 요구가 확인되면 평가, `보류`는 현재 과잉 구축 가능성이 크다는 뜻이다.

| 분야 | GitHub 원본 | 라이선스/범위 | 우리 앱에서 얻는 것 | 판단 |
|---|---|---|---|---|
| 디자인 협업 | [Penpot](https://github.com/penpot/penpot) | MPL-2.0, 앱 디자인 도구 | 화면 흐름, 컴포넌트, 토큰, 개발 전달 | 즉시. [공개 템플릿 파일](https://github.com/penpot/penpot-files)은 별도 CC BY 4.0이므로 템플릿별 표시 확인 |
| 앱 기반 | [Expo](https://github.com/expo/expo), [React Native](https://github.com/facebook/react-native) | MIT | iOS·Android 공통 앱, 빌드·네이티브 확장 | 즉시, 이미 프로토타입에 사용 |
| UI 부품 | [React Native Reusables](https://github.com/founded-labs/react-native-reusables) | MIT | 버튼·입력·시트·대화상자 소스를 가져와 브랜드에 맞게 수정 | 조건부. 필요한 것만 복사하고 출처/원본 커밋 기록 |
| UI 대안 | [Tamagui](https://github.com/tamagui/tamagui), [React Native Paper](https://github.com/callstack/react-native-paper) | 각각 MIT | 전자는 크로스 플랫폼 토큰/스타일, 후자는 Material 컴포넌트 | 보류. 현재 디자인에 키트 전체 적용은 브랜드 일관성·의존성 비용 증가 |
| 아이콘 | [Lucide](https://github.com/lucide-icons/lucide) | ISC; 일부 Feather 파생 아이콘은 MIT 고지 | 간결한 선형 아이콘 | 조건부. 앱 포함 시 라이선스 고지 보존 |
| UI 카탈로그 | [Storybook React Native](https://github.com/storybookjs/react-native) | MIT | 컴포넌트별 상태·접근성 확인 | 조건부. 재사용 부품이 늘어날 때 |
| 화면 이동 | [Expo Router](https://github.com/expo/expo/tree/main/packages/expo-router) | Expo 저장소 MIT | 화면 경로, 딥링크 | 조건부. 현재 단일 프로토타입을 확장할 때 |
| 서버 상태 | [TanStack Query](https://github.com/TanStack/query) | MIT | 독서방/감상 요청 캐시와 재조회 | 조건부. 서버 연결 시 |
| 앱 상태 | [Zustand](https://github.com/pmndrs/zustand) | MIT | 복잡해진 클라이언트 전역 상태 | 보류. 현 단계에서는 직접 상태로 충분 |
| 빠른 EPUB | [epubjs-react-native](https://github.com/victorsoares96/epubjs-react-native), [epub.js](https://github.com/futurepress/epub.js) | 래퍼 MIT, 엔진 BSD-2-Clause | WebView 기반 읽기, 목차, 위치, 주석 | 조건부. Expo 호환성·큰 EPUB·한국어 조판·접근성 실기기 시험 |
| 장기 EPUB | [Readium Swift](https://github.com/readium/swift-toolkit), [Readium Kotlin](https://github.com/readium/kotlin-toolkit) | BSD-3-Clause | 네이티브 EPUB/PDF/오디오, 위치·탐색·접근성 | 조건부. RN 브리지 두 개와 개발 빌드 비용 포함 |
| DRM 서버 | [Readium LCP Server](https://github.com/readium/readium-lcp-server) | BSD-3-Clause 서버 코드 | 계약 콘텐츠 보호 인프라의 일부 | 보류. 프로덕션 클라이언트 LCP 구성·인증·EDRLab 계약은 별도 |
| 백엔드 | [Supabase](https://github.com/supabase/supabase), [supabase-js](https://github.com/supabase/supabase-js) | 플랫폼 Apache-2.0, JS SDK MIT | 계정, 데이터베이스, 방 멤버십, 실시간 이벤트 | 온라인 MVP 1순위. 테이블·채널 RLS 테스트 필수 |
| 편집 CMS | [Payload](https://github.com/payloadcms/payload) | MIT | 자체 집필/계약 작품의 원고·판본·게시 승인 | 조건부. 작품·편집자가 늘어나기 전엔 간단한 관리 UI로 충분 |
| 공개 책 메타데이터 | [Open Library](https://github.com/internetarchive/openlibrary) | 서버 코드 AGPL-3.0; 데이터/API 사용 조건 별도 | 보조 서지·표지 탐색 후보 | 조건부. 한국어 ISBN 품질·API 정책 확인. 원문 권한과 무관 |
| 제품 분석 SDK | [PostHog JS/RN](https://github.com/PostHog/posthog-js/tree/main/packages/react-native) | SDK MIT | 활성 독자·첫 독서방 참여·주간 완독 전환 측정 | 조건부. 동의/보존기간/이벤트 최소화 후; 호스팅 요금 별도 |
| 오류 관찰 SDK | [Sentry React Native](https://github.com/getsentry/sentry-react-native) | SDK MIT | iOS·Android 크래시, 리더 오류 추적 | 온라인 베타 때. 호스팅 서비스 조건 별도 |
| 기능 실험 | [GrowthBook](https://github.com/growthbook/growthbook) | 핵심 MIT, enterprise 경로는 상용 | 온보딩/북클럽 알림 A/B 실험 | 보류. 유효한 사용자 수와 실험 계획이 생기면 |
| 사용자 설문 | [Formbricks](https://github.com/formbricks/formbricks) | 핵심 AGPL-3.0, enterprise는 별도 | 가입·첫 책 선택 이탈 이유 설문 | 조건부. 수정/호스팅·배포 방식에 따른 AGPL 의무 검토 |
| 고객 지원 | [Chatwoot](https://github.com/chatwoot/chatwoot) | 핵심 MIT, `enterprise/` 별도 | 저작권 신고·계정/환불 문의 접수 | 조건부. 운영 담당·응답 정책이 생길 때 |
| 내부 지표 | [Metabase](https://github.com/metabase/metabase) | 핵심 AGPL, enterprise 상용 | 코호트·독서방 유지율 대시보드 | 보류. 첫 단계는 SQL/간단한 보고로 충분 |
| 앱 내 결제 | [OpenIAP 모노레포](https://github.com/hyodotdev/openiap) | 공개 SDK MIT, 호스팅 서비스 별도 | iOS/Android 구매 및 영수증 처리 공통 규약 | 조건부. 현재 [옛 react-native-iap 저장소](https://github.com/hyochan/react-native-iap)는 새 모노레포로 이동을 알림 |
| 개발 규율 | [GitHub Spec Kit](https://github.com/github/spec-kit), [Superpowers](https://github.com/obra/superpowers), [Aider](https://github.com/Aider-AI/aider) | MIT, MIT, Apache-2.0 | 수용 기준·검토 루프·AI 편집 도구 대안 | 보류/부분 도입. 현 저장소는 AGENTS+짧은 스킬+CI+체크포인트를 먼저 사용 |

라이선스는 GitHub 저장소 루트 또는 패키지 `LICENSE`/`package.json` 기준으로 확인했다. **복사 가능한 코드와 무료 호스팅은 동의어가 아니다.** 실제 도입 전에 선택 버전의 하위 의존성, 제공 서비스 약관, 상표·이미지·폰트 고지를 다시 검토한다.

## 제품 기능과 사업화에 연결하는 방법

1. **첫 제품 가설:** “같은 책을 읽는 사람이 지정한 챕터까지 읽은 후 감상을 공유한다.” 책 등록, 소규모 독서방, 진도, 스포일러 제한, 회고를 먼저 검증한다. 이 단계는 사용자가 합법적으로 가진 책으로 참여하거나 자체 집필/권리 확인 텍스트만 내장한다.
2. **콘텐츠 경로:** 서지 API는 제목·표지·ISBN·미리보기를 제공할 수 있으나 일반적으로 책 전체를 앱 안에서 공동 제공하는 권리는 주지 않는다. 현대 책 수기 입력/OCR도 권리 문제를 해결하지 않는다. 고전 원작과 현대 번역의 권리도 분리한다. 정식 원문 제공은 출판사/유통사와 디지털 전송·동시 열람·발췌·주석·대여/판매·지역·기간·DRM·정산을 계약해야 한다.
3. **수익 실험 순서:** 무료 독서방의 첫 참여와 4주 유지율을 확인 → 운영자/독서모임의 유료 기능(진행표, 모임 관리 등) 수요 검증 → 전자책 라이선스와 마켓 결제 구조가 정리되면 계약 작품 판매/대여 파일럿. 각 단계의 CAC, 4주 유지율, 유료 전환, 모임당 활성 독자, 권리료·스토어 수수료 이후 공헌이익을 측정한다. 가격이나 수수료율은 계약 전 가정으로만 둔다.
4. **스토어:** 디지털 콘텐츠 결제·외부 링크·reader app 자격은 Apple/Google 규칙과 국가별 제도에 따라 달라질 수 있다. 임의의 외부 서점 결제 웹뷰를 기본 해법으로 두지 말고 출시 시점 규칙과 계약 구조를 재검증한다.

## 바로 실행할 도입 순서

| 시기 | 추가할 것 | 통과 기준 |
|---|---|---|
| 현재 | Penpot 디자인 토큰/핵심 화면 정리, Expo 프로토타입 검증 | 검은 화면에서도 본문 대비·동적 글자·스크린 리더, 독서방→읽기→감상 흐름 |
| 온라인 MVP | Supabase + RLS; 필요 시 TanStack Query; Sentry | 비회원/탈퇴 회원 접근 차단, 두 기기 동기화·재접속, 오프라인 충돌 정책 |
| 콘텐츠 파일럿 | 권리 확인 EPUB으로 두 리더 방식 비교 | iOS/Android 실제 기기에서 한국어 조판, 위치 복원, 선택/주석, 오프라인, 접근성 |
| 사용자 성장 | 동의 기반 PostHog 이벤트 5~8개, 설문/지원 채널 | 첫 방 참여율·4주 유지율이 측정되고 문의 처리 책임자 지정 |
| 유료 파일럿 | 출판사 계약 + 스토어 정책 검토 + OpenIAP 시험 | 권리 범위, 환불·정산, 영수증 검증, 책 접근권 철회/복원 시나리오 |

자세한 리더·백엔드 호환성 및 기존 12개 후보 비교는 [기술 인벤토리](opensource-inventory.md), 콘텐츠 권리는 [콘텐츠 전략](../CONTENT.md), 운영 규율은 [워크플로](../WORKFLOW.md)에 있다.
