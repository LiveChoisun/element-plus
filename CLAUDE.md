# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

Element Plus는 TypeScript와 Composition API로 작성된 Vue 3 컴포넌트 라이브러리입니다. pnpm 워크스페이스로 관리되는 모노레포 구조입니다.

## 주요 명령어

```bash
pnpm install              # 의존성 설치 (stub, gen:version 자동 실행)
pnpm dev                  # 플레이그라운드 개발 서버 실행
pnpm test                 # Vitest로 단위 테스트 실행
pnpm test -- button       # 특정 컴포넌트 테스트 실행
pnpm test:coverage        # 커버리지 포함 테스트 실행
pnpm lint                 # ESLint 실행
pnpm lint:fix             # 린트 문제 자동 수정
pnpm format               # Prettier로 코드 포맷팅
pnpm typecheck            # TypeScript 타입 체크 전체 실행
pnpm build                # 라이브러리 전체 빌드 (Gulp 기반)
pnpm build:theme          # theme-chalk만 별도 빌드
pnpm docs:dev             # 문서 사이트 로컬 실행
pnpm gen                  # 새 컴포넌트 템플릿 생성 (대화형 bash 스크립트)
pnpm cz                   # 대화형 커밋 메시지 생성 (commitizen)
```

## 아키텍처

### 모노레포 구조

- **packages/components/** - 124개 이상의 UI 컴포넌트, 각각 별도 디렉토리
- **packages/hooks/** - Vue 3 Composition API 훅 (공유 로직)
- **packages/utils/** - 컴포넌트 간 공유 유틸리티 함수
- **packages/directives/** - Vue 디렉티브 (click-outside, mousewheel 등)
- **packages/constants/** - 공유 상수 (aria, dates, events, keys, sizes)
- **packages/locale/** - i18n 번역 (40개 이상 언어 지원)
- **packages/theme-chalk/** - SCSS 기반 테마 시스템
- **packages/element-plus/** - 메인 라이브러리 진입점
- **internal/build/** - Gulp + Rollup 빌드 도구
- **play/** - Vite 기반 컴포넌트 플레이그라운드
- **docs/** - VitePress 문서 사이트

### 컴포넌트 구조 패턴

각 컴포넌트는 다음 구조를 따릅니다:
```
packages/components/component-name/
├── index.ts              # withInstall() 래퍼로 내보내기
├── src/
│   ├── component.vue     # Vue SFC
│   ├── component.ts      # Props/emits 정의
│   ├── use-component.ts  # Composition 훅
│   └── instance.ts       # 타입 내보내기
├── __tests__/            # 단위 테스트
└── style/                # SCSS 스타일
```

### 주요 패턴

- **withInstall()** - `@element-plus/utils`의 래퍼, `app.use()` 등록을 위한 `.install()` 메서드 추가
- **useNamespace()** - BEM 스타일 클래스명 생성 훅
- **buildProps()** - TypeScript 지원 컴포넌트 props 정의 유틸리티
- **definePropType()** - 복잡한 prop 타입 정의 헬퍼

### 빌드 시스템

- **Gulp** - 빌드 파이프라인 오케스트레이션 (`internal/build/gulpfile.ts`)
- **Rollup** - ESM (`es/`) 및 CommonJS (`lib/`) 번들링
- **SCSS** - theme-chalk 스타일 컴파일
- 출력 위치: `dist/` 디렉토리

### 테스트

- **Vitest** - jsdom 환경 사용
- 테스트 파일은 컴포넌트와 함께 `__tests__/` 디렉토리에 위치
- Vue Test Utils로 컴포넌트 마운팅
- 커버리지 제외: play/, lang/, style/, scripts/, ssr-testing/

## 코드 스타일

- 세미콜론 없음, 작은따옴표, ES5 trailing comma (Prettier)
- 커밋 형식: `type(scope): description` (conventional commits)
- Pre-commit 훅으로 ESLint, Prettier 실행 (lint-staged)

## 필수 조건

- Node.js >= 20
- pnpm >= 10.18

## 배포 (DYB Fork)

이 포크는 DYB 프로젝트에서 사용하기 위해 GitHub에 배포됩니다.

### 배포 단계

1. `master` 브랜치에서 수정 작업
2. 라이브러리 빌드:
   ```bash
   pnpm install
   pnpm build
   ```
3. dist 브랜치로 전환 후 업데이트:
   ```bash
   git checkout dist
   cp -r dist/element-plus/* .
   git add -f es lib dist theme-chalk package.json README.md LICENSE global.d.ts attributes.json tags.json web-types.json
   git commit -m "chore: build dist for vX.X.X"
   ```
4. 버전 태그 생성 및 latest 업데이트:
   ```bash
   git tag vX.X.X
   git tag -f latest
   git push origin dist --tags
   git push -f origin latest
   ```
5. master로 복귀 후 changelog 업데이트:
   ```bash
   git checkout -f master
   ```
6. [docs/DYB-changelog.md](./docs/DYB-changelog.md)에 새 버전 추가

### 외부 프로젝트에서 사용

```json
{
  "dependencies": {
    "element-plus": "github:LiveChoisun/element-plus#latest"
  }
}
```

특정 버전 지정: `github:LiveChoisun/element-plus#v0.0.1`

### 버전 히스토리

릴리스 이력은 [docs/DYB-changelog.md](./docs/DYB-changelog.md) 참고.
