# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**오늘 뭐 입었지? (Today's Outfit)** — 하루 단위로 착장을 기록하는 모바일 웹 옷장 로그 앱. 제품 요구사항은 `docs/PRD.md`(F001~F013 기능 명세, 데이터 모델, 화면별 요구사항)에 있고, 개발 순서와 현재 진행 상태는 `docs/ROADMAP.md`에 있다. 새 기능을 시작하기 전에 두 문서를 먼저 확인할 것.

**Task 완료 시 로드맵 갱신(필수)**: `docs/ROADMAP.md`의 Task 작업을 완료하면(검증까지 끝난 시점) 그 즉시 같은 턴에서 다음을 갱신할 것 — ① 해당 Task 제목에 `✅ - 완료` 추가, ② 하위 체크리스트와 `완료 기준(DoD)` 항목을 `- [x]`로 표시, ③ 상단 "현재 코드베이스 상태" 표의 관련 행, ④ 하단 "진행 현황 요약" 표의 Phase 진행률, ⑤ "다음 실행 작업" 줄. 사용자가 별도로 요청하지 않아도 매 Task 완료마다 수행한다.

## 명령어

```bash
npm run dev     # 개발 서버 (Next.js)
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버 실행
npm run lint    # ESLint (eslint.config.mjs: next/core-web-vitals + next/typescript)
```

테스트 스크립트는 아직 구성되어 있지 않다(테스트 프레임워크 미설치).

`.env.local`에 다음 환경변수가 필요하다 (README.md 기준):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## 아키텍처

### 디렉토리 구조 — `src/` 없음

`docs/guides/project-structure.md`는 `src/app`, `src/components`, `src/lib` 구조를 전제로 설명하지만, **이 저장소는 `src/` 디렉토리를 사용하지 않는다.** `app/`, `components/`, `lib/`가 모두 저장소 루트에 바로 있다. `tsconfig.json`의 경로 별칭(`@/*` → 루트)과 `components.json`의 shadcn 별칭도 이 루트 기준을 따른다.

### 인증 — 이미 구현 완료 (PRD F010)

이메일/비밀번호 로그인, 구글 OAuth, 비밀번호 재설정, 로그아웃이 모두 구현되어 있다(`app/auth/**`, `components/login-form.tsx`, `sign-up-form.tsx`, `google-login-button.tsx` 등). 신규 개발 대상이 아니라 아래 세션 관리 구조를 재사용하는 전제로 다룰 것.

- **`proxy.ts`(루트)**: Next.js 미들웨어 역할을 하지만 관례적인 `middleware.ts`가 아니라 `proxy.ts` + `export function proxy(...)`로 작성되어 있다. `lib/supabase/proxy.ts`의 `updateSession()`을 호출한다.
- **라우트 보호 allowlist**: `updateSession()`은 경로가 `/`, `/login*`, `/auth*`로 시작할 때만 비로그인 접근을 허용하고, 그 외 모든 경로는 `/auth/login`으로 리다이렉트한다. 새 보호 라우트를 추가할 때 이 allowlist 로직(`lib/supabase/proxy.ts`)을 함께 검토해야 한다.
- **클라이언트 분리**: `lib/supabase/client.ts`(브라우저, `createBrowserClient`)와 `lib/supabase/server.ts`(서버 컴포넌트/액션, `next/headers`의 `cookies()` 사용, Fluid compute 대응을 위해 요청마다 새 클라이언트를 생성)를 상황에 맞게 구분해서 써야 한다.
- `lib/utils.ts`의 `hasEnvVars`는 환경변수 미설정 시 proxy 체크를 건너뛰는 스타터킷 안전장치다.

### `next.config.ts`

`cacheComponents: true`(Cache Components/PPR 계열 실험 옵션)가 활성화되어 있다. 캐싱과 관련된 작업을 할 때 이 설정의 영향을 고려해야 한다.

### `docs/guides/*.md`는 범용 참고 문서이며 실제 코드와 다를 수 있음

`docs/guides/`(nextjs-15.md, component-patterns.md, forms-react-hook-form.md, styling-guide.md, project-structure.md)는 Next.js+Supabase 스타터킷에 딸려온 **범용 패턴 가이드**로, 이 프로젝트를 위해 검증된 문서가 아니다. 실제 코드와 다음과 같이 어긋나는 부분이 있으므로, 가이드보다 실제 코드·`package.json`을 항상 우선할 것:

- `forms-react-hook-form.md`, `styling-guide.md`는 React Hook Form·Zod가 이미 설치되어 있고 TailwindCSS v4가 적용된 것처럼 서술하지만, 실제로는 **RHF·Zod 미설치, TailwindCSS v3.4.1**이다.
- `project-structure.md`가 전제하는 `src/` 구조도 위에서 설명했듯 실제와 다르다.

### 스타터킷 잔재 코드

`app/protected/`, `components/tutorial/`, `hero.tsx`, `next-logo.tsx`, `supabase-logo.tsx`, `deploy-button.tsx`, `theme-switcher.tsx`(+`next-themes`)는 Next.js+Supabase 공식 스타터킷의 데모/다크모드 코드다. `docs/PRD.md` 9절이 MVP에서 다크모드를 명시적으로 제외하므로, 기능 개발 시 이 코드들을 패턴으로 참고하지 말 것. `docs/ROADMAP.md`의 초기 설정 단계에서 정리될 예정이다.

### shadcn/ui

`components.json` 기준 style은 `new-york`, baseColor는 `neutral`이다. `components/ui/`에는 현재 badge, button, card, checkbox, dropdown-menu, input, label 7종만 설치되어 있다. 다른 컴포넌트가 필요하면 `npx shadcn@latest add <name>`으로 추가한다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
