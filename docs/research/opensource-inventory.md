# 공유 독서 모바일 앱 오픈소스 재사용 후보 조사

- 확인일: **2026-09-15 (KST)**
- 범위: iOS/Android 앱 런타임·EPUB 리더·실시간 협업 백엔드·개발 워크플로 후보
- 판정 성격: 아래 도입안은 **자료조사 단계의 잠정 제안**이다. 패키지 설치나 저장소 도입은 수행하지 않았다.
- 라이선스 표기: 저장소의 실제 `LICENSE`/`LICENSE.txt`를 확인한 SPDX 식별자다. 의존 패키지, 호스팅 서비스 약관, 콘텐츠 권리와 DRM 인증 계약은 별도 검토가 필요하다.

## 한눈에 보는 잠정 결론

1. 앱 기반은 **Expo + React Native**가 가장 현실적이다. EPUB 엔진을 바꿀 가능성이 있으므로 처음부터 Expo Go가 아닌 **development build**를 기준으로 잡는다.
2. 리더는 짧은 스파이크를 두 갈래로 한다. 빠른 MVP는 **`@epubjs-react-native/core`**, 장기적인 DRM·접근성·다중 포맷 가능성은 **Readium Swift/Kotlin을 얇은 네이티브 모듈로 연결**해 실제 책 파일로 비교한다.
3. LCP가 당장 필수가 아니면 구현을 미룬다. LCP는 공개 툴킷만의 문제가 아니라 비공개 클라이언트 라이브러리, EDRLab 가입·인증·연간 비용, 서버 운영이 결합된다.
4. 공동 독서방, 주석 동기화, 참가자 상태에는 **Supabase**가 적합한 후보지만, 모든 노출 테이블과 private Realtime 채널을 RLS 테스트로 잠가야 한다.
5. UI는 **React Native Reusables에서 필요한 컴포넌트만 복사**하고 NativeWind는 안정 버전을 고정하는 안을 시험한다. 리더 본문 렌더링 CSS와 앱 셸 스타일 체계를 분리한다.
6. 개발 워크플로는 **Codex 한 가지를 실행 도구로 정하고**, Spec Kit 또는 Superpowers 중 필요한 규율만 얹는 편이 낫다. Aider는 독립 대안으로 비교하며 네 도구를 동시에 표준화하지 않는다.

## 후보 12개 비교

