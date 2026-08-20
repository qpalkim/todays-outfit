# AI Agent 개발 규칙 (오늘 뭐 입었지?)

이 문서는 **AI 코딩 에이전트 전용 운영 규칙**이다. 일반적인 React/Next.js/TypeScript 지식은 다루지 않는다. 이 저장소에만 해당하는 사실과 제약만 기술한다.

## 1. 프로젝트 개요

- 하루 단위 착장 기록 모바일 웹 앱. 기능 명세는 `docs/PRD.md`(F001~F013), 진행 상태는 `docs/ROADMAP.md`.
- 스택: Next.js 15 App Router / React 19 / TypeScript / TailwindCSS v4 / shadcn/ui / Supabase(Auth·DB·Storage).
- **새 기능을 시작하기 전 반드시 `docs/PRD.md`와 `docs/ROADMAP.md`를 먼저 확인**하고, `docs/ROADMAP.md`의 Task 순서(006→007→008→009→010 등 `dependencies`)를 따른다.

## 2. 디렉토리 구조 — `src/` 사용 금지

- `app/`, `components/`, `lib/`, `types/`가 **저장소 루트**에 직접 있다. `src/app/...` 같은 경로를 생성하지 말 것.
- 경로 별칭 `@/*`는 루트를 가리킨다(`tsconfig.json`, `components.json` 기준).

```
Good: components/common/image-uploader.tsx
Bad:  src/components/common/image-uploader.tsx
```

## 3. 문서 신뢰 우선순위

`docs/guides/*.md`(component-patterns.md, forms-react-hook-form.md, nextjs-15.md, project-structure.md, styling-guide.md)는 Next.js+Supabase 스타터킷이 제공한 **범용 참고 문서이며 이 프로젝트에 맞춰 검증되지 않았다.**

- `forms-react-hook-form.md`, `styling-guide.md`는 RHF/Zod가 없고 TailwindCSS v3라고 서술하지만 실제로는 **RHF·Zod 설치 완료, TailwindCSS v4** 상태다.
- `project-structure.md`는 `src/` 구조를 전제하지만 이 저장소는 `src/`를 쓰지 않는다(2절 참조).
- 신뢰 순서: **실제 코드/`package.json` > `CLAUDE.md`/`docs/ROADMAP.md` > `docs/guides/*.md`**. `docs/guides/*.md`의 코드 예시를 그대로 복사하지 말고, 반드시 현재 설치된 패키지 버전과 실제 컴포넌트 코드를 먼저 확인할 것.

## 4. 인증 · 라우트 보호

- 미들웨어는 관례적인 `middleware.ts`가 아니라 **루트의 `proxy.ts`** + `export function proxy(...)`이며, 내부적으로 `lib/supabase/proxy.ts`의 `updateSession()`을 호출한다.
- `updateSession()`은 경로가 `/auth`로 시작할 때만 비로그인 접근을 허용하고, 그 외 모든 경로는 `/auth/login`으로 리다이렉트한다.
- **새로운 보호 라우트(예: `app/새기능/page.tsx`)를 추가할 때, `lib/supabase/proxy.ts`의 allowlist 조건과 `proxy.ts`의 `config.matcher`가 여전히 유효한지 함께 검토**해야 한다. 별도 페이지 단위 인증 체크를 새로 만들지 말고, 기존 `updateSession()` 체계를 재사용한다.
- `app/(tabs)/layout.tsx`의 `AuthGuard`(서버 컴포넌트, `supabase.auth.getClaims()` 사용) 패턴을 다른 보호 레이아웃(`app/outfits/layout.tsx`, `app/closet/layout.tsx`)에서도 동일하게 따른다.
- 로그인/회원가입/OAuth/비밀번호 재설정/로그아웃은 **이미 구현 완료**(F010). `components/login-form.tsx`, `sign-up-form.tsx`, `google-login-button.tsx`, `logout-button.tsx`를 신규 작성하지 말고 그대로 재사용한다.

