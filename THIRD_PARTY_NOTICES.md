# Third-party inventory

## 실제 포함

앱 골격은 `create-expo-app`의 `blank-typescript` 템플릿에서 생성했다. Expo의 MIT 고지는 [apps/mobile/LICENSE](apps/mobile/LICENSE)에 보존했다. 최종 배포 때 모든 직접/전이 의존성의 전체 라이선스·NOTICE를 바이너리 고지에 수록해야 하며, 이 인벤토리는 그 작업의 완료 선언이 아니다.

| 직접 의존성 | 라이선스 | 원본 |
|---|---|---|
| Expo / expo-status-bar / @expo/metro-runtime | MIT | https://github.com/expo/expo |
| React / React DOM | MIT | https://github.com/facebook/react |
| React Native | MIT | https://github.com/facebook/react-native |
| React Native Web | MIT | https://github.com/necolas/react-native-web |
| AsyncStorage | MIT | https://github.com/react-native-async-storage/async-storage |
| Safe Area Context | MIT | https://github.com/AppAndFlow/react-native-safe-area-context |
| React Native SVG | MIT | https://github.com/software-mansion/react-native-svg |
| TypeScript (개발) | Apache-2.0 | https://github.com/microsoft/TypeScript |
| @types/react (개발) | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |

정확한 설치 버전은 `apps/mobile/package-lock.json`, 설치된 고지는 각 패키지의 LICENSE를 기준으로 한다. 앱용 AI API나 별도 유료 API SDK는 넣지 않았다.

## 조사·설계에만 참고

Fable, StoryGraph, Bookclubs, 그믐, 밀리의서재, 리디의 기능 소개는 조사 출처다. 본문/표지/로고/화면 코드를 복사하지 않았다. 자세한 출처는 [서비스 조사](docs/research/service-references.md).

Readium, epub.js, EPUB React Native, Reusables, NativeWind, Supabase, Superpowers, Spec Kit, Aider는 [비교 대상](docs/research/opensource-inventory.md)이다. 현재 앱에 설치했거나 해당 소스를 복사했다는 의미가 아니다. 개발 루프는 비교 자료와 공식 Codex 문서를 참고해 이 프로젝트에 맞게 직접 작성했다.

데모 글과 표지는 이번 프로토타입용으로 새로 작성한다. 실제 출판된 책의 본문·표지를 사용한 서비스로 오해하지 않도록 예시 표시를 유지한다. 저장소 전체의 공개 라이선스는 소유자 결정 전 별도로 부여하지 않는다.
