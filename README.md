# 여백 · Shared Reading

iOS·Android 일반 독자를 위한 공유 독서 앱. 검은 서가와 광안리 밤 책방의 차분한 분위기를 바탕으로, 읽은 지점에서 다른 독자의 감상을 만나는 경험을 만든다. 이름은 임시다.

**현재 단계: 자체 샘플을 사용하는 로컬 프로토타입.** 실제 회원/서버/실시간 대화, 상용 전자책·EPUB·DRM·결제·스토어 출시는 아직 구현하지 않았다. 웹은 공용 코드를 빠르게 확인하는 미리보기이며 native 기기 검증을 대신하지 않는다.

## 시작

Node.js 24 LTS와 npm이 필요하다.

```sh
npm --prefix apps/mobile ci
npm run web
```

휴대폰 개발은 `npm start` 후 현재 SDK와 호환되는 Expo 클라이언트로 연다. 커스텀 네이티브 리더가 들어가면 development build가 필요하다. iOS 네이티브 빌드에는 macOS/Xcode 또는 별도 클라우드 빌드 환경이 필요하다.

```sh
npm run verify      # 타입검사 + 작고 결정적인 회귀검사
npm run export      # iOS/Android/Web JavaScript 번들 생성 (스토어 바이너리 빌드 아님)
npm run checkpoint  # 로컬 작업 상태 저장
```

## 문서

- [제품 범위와 우선순위](docs/PRODUCT.md)
- [서비스 6종 기능 조사](docs/research/service-references.md)
- [전자책 API·저작권·조달 전략](docs/CONTENT.md)
- [광안리 책방 디자인 방향](docs/DESIGN.md)
- [아키텍처와 다음 작업 큐](docs/ARCHITECTURE.md)
- [출판사 협업 초안](docs/PARTNERSHIP.md)
- [오픈소스 후보·라이선스](docs/research/opensource-inventory.md)
- [중단 복구·모델 배분·토큰 절감 운영](docs/WORKFLOW.md)
- [실제 검증과 미검증 범위](docs/VALIDATION.md)
- [출처/라이선스 고지](THIRD_PARTY_NOTICES.md)

## 작업 재개

`CHECKPOINT.md` → `git status --short` → 해당 파일과 필요한 문서만 읽는다. 새로운 작업자는 [AGENTS.md](AGENTS.md)를 따른다. 작업 스킬은 `.agents/skills/reading-slice/SKILL.md`, 모델 설정은 `.codex/`에 있다. 설치된 Codex 버전·신뢰 설정에 따라 다음 세션에서 로드되며, 이미 열린 세션의 자동 재설정은 보장하지 않는다.

스냅샷은 결정·Git 상태의 기록이며 소스 백업 자체는 아니다. 파일은 작은 단위로 저장하고 검증된 마일스톤은 Git 커밋으로 남긴다. 민감한 데이터는 체크포인트에 쓰지 않는다.