## 5. 단일 출처(Single Source of Truth) 규칙 — 여러 파일 동시 수정 필요

| 값/타입 | 단일 출처 파일 | 동시 수정이 필요한 연관 파일 |
|---|---|---|
| 옷 카테고리 값(`top`/`bottom`/`shoes`/`outer`/`etc`) | `lib/constants/category.ts`(`CLOTHING_CATEGORIES`, `CLOTHING_CATEGORY_LABELS`) | `supabase/migrations/*_create_outfit_tables.sql`의 `clothing_items` CHECK 제약(`category = any (array[...])`) — 카테고리 추가/변경 시 반드시 함께 수정 |
| 이미지 검증(용량 5MB, 확장자) | `lib/validations/image.ts`(`imageFileSchema`, `MAX_IMAGE_SIZE_BYTES`, `ACCEPTED_IMAGE_TYPES`) | 없음. 새 검증 로직을 다른 파일에 중복 작성하지 말 것 |
| 폼 검증 스키마 | `lib/validations/outfit.ts`, `lib/validations/clothing-item.ts` | `types/outfit.ts`, `types/clothing.ts`(도메인 타입과 필드명 일치 유지) |
| Server Action 반환 타입 | `types/action.ts`(`ActionResult<T>`) | 모든 `app/**/actions.ts`. 새로운 응답 타입(`{ ok, data }` 등)을 정의하지 말 것 |
| Supabase DB 타입 | `lib/supabase/types.ts` | 스키마 변경 시 `mcp__supabase__generate_typescript_types`로 **재생성**만 하고 수동 편집 금지 |
| 브랜드 CSS 변수(민트/그레이) | `app/globals.css`의 `:root` 및 `@theme inline` | shadcn 컴포넌트는 이 변수를 그대로 상속받으므로 컴포넌트 파일에 색상 값을 하드코딩하지 말 것 |

## 6. 스타일 · shadcn/ui · 다크모드

- shadcn/ui 컴포넌트는 **반드시 `npx shadcn@latest add <name>`으로 설치**한다. `components/ui/*.tsx`를 손으로 새로 작성하지 말 것. `components.json` 기준 `style: new-york`, `baseColor: neutral`을 따른다.
- **다크 모드는 PRD 9절에서 MVP 범위 제외로 명시**되어 있다. TailwindCSS v4의 `dark:` 유틸리티 클래스와 `next-themes` 패키지 사용을 금지한다.
  - **실사고 사례**: shadcn CLI로 컴포넌트를 새로 설치하면 최신 템플릿에 `dark:*` 클래스와 `next-themes`(sonner의 `useTheme`)가 자동으로 딸려온다. 컴포넌트를 설치/갱신할 때마다 `dark:` 클래스와 `next-themes` import가 재도입되지 않았는지 확인하고 제거할 것.
  ```
  Bad:  className="bg-input dark:bg-input/30"
  Good: className="bg-input"
  ```
  ```
  Bad:  import { useTheme } from "next-themes"; theme={theme}
  Good: theme="light" (하드코딩, next-themes 미사용)
  ```
- 모바일 전용(375px 기준) 앱이다. 데스크톱/태블릿 반응형 분기를 추가하지 않는다. `app/layout.tsx`의 `max-w-md` 컨테이너 제약과 중복되는 폭 제약을 하위 컴포넌트에 넣지 말 것.
- 상호작용 요소(버튼 기본/lg/icon 사이즈, input, select trigger 등 주요 탭 대상)는 **최소 높이 44px**을 유지한다. `xs`/`sm`/`icon-xs`/`icon-sm` 같은 축소 variant는 인라인 보조 액션 전용으로만 쓰고 주요 CTA에 사용하지 말 것.

## 7. `cacheComponents`(PPR) 관련 클라이언트 컴포넌트 작성 규칙