| # | 후보 / 공식 근거 | 실제 라이선스 | 재사용 범위·모바일 적합성 | 관리 활동과 선정 위험 | 잠정 제안 |
|---:|---|---|---|---|---|
| 1 | [Expo](https://github.com/expo/expo), [공식 development build 안내](https://docs.expo.dev/develop/development-builds/introduction/) | [MIT](https://github.com/expo/expo/blob/main/LICENSE) | 라우팅, 빌드 구성, 업데이트, 기기 API를 포함한 RN 앱 프레임. iOS/Android 공통 개발에 적합하며 custom native code도 development build와 config plugin으로 수용한다. | 저장소가 2026-09-14까지 갱신되고 SDK 58 계열 변경도 확인된다. Expo Go는 고정된 네이티브 라이브러리만 포함하므로 Readium 브리지 같은 custom native code에는 맞지 않는다. CNG 사용 시 네이티브 설정을 직접 고치면 재생성 때 유실될 수 있다. | **기반 후보 1순위.** development build, SDK 버전 고정, config plugin 전략을 전제로 한다. |
| 2 | [React Native](https://github.com/facebook/react-native), [릴리스](https://github.com/facebook/react-native/releases) | [MIT](https://github.com/facebook/react-native/blob/main/LICENSE) | React로 네이티브 iOS/Android UI와 네이티브 모듈 경계를 제공하는 핵심 런타임. Expo의 하부 기반이며 Swift/Kotlin 리더 브리지를 만들 수 있다. | 0.87.1 릴리스가 확인될 만큼 활발하다. 빠른 릴리스와 새 아키텍처 변화로 네이티브 모듈·WebView·스타일 라이브러리의 호환성 확인 비용이 생긴다. iOS 빌드는 macOS가 필요하다. | Expo가 관리하는 RN 버전을 우선 사용하고, 직접 RN 버전을 앞서 올리지 않는다. |
| 3 | [Readium Swift Toolkit](https://github.com/readium/swift-toolkit), [릴리스](https://github.com/readium/swift-toolkit/releases) | [BSD-3-Clause](https://github.com/readium/swift-toolkit/blob/develop/LICENSE) | EPUB reflow/fixed layout, PDF, audiobook, comics, 탐색·검색·하이라이트·TTS와 LCP 연결을 제공하는 iOS 네이티브 엔진. 현재 문서는 iOS 15+/Swift 6/Xcode 16.4 조합을 제시한다. | 3.11.0이 2026-07-17 공개됐고 유지보수가 활발하다. minor 릴리스에도 작은 breaking change가 들어갈 수 있다는 공식 경고가 있다. RN에서 쓰려면 자체 Swift 브리지, 이벤트·locator 변환, 빌드/테스트가 필요하다. | DRM·접근성·장기 리더 품질이 중요하면 **iOS 기준 엔진 후보**. 한 권 열기/위치 저장/선택·주석/세로쓰기부터 브리지 스파이크한다. |
| 4 | [Readium Kotlin Toolkit](https://github.com/readium/kotlin-toolkit), [릴리스](https://github.com/readium/kotlin-toolkit/releases) | [BSD-3-Clause](https://github.com/readium/kotlin-toolkit/blob/develop/LICENSE) | Swift판과 대응하는 Android 네이티브 EPUB·PDF·오디오·코믹 엔진. Maven Central 모듈과 Navigator를 재사용할 수 있다. | 저장소가 2026-07-31까지 갱신됐고 README 버전 표에는 3.4.0이 보인다. 현재 계열은 Android min SDK 24로 올라가며, core library desugaring과 RN Kotlin 브리지가 필요하다. minor 릴리스의 작은 breaking change 경고도 동일하다. | Readium을 택하면 Swift판과 같은 JS 인터페이스 계약을 먼저 만들고 두 플랫폼 구현을 맞춘다. |
| 5 | [Readium LCP 사양](https://readium.org/lcp-specs/), [모바일 연동 안내](https://readium.org/kotlin-toolkit/3.2.0/guides/lcp/), [EDRLab 가격](https://www.edrlab.org/readium-lcp/pricing/), [오픈소스 서버](https://github.com/readium/readium-lcp-server) | 서버·Readium 툴킷: [BSD-3-Clause](https://github.com/readium/readium-lcp-server/blob/master/LICENSE.md). 프로덕션 모바일 `liblcp`/`R2LCPClient`: 공개 OSS 라이선스 대상이 아닌 EDRLab 제공 비공개 바이너리 | 도서 대여/판매용 DRM, 대출 연장·반납·기기 등록까지 제공한다. 브라우저 앱은 안전상 LCP를 통합할 수 없다고 명시되어 네이티브 모바일 엔진이 필요하다. | 프로덕션은 EDRLab 가입, 앱/서버 인증과 연간 비용이 필요하다. 테스트용 basic profile은 보안용이 아니다. 서버는 라이선스·상태 서버, 게이트웨이, DB, 암호화 파일 저장소까지 운영 범위가 넓고, 기존 v1과 신형 v2 이행 경로도 확인해야 한다. | 요구사항이 확정될 때까지 **아키텍처 경계만 확보**한다. 공공도서관/출판사 LCP 콘텐츠가 필수이면 계약·비용·인증 일정을 제품 일정에 먼저 반영한다. |
| 6 | [epub.js](https://github.com/futurepress/epub.js), [릴리스](https://github.com/futurepress/epub.js/releases) | [BSD-2-Clause](https://github.com/futurepress/epub.js/blob/master/license) | 브라우저 iframe/WebView에서 EPUB 파싱·페이지네이션·CFI 위치·hook을 제공한다. React Native에서는 직접 쓰기보다 WebView 래퍼의 엔진으로 쓰는 편이 자연스럽다. | 최신 정식 릴리스로 표시되는 v0.3.88은 2020-07-01이다. 이후 이슈·PR은 있으나 정식 릴리스 주기가 오래 멈췄고, 모바일 WebView의 선택·키보드·스크롤·메모리·CJK 세로쓰기 품질을 앱이 책임져야 한다. LCP를 지원하지 않는다. | 새 RN 앱의 직접 의존성으로 선정하기보다, 아래 래퍼를 평가할 때 포함되는 엔진으로 본다. |
| 7 | [`@epubjs-react-native/core`](https://github.com/victorsoares96/epubjs-react-native), [릴리스](https://github.com/victorsoares96/epubjs-react-native/releases) | [MIT](https://github.com/victorsoares96/epubjs-react-native/blob/main/LICENSE) | epub.js를 React Native WebView 안에 넣고 Expo/Bare 파일 시스템 어댑터, 목차, 검색, 북마크, 주석, 위치·진행률 API를 제공한다. MVP 기능과 JS 통합 속도 면에서 유리하다. | 릴리스 페이지의 최신 v1.4.7은 파일 시스템 의존성 변경 중심이며, v1.4.6에는 RN 0.75/당시 Expo 계열 업데이트가 기록돼 있다. 현재 Expo/RN 조합, 실제 iOS 기기, 대용량 EPUB, CJK, 접근성에서 재검증이 필요하다. WebView/파일 시스템/gesture-handler 등 의존 면적도 있다. | **2–3일 기술 스파이크 1순위.** 실제 한국어 EPUB 세트로 열기·재개·선택·주석 앵커 안정성·오프라인·메모리를 통과할 때만 MVP 채택한다. DRM 계획이 생기면 Readium과 재비교한다. |
| 8 | [React Native Reusables](https://github.com/founded-labs/react-native-reusables) | [MIT](https://github.com/founded-labs/react-native-reusables/blob/main/LICENSE) | shadcn/ui 방식으로 컴포넌트 소스를 앱에 복사해 소유·수정한다. 버튼, 시트, 대화상자, 입력 등 앱 셸을 빠르게 구성하기 좋다. | 저장소가 Founded Labs로 이전됐고 2026년 3월 릴리스 활동이 보인다. 복사한 뒤에는 상류 보안·접근성 수정이 자동 반영되지 않으며, rn-primitives와 NativeWind/Uniwind 버전 결합을 관리해야 한다. | 필요한 컴포넌트만 선택 복사하고 출처·원본 커밋을 기록한다. 리더 본문 뷰에는 적용하지 않는다. |
| 9 | [NativeWind](https://github.com/nativewind/nativewind), [v5 진행 상황](https://github.com/nativewind/nativewind/discussions/1818) | [MIT](https://github.com/nativewind/nativewind/blob/main/LICENSE) | Tailwind 계열 className을 RN 스타일로 빌드해 앱 셸의 토큰·다크 모드·반응형 스타일을 공유한다. | 2026년에도 커밋과 v5 안정화 작업이 활발하지만 공식 README는 v5를 preview로 표시한다. Babel/Metro/Tailwind 설정과 RN·Expo 호환 행렬이 추가되고, 웹 CSS와 RN 스타일의 지원 범위가 완전히 같지는 않다. | Reusables를 쓸 때 **안정 v4 계열 고정**부터 평가한다. v5 preview는 기능상 필요가 입증될 때만 별도 브랜치에서 검증한다. |
| 10 | [Supabase JS](https://github.com/supabase/supabase-js), [Expo quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native), [Realtime 권한](https://supabase.com/docs/guides/realtime/authorization), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | 앱 SDK: [MIT](https://github.com/supabase/supabase-js/blob/master/LICENSE). 플랫폼 모노레포: [Apache-2.0](https://github.com/supabase/supabase/blob/master/LICENSE) | Postgres, Auth, Storage, Realtime Broadcast/Presence/Postgres Changes를 한 백엔드로 제공한다. 독서방 멤버십, 진행 위치, 주석 이벤트와 참가자 presence에 잘 맞고 공식 Expo/RN 안내가 있다. | 2026년에도 SDK·문서·플랫폼 릴리스가 활발하다. 핵심 위험은 RLS 누락이다. 노출 스키마 테이블은 RLS와 최소 grant가 필요하고, private Broadcast/Presence도 `realtime.messages` 정책을 작성해야 한다. service-role/secret key는 앱에 둘 수 없다. Realtime은 오프라인 충돌 해결이나 영구 이벤트 로그를 대신하지 않는다. | **백엔드 스파이크 1순위.** 방 멤버십 기반 RLS, 탈퇴/차단, 주석 소유권, 재접속·중복 이벤트를 로컬 테스트로 먼저 고정한다. |
| 11 | [OpenAI Codex](https://github.com/openai/codex), [릴리스](https://github.com/openai/codex/releases) | [Apache-2.0](https://github.com/openai/codex/blob/main/LICENSE) | 로컬 저장소에서 계획·코드 수정·명령 실행·검토를 수행하는 범용 coding agent. 앱 런타임에는 포함되지 않는 개발 도구다. | 2026-09-15에도 다수 pre-release가 배포될 정도로 매우 활발하다. CLI OSS 라이선스와 모델/API/ChatGPT 이용 조건·비용은 별개다. 자동 변경은 사람의 diff 검토와 CI를 대체하지 않는다. | 현재 개발 실행 도구 후보로 두고, 저장소 지침·테스트·작은 변경 단위로 통제한다. alpha 채널을 팀 표준으로 고정하지 않는다. |
| 12a | [Superpowers](https://github.com/obra/superpowers), [릴리스](https://github.com/obra/superpowers/releases) | [MIT](https://github.com/obra/superpowers/blob/main/LICENSE) | brainstorming, 계획, 테스트, 리뷰, subagent 흐름을 coding agent에 주입하는 skills/방법론 묶음이다. | v6.3.0이 2026-07-24 공개되는 등 활발하다. 강한 절차가 작은 작업에도 비용을 만들 수 있고, 외부 프롬프트/스크립트가 에이전트 행동을 바꾸므로 버전 pin과 내용 검토가 필요하다. | 전체 도입보다 계획·디버깅·검토 skill 몇 개를 샌드박스 저장소에서 평가한다. |
| 12b | [GitHub Spec Kit](https://github.com/github/spec-kit), [변경 기록](https://github.com/github/spec-kit/blob/main/CHANGELOG.md) | [MIT](https://github.com/github/spec-kit/blob/main/LICENSE) | constitution → specification → plan → tasks 흐름으로 요구사항과 구현 추적성을 만드는 개발 전용 도구다. | 1.0.0이 2026-08-21 공개됐고 2026년 릴리스가 매우 잦다. 생성 산출물이 실제 제품 결정과 어긋나거나 문서 의식이 과해질 위험이 있으며, 업그레이드 시 템플릿 차이를 관리해야 한다. | 독서방 권한, 주석 충돌, 오프라인 동작처럼 acceptance criteria가 중요한 기능 한 개에만 시험한다. |
| 12c | [Aider](https://github.com/Aider-AI/aider), [릴리스](https://github.com/Aider-AI/aider/releases) | [Apache-2.0](https://github.com/Aider-AI/aider/blob/main/LICENSE.txt) | 터미널 기반 AI pair programmer로 git diff/commit 중심 편집과 여러 모델 공급자를 지원한다. 앱 런타임에는 포함되지 않는다. | 최신 표시 릴리스 v0.86.0은 2025-08-09이고 저장소 업데이트는 2026-05까지 확인된다. 모델별 API 키·비용·데이터 처리 조건을 따로 관리해야 하며, Codex와 기능이 겹친다. | Codex의 대안 비교군으로만 둔다. 한 저장소에서 두 에이전트의 자동 커밋 규칙을 동시에 표준화하지 않는다. |

> 표의 `12a–12c`는 개발 harness/agent 계열 한 묶음으로 세어 총 12개 후보군이다. 제품 바이너리에 포함되는 라이브러리와 개발 과정에서만 쓰는 도구를 의존성 목록에서 분리한다.

## 추천 검증 순서

### 1. 리더 엔진 결정용 실제 파일 스파이크

동일한 한국어 EPUB 세트(일반 reflow, 이미지 많은 책, 주석이 많은 책, 잘못 제작된 책, 가능하면 세로쓰기/RTL 샘플)를 두 구현에 넣는다.

- 공통 통과 기준: 로컬 파일 import, 오프라인 재열기, 목차 이동, 앱 종료 후 정확한 위치 복원, 텍스트 선택, 하이라이트·메모 앵커 복원, 글꼴/행간/테마, VoiceOver/TalkBack, 외부 링크 통제
- `@epubjs-react-native/core` 추가 확인: WebView 프로세스 재시작, 큰 책 메모리, Android 뒤로가기/키보드, CFI 안정성, 현재 Expo SDK 호환성
- Readium 추가 확인: Swift/Kotlin 브리지 API 대칭성, locator 직렬화, RN 새 아키텍처 빌드, 개발 build 재생성, 두 플랫폼 UI 차이
- 결정 규칙: MVP 기준을 WebView 방식이 모두 통과하고 LCP 요구가 없으면 이를 우선한다. 접근성·다중 포맷·DRM·렌더링 결함 중 하나가 제품 핵심이면 Readium 비용을 받아들일 근거가 생긴다.

### 2. Supabase 권한·동기화 스파이크

- 테이블 최소안: `rooms`, `room_members`, `books`, `reading_sessions`, `annotations`, `annotation_events`
- 멤버만 방/주석을 읽고 쓰는 RLS, 작성자/관리자 수정·삭제, 탈퇴 즉시 차단을 `supabase test db`로 검증한다.
- Broadcast/Presence 채널은 private으로 만들고 `realtime.messages` 정책을 방 멤버십과 연결한다.
- 영구 상태는 Postgres 행을 기준으로 삼고 Realtime은 전달 수단으로만 사용한다. 재접속 시 서버 상태 재조회, event id 기반 중복 제거, 충돌 정책을 따로 둔다.

### 3. UI·개발 도구 스파이크

- React Native Reusables 3–5개만 복사해 키보드 탐색, 스크린 리더 레이블, 다크 모드, 동적 글자 크기를 확인한다.
- NativeWind 안정 버전과 Expo SDK의 조합을 lockfile에 고정하고 업그레이드 주기를 정한다.
- 개발 방법론은 작은 기능 하나를 대상으로 `Codex 단독`, `Codex + Spec Kit`, `Codex + 선택한 Superpowers skill` 세 흐름의 산출물 품질과 검토 부담을 비교한다. Aider는 실행 도구 대안이 필요할 때만 같은 과제로 별도 평가한다.

## 라이선스 실무 메모

- MIT/BSD 계열도 무표시로 가져오는 것은 피한다. 배포물의 third-party notices 또는 저장소 고지 파일에 저작권·허가문을 보존한다.
- BSD-3-Clause는 Readium 이름이나 기여자 이름을 제품 추천·보증처럼 사용하지 않는다.
- Apache-2.0 후보는 라이선스 사본, NOTICE가 있을 경우 NOTICE, 수정 파일 고지와 특허 조항을 확인한다.
- React Native Reusables처럼 소스를 복사하는 경우 원본 저장소 URL, 가져온 커밋, 로컬 수정 내역을 컴포넌트 인벤토리에 남긴다.
- LCP 콘텐츠 권한과 EDRLab 인증 계약은 OSS 고지와 별도다. 앱스토어 배포 전 법무/사업 검토 항목으로 둔다.

## 출처 확인 범위

모든 링크는 2026-09-15에 확인했다. 관리 활동은 GitHub의 저장소·릴리스·변경 기록에 보이는 최근 업데이트를 근거로 했으며, 별점이나 임의 점수는 사용하지 않았다. 실제 도입 직전에는 선택한 태그의 `LICENSE`, transitive dependency 목록, 지원 OS/SDK 행렬, 보안 공지를 다시 고정 시점 기준으로 확인해야 한다.