`next.config.ts`에 `cacheComponents: true`가 활성화되어 있다. 클라이언트 컴포넌트의 **초기 렌더(useState 초기값, 모듈 최상위 등)에서 `new Date()`, `Math.random()` 등 비결정적 값을 직접 사용하면 prerender 에러**(`blocking-prerender-current-time-client`)가 발생한다.

```
Bad:  const [date, setDate] = useState(new Date());
Good: const [date, setDate] = useState<Date | undefined>(undefined);
      // 필요한 시점(useEffect, 이벤트 핸들러)에 new Date()를 읽는다
```

- `react-day-picker` 기반 `components/ui/calendar.tsx`도 내부적으로 이 이슈에 영향을 받을 수 있다. 캘린더 관련 화면(Task 015)을 구현할 때 이 진단이 나오면 라이브러리 자체 동작이므로 `Suspense` 경계 또는 지연 평가로 대응하고, 무리하게 `cacheComponents`를 끄지 말 것(다른 페이지의 PPR 이점에 영향).

## 8. 데이터 접근 계층 규칙

- 컴포넌트/페이지에서 `supabase.from(...)`을 **직접 호출하지 말 것**. 반드시 `lib/queries/*.ts`(예: `lib/queries/outfits.ts`)를 경유한다(Task 010부터 적용, Phase 3 전 화면에 필수).
- 쿼리 계층(`lib/queries/*`)은 **서버 전용**이다. `lib/supabase/server.ts`의 클라이언트만 사용하고 클라이언트 컴포넌트에서 import하지 않는다.
- Storage 업로드/삭제(`lib/storage/upload.ts`)는 **브라우저 클라이언트**(`lib/supabase/client.ts`)로만 수행한다. 서버 클라이언트로 Storage 업로드를 시도하지 말 것.
- 업로드 경로 규칙: `{user_id}/{uuid}.webp` (버킷: `outfit-photos`, `item-photos`).

## 9. 워크플로우 규칙

- `docs/ROADMAP.md`의 Task를 완료하면 해당 Task 제목 뒤에 `✅ - 완료`를 붙이고 하위 체크리스트·DoD 항목을 `- [x]`로 표시한다. 상단 "현재 코드베이스 상태" 표와 하단 "진행 현황 요약" 표, "다음 실행 작업" 줄도 함께 갱신한다.
- API/비즈니스 로직이 포함된 Task는 Playwright MCP 기반 "테스트 체크리스트"를 반드시 수행한 뒤 완료로 표시한다.
- 커밋 메시지는 `<이모지> <타입>: <설명>` 컨벤션(예: `✨ feat: ...`, `📝 docs: ...`, `🔧 chore: ...`)을 따르며, 서로 다른 관심사(기능 추가 vs 설정 수정 vs 문서 갱신)는 별도 커밋으로 분리한다.
- 사용자가 명시적으로 요청하지 않는 한 `git commit`을 실행하지 않는다.

## 10. 금지 행위

- `docs/guides/*.md`의 코드 예시를 실제 코드 확인 없이 그대로 붙여넣지 말 것(3절).
- `app/`, `components/`, `lib/` 하위에 `src/` 경로를 새로 만들지 말 것(2절).
- `dark:` 클래스, `next-themes`, 다크모드 토글 UI를 추가하지 말 것(6절).
- `components/ui/*.tsx`를 수동으로 새로 작성하지 말 것 — shadcn CLI로 설치할 것(6절).
- `lib/supabase/types.ts`를 손으로 편집하지 말 것 — MCP로 재생성할 것(5절).
- 컴포넌트에서 `supabase.from()`을 직접 호출하지 말 것(8절).
- `app/protected/`, `components/tutorial/`, `hero.tsx`, `next-logo.tsx`, `supabase-logo.tsx`, `deploy-button.tsx`, `theme-switcher.tsx` 등 스타터킷 잔재 패턴을 새 코드의 참고 예시로 삼지 말 것(이미 정리 완료된 코드).
- `lib/constants/category.ts` 외 다른 파일에 카테고리 값을 하드코딩하지 말 것(5절).
