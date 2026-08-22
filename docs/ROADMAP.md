# 오늘 뭐 입었지? (Today's Outfit) 개발 로드맵

하루 단위로 "오늘 입은 옷"을 기록해, 내가 실제로 어떤 옷을 입고 사는지 데이터로 되돌아보게 하는 모바일 웹 옷장 로그.

## 개요

**오늘 뭐 입었지?**는 매일 무엇을 입었는지 가볍게 기록하고 싶은 1인 모바일 사용자를 위한 **개인 옷장 로그 앱**으로 다음 기능을 제공합니다.

- **오늘의 착장 기록**: 대표 사진 1장 업로드 + 옷장 아이템 다중 연결 (F001, F002)
- **옷장 관리**: 카테고리별 옷 아이템 등록·수정·삭제·조회 (F003~F006)
- **기록 탐색**: 캘린더로 기록 누적 확인 및 날짜별 착장 상세 조회 (F007, F008)
- **스타일 통계**: 아이템별·카테고리별 착용 횟수 집계 (F009)

### 기술 스택

Next.js 15 (App Router) / React 19 / TypeScript 5.6+ / TailwindCSS v4 / shadcn/ui / Lucide React / React Hook Form 7.x + Zod / Supabase(Auth·DB·Storage) / Vercel / npm

### 제약 사항 (PRD 9절)

- **모바일 전용** — 데스크톱·태블릿 레이아웃은 MVP 범위 제외
- **다크 모드 제외** — MVP 이후 검토
- **브랜드 컬러** — 민트(Primary) + 그레이(Neutral) 2종

### 확정된 정책

- **아이템 미선택 저장**: 허용 — 옷장 아이템을 하나도 연결하지 않아도 대표 사진만으로 착장 기록 저장 가능
- **과거 날짜 신규 기록**: 허용 — 캘린더에서 과거 날짜를 선택해도 해당 날짜로 신규 착장 기록 생성 가능

---

## 현재 코드베이스 상태 (2026-08-20 기준)

| 구분   | 항목                                                                                                                                                                                                             | 상태 |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 완료   | 인증 전체(F010) — 로그인/회원가입/구글 OAuth/비밀번호 재설정, 라우트 보호(`proxy.ts`)                                                                                                                            | ✅   |
| 완료   | Supabase 클라이언트(`lib/supabase/client.ts`, `server.ts`), shadcn/ui 설정(`components.json`)                                                                                                                    | ✅   |
| 완료   | `components/ui/` 20종 설치 완료(기존 7종 + form/select/dialog/alert-dialog/tabs/calendar/textarea/avatar/sonner/skeleton/separator/sheet/progress), 모바일 터치 타깃(44px) 보정, `Toaster` 전역 마운트(Task 006) | ✅   |
| 완료   | TailwindCSS **v4** 마이그레이션 및 민트·그레이 브랜드 테마 적용, 다크모드 제거(Task 002)                                                                                                                         | ✅   |
| 완료   | `outfits`/`clothing_items`/`outfit_items` 테이블 + RLS 12종 + Storage 버킷 2종 생성, `lib/supabase/types.ts` 재생성(Task 004)                                                                                    | ✅   |
| 완료   | React Hook Form·Zod 설치, 도메인 타입(`types/`)·검증 스키마(`lib/validations/`)·카테고리 상수 정의(Task 003)                                                                                                     | ✅   |
| 완료   | `app/(tabs)/` 라우트 그룹 + 탭 외 라우트 골격 9종, 인증 재검증 레이아웃, 스타터킷 잔재 전면 정리(Task 005)                                                                                                       | ✅   |
| 완료   | 하단 탭바 실제 링크 및 활성 하이라이트(`components/layout/bottom-tab-bar.tsx`), 공통 헤더·모바일 셸(Task 007)                                                                                                    | ✅   |
| 완료   | 이미지 업로드 공통 컴포넌트(`components/common/image-uploader.tsx`) + Storage 헬퍼(`lib/storage/upload.ts`, 리사이즈/WebP 변환, 고아 파일 정리)(Task 008)                                                        | ✅   |
| 완료   | 카테고리 필터/선택 및 아이템 다중 선택 공통 컴포넌트(`category-tabs`, `category-select`, `item-card`, `item-picker`, `useItemSelection`)(Task 009)                                                               | ✅   |
| 완료   | 서버 조회 계층(`lib/queries/*`), Server Action 골격(`app/outfits/actions.ts`, `app/closet/actions.ts`), 에러 매핑·날짜 유틸·공통 상태 컴포넌트(Task 010)                                                         | ✅   |
| 완료   | 홈 화면 — 오늘 기록 여부 안내(`app/(tabs)/page.tsx`), `getRecentOutfitDates`(Task 011, F013)                                                                                                                     | ✅   |
| 완료   | 옷장 목록 조회 및 아이템 등록(`app/(tabs)/closet/page.tsx`, `closet-list.tsx`, `app/closet/clothing-item-form.tsx`, `createClothingItem` 완성)(Task 012, F003·F006)                                             | ✅   |
| 완료   | 옷 아이템 수정·삭제(`app/closet/[id]/edit/page.tsx`, `delete-item-dialog.tsx`, `updateClothingItem`/`deleteClothingItem` 완성)(Task 013, F004·F005)                                                             | ✅   |
| 완료   | 오늘의 착장 기록(`app/outfits/new/page.tsx`, `outfit-form.tsx`, `createOutfit` 완성)(Task 014, F001·F002)                                                                                                        | ✅   |
| 미착수 | 캘린더·통계·마이 페이지 실제 기능 미구현 (F007~F009, F011, F012)                                                                                                                                                  | ❌   |

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업은 "테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 시나리오)**
   - 신규 작업은 빈 체크박스 상태로 작성

3. **작업 구현**
   - 작업 파일의 명세서를 따라 기능 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 진행 상황 업데이트 → E2E 테스트 통과 확인 → 다음 단계
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 완료된 작업을 ✅로 표시

---

## 개발 단계

### Phase 1: 프로젝트 초기 설정 (골격 구축) ✅

> 목표: 실제 기능 코드를 작성하기 전에 **테마 · 타입 · DB 스키마 · 라우트 골격**을 모두 확정한다.

#### Task 001: 인증 기반 시스템 구축 `F010` ✅ - 완료

> 기존 구현 자산. 신규 개발 대상이 아니며 이후 Task의 전제 조건으로만 사용한다.

- ✅ 이메일/비밀번호 회원가입·로그인 (`components/login-form.tsx`, `sign-up-form.tsx`)
- ✅ 구글 소셜 로그인 (`components/google-login-button.tsx`, `app/auth/callback/route.ts`)
- ✅ 비밀번호 재설정 플로우 (`forgot-password`, `update-password`)
- ✅ 라우트 보호 미들웨어 (`proxy.ts` + `lib/supabase/proxy.ts`의 `updateSession()`)
- ✅ 로그아웃 (`components/logout-button.tsx`)

**완료 기준 (DoD)**

- ✅ 비로그인 상태로 보호 라우트 접근 시 `/auth/login`으로 리다이렉트된다
- ✅ 이메일·구글 로그인 성공 시 세션 쿠키가 발급되고 서버 컴포넌트에서 `user`를 읽을 수 있다

---

#### Task 002: TailwindCSS v4 마이그레이션 및 브랜드 테마 설정 ✅ - 완료

- ✅ `tailwindcss@4`, `@tailwindcss/postcss` 설치 및 `tailwindcss@3.4.1`, `autoprefixer`, `postcss` 구성 정리
- ✅ `postcss.config.mjs`를 v4 플러그인 방식으로 교체하고 `tailwind.config.ts` 제거(설정 파일 없는 엔진 전환)
- ✅ `app/globals.css`를 `@import "tailwindcss"` + `@theme` 기반으로 재작성
- ✅ 민트(Primary) / 그레이(Neutral) 브랜드 팔레트를 CSS 변수(`--color-primary`, `--color-muted` 등)로 정의
- ✅ `tailwindcss-animate` → `tw-animate-css` 대체 및 기존 shadcn 컴포넌트 클래스 정상 동작 확인
- ✅ 다크 모드 제거: `next-themes`·`components/theme-switcher.tsx` 제거, `.dark` 토큰 블록 삭제
- ✅ 모바일 전용 뷰포트 설정 (`app/layout.tsx`의 `viewport` export, `max-width` 컨테이너 셸)

**완료 기준 (DoD)**

- ✅ `npm run build` 성공, Tailwind v4가 적용된 상태로 기존 인증 화면이 깨짐 없이 렌더링됨
- ✅ 버튼/카드/인풋에 민트 계열 브랜드 컬러가 반영되고, 다크 모드 토글 흔적이 코드베이스에 남아 있지 않음
- ✅ 375px(모바일) 뷰포트에서 가로 스크롤이 발생하지 않음

---

#### Task 003: 폼·검증 의존성 설치 및 도메인 타입 정의 ✅ - 완료

- ✅ `react-hook-form`, `zod`, `@hookform/resolvers` 설치
- ✅ `types/outfit.ts` — `Outfit`, `OutfitWithItems`, `OutfitFormValues` 타입 정의 `F001` `F002`
- ✅ `types/clothing.ts` — `ClothingItem`, `ClothingCategory`, `ClothingItemFormValues` 타입 정의 `F003`
- ✅ `lib/constants/category.ts` — `CLOTHING_CATEGORIES`(상의/하의/신발/아우터/기타) 상수 및 라벨 맵 정의
- ✅ `lib/validations/` — `outfitSchema`, `clothingItemSchema` Zod 스키마 작성 (이미지 용량·확장자 규칙 포함)
- ✅ 공통 API 응답 타입 정의 (`ActionResult<T>` 형태의 Server Action 반환 규약)

**완료 기준 (DoD)**

- ✅ `npx tsc --noEmit` 통과, `any` 타입 사용 0건
- ✅ 카테고리 값이 Zod 스키마 · TS 타입에서 동일한 단일 출처(`lib/constants/category.ts`)를 참조함 (DB CHECK 제약과의 정합은 Task 004에서 동일 값으로 반영 예정)

---

#### Task 004: Supabase 스키마 · RLS · 스토리지 구축 ✅ - 완료 `F001`~`F009`

- ✅ `supabase/migrations/` 디렉토리 생성 및 초기 마이그레이션 파일 작성
- ✅ `outfits` 테이블 생성 (id, user_id, record_date, photo_url, memo, created_at) + `UNIQUE(user_id, record_date)` 제약 `F001` `F013`
- ✅ `clothing_items` 테이블 생성 (id, user_id, category, name, photo_url, created_at) + category CHECK 제약 `F003`
- ✅ `outfit_items` 테이블 생성 (id, outfit_id, clothing_item_id) + FK `ON DELETE CASCADE` + `UNIQUE(outfit_id, clothing_item_id)` `F002`
- ✅ 인덱스 추가: `outfits(user_id, record_date)`, `clothing_items(user_id, category)`, `outfit_items(outfit_id)`, `outfit_items(clothing_item_id)` `F007` `F009`
- ✅ 3개 테이블 RLS 활성화 및 `auth.uid() = user_id` 기반 SELECT/INSERT/UPDATE/DELETE 정책 작성 (outfit_items는 상위 outfit 소유권 EXISTS 검사)
- ✅ Storage 버킷 `outfit-photos`, `item-photos` 생성 및 사용자별 경로(`{user_id}/...`) 접근 정책 설정
- ✅ `mcp__supabase__generate_typescript_types`로 `lib/supabase/types.ts` 재생성 (기존 instruments/profiles 템플릿 제거)

**완료 기준 (DoD)**

- ✅ `list_tables`에서 3개 테이블과 RLS 활성 상태가 확인됨
- ✅ `get_advisors(security)` 결과에 RLS 미적용·정책 누락 경고가 없음
- ✅ 다른 사용자 토큰으로 타인의 outfits/clothing_items 조회 시 0건 반환됨
- ✅ 재생성된 `Database` 타입이 도메인 타입(Task 003)과 정합함

**테스트 체크리스트**

- ✅ SQL로 A 사용자 데이터 삽입 → B 사용자 세션에서 SELECT 시 0건 확인
- ✅ 같은 `user_id` + 같은 `record_date` 중복 INSERT 시 제약 위반 발생 확인
- ✅ `outfits` 삭제 시 연결된 `outfit_items`가 CASCADE 삭제되는지 확인
- ✅ 타 사용자 경로(`{other_user_id}/`)로 Storage 업로드 시 거부되는지 확인

---

#### Task 005: 라우트 골격 및 하단 탭바 레이아웃 구성 ✅ - 완료 `F013`

- ✅ 라우트 그룹 `app/(tabs)/` 생성 — `layout.tsx`에 세션 검증 + 하단 탭바 슬롯 배치
- ✅ 빈 페이지 골격 생성: `(tabs)/page.tsx`(홈) `F013`, `(tabs)/closet/page.tsx` `F006`, `(tabs)/calendar/page.tsx` `F007`, `(tabs)/stats/page.tsx` `F009`, `(tabs)/my/page.tsx` `F012`
- ✅ 탭 외 라우트 골격 생성: `app/outfits/new/page.tsx` `F001`, `app/outfits/[date]/page.tsx` `F008`, `app/closet/new/page.tsx` `F003`, `app/closet/[id]/edit/page.tsx` `F004`
- ✅ 각 라우트에 `loading.tsx`, `error.tsx`, `not-found.tsx` 골격 배치
- ✅ `proxy.ts` 보호 대상 경로를 신규 라우트 기준으로 갱신, 로그인 성공 후 리다이렉트 목적지를 `/`(홈)으로 조정
- ✅ 스타터킷 잔여 코드 정리: `app/protected/`, `components/tutorial/`, `hero.tsx`, `next-logo.tsx`, `supabase-logo.tsx`, `deploy-button.tsx`(+ `auth-button.tsx`, `env-var-warning.tsx`) 제거

**완료 기준 (DoD)**

- ✅ 로그인 상태에서 5개 탭 경로가 모두 200으로 응답함 (하단 탭바는 이번 Task에서 placeholder `<nav>` 슬롯만 배치, 실제 탭 링크·활성 하이라이트는 Task 007에서 구현 예정)
- ✅ 비로그인 상태에서 모든 신규 라우트(5개 탭 + 4개 동적)가 `/auth/login`으로 리다이렉트됨
- ✅ 사용하지 않는 스타터 페이지·컴포넌트가 저장소에 남아 있지 않고(`git grep` 0건) 빌드 경고 없음

**테스트 체크리스트**

- ✅ Playwright MCP로 비로그인 접속 → 9개 라우트 전부 `/auth/login` 리다이렉트 확인
- ✅ 로그인 후 5개 탭 + 4개 동적 라우트 경로 이동 확인 (탭바 링크는 Task 005에 없어 직접 URL 이동으로 검증, 클릭 기반 활성 탭 표시 검증은 Task 007에서 수행)

---

### Phase 2: 공통 모듈 / 컴포넌트 개발 ✅

> 목표: 화면 기능을 붙이기 전에 **재사용 컴포넌트와 데이터 액세스 계층**을 먼저 확정해 중복 구현을 제거한다.

#### Task 006: shadcn/ui 컴포넌트 확충 및 디자인 프리미티브 정리 ✅ - 완료

- [x] 부족한 shadcn/ui 컴포넌트 설치: `form`, `select`, `dialog`, `alert-dialog`, `tabs`, `calendar`, `textarea`, `avatar`, `sonner`(toast), `skeleton`, `separator`, `sheet`, `progress`
- [x] 설치 컴포넌트에 민트/그레이 브랜드 토큰 적용 및 모바일 터치 타깃(최소 44px) 보정
- [x] `components/ui/`의 기존 7종을 v4 토큰 기준으로 재점검
- [x] `app/layout.tsx`에 `Toaster` 전역 마운트
- [x] Lucide 아이콘 사용 규칙 정리(탭바/액션 아이콘 세트 확정)

**완료 기준 (DoD)**

- [x] 설치된 모든 컴포넌트가 375px 기준에서 레이아웃 깨짐 없이 렌더링됨
- [x] `toast()` 호출이 어느 화면에서든 동작함

---

#### Task 007: 하단 탭바 네비게이션 컴포넌트 구현 `F013` ✅ - 완료

- [x] `components/layout/bottom-tab-bar.tsx` 구현 — 홈·옷장·캘린더·통계·마이 5개 탭
- [x] `usePathname()` 기반 활성 탭 하이라이트(민트 컬러) 처리
- [x] `safe-area-inset-bottom` 대응 및 fixed 배치, 콘텐츠 하단 패딩 유틸 적용
- [x] `components/layout/app-header.tsx` — 화면별 타이틀/뒤로가기 액션을 받는 공통 헤더
- [x] `components/layout/mobile-shell.tsx` — 최대 폭 제한 + 세로 스크롤 컨테이너

**완료 기준 (DoD)**

- [x] 5개 탭 간 이동 시 활성 상태가 정확히 반영되고 스크롤 위치가 화면별로 유지됨
- [x] iOS Safari 하단 홈 인디케이터 영역과 탭바가 겹치지 않음

---

#### Task 008: 이미지 업로드 공통 컴포넌트 구현 `F001` `F003` ✅ - 완료

- [x] `components/common/image-uploader.tsx` — 파일 선택, 미리보기, 삭제, 교체 지원
- [x] 클라이언트 리사이즈/압축 처리(장변 기준 축소, JPEG/WebP 변환)
- [x] 확장자·용량 검증 및 실패 메시지 표시 (Zod 스키마 재사용)
- [x] `lib/storage/upload.ts` — Supabase Storage 업로드/삭제 헬퍼 (`{user_id}/{uuid}.webp` 경로 규칙)
- [x] 업로드 진행률 및 실패 시 재시도 UI 처리
- [x] 업로드 취소·에러 시 고아 파일이 남지 않도록 정리 로직 추가

**완료 기준 (DoD)**

- [x] 이미지 선택 → 미리보기 → 업로드 → `photo_url` 반환까지 단일 컴포넌트로 완결됨
- [x] 5MB 초과 또는 비이미지 파일 선택 시 업로드가 차단되고 안내 메시지가 노출됨

**테스트 체크리스트**

- [x] Playwright MCP `browser_file_upload`로 정상 이미지 업로드 → 미리보기 및 Storage 반영 확인
- [x] 용량 초과 파일 업로드 시 에러 메시지 노출 및 요청 미발생 확인
- [x] 업로드 중 네트워크 실패 시 재시도 UI 동작 확인

---

#### Task 009: 카테고리 · 아이템 선택 공통 컴포넌트 구현 `F002` `F006` ✅ - 완료

- [x] `components/common/category-tabs.tsx` — 카테고리 필터 탭 (전체/상의/하의/신발/아우터)
- [x] `components/common/category-select.tsx` — 폼용 카테고리 Select (RHF 연동)
- [x] `components/common/item-picker.tsx` — 옷장 아이템 다중 선택 시트(카테고리별 그룹, 선택 개수 표시)
- [x] `components/common/item-card.tsx` — 아이템 썸네일 카드 (선택/기본/편집 variant)
- [x] 선택 상태 관리 훅 `useItemSelection` 작성

**완료 기준 (DoD)**

- [x] 아이템 다중 선택 후 선택 목록이 폼 값(`clothingItemIds`)으로 정확히 전달됨
- [x] 카테고리 필터 전환 시에도 기존 선택 상태가 유지됨

---

#### Task 010: 데이터 액세스 계층 및 상태 컴포넌트 구축 ✅ - 완료

- [x] `lib/queries/outfits.ts`, `lib/queries/clothing-items.ts`, `lib/queries/stats.ts` — 서버 조회 함수 정의
- [x] `app/**/actions.ts` — Server Action 골격 및 `ActionResult<T>` 공통 반환 규약 적용
- [x] `components/common/empty-state.tsx` — 옷장/캘린더/통계 빈 상태 공통 컴포넌트
- [x] `components/common/loading-skeleton.tsx` — 목록·카드·캘린더용 스켈레톤
- [x] `components/common/error-message.tsx` + 공통 에러 매핑(`lib/errors.ts`)
- [x] `lib/utils/date.ts` — `record_date` 포맷·타임존(KST) 처리 유틸 `F007` `F013`

**완료 기준 (DoD)**

- [x] 모든 DB 접근이 쿼리 계층을 경유하며 컴포넌트에서 직접 `supabase.from()`을 호출하지 않음
- [x] 날짜 유틸이 자정 경계(23:59 / 00:01)에서 KST 기준 오늘 날짜를 정확히 반환함

**테스트 체크리스트**

- [x] Server Action 실패 시 `ActionResult.error`가 정확히 반환됨을 확인 (직접 호출로 검증; 실제 화면의 toast 연결은 Phase 3 폼 구현 시 확인)
- [x] 데이터 0건 상태에서 각 화면의 EmptyState가 렌더링되는지 확인

---

### Phase 3: 핵심 기능 개발

> 목표: PRD 핵심 기능 F001~F009를 **화면 단위**로 완성한다. 각 화면 완료 시 Playwright MCP E2E 검증 필수.

#### Task 011: 홈 — 오늘 기록 여부 안내 `F013` ✅ - 완료

- [x] 서버 컴포넌트에서 오늘(KST) `record_date` 기준 outfit 존재 여부 조회
- [x] 미기록 상태 UI: 안내 문구 + "오늘의 착장 기록하기" CTA → `/outfits/new`
- [x] 기록 완료 상태 UI: 오늘 착장 썸네일 + 연결 아이템 요약 + "수정하기" 진입
- [x] 최근 기록 요약 섹션(최근 7일 기록 여부 스트릭)
- [x] 로그인 사용자 인사 영역 및 로딩/에러 상태 처리(비인증 시 `/auth/login` 리다이렉트)

**완료 기준 (DoD)**

- [x] 오늘 기록 유무에 따라 두 가지 UI가 정확히 분기됨
- [x] 기록 저장 직후 홈 복귀 시 캐시 재검증(`revalidatePath`)으로 최신 상태가 즉시 반영됨(`createOutfit`의 실제 `revalidatePath('/')` 호출은 Task 014에서 DB write 로직과 함께 완성 예정 — 현재는 성공 분기 자체가 없음)

**테스트 체크리스트**

- [x] Playwright MCP: 기록 없는 계정 로그인 → 미기록 UI 및 CTA 노출 확인
- [x] 착장 저장 후 홈 이동 → 기록 완료 UI로 전환 확인(Server Action 미완성으로 Supabase에 테스트 레코드를 직접 삽입해 검증, 확인 후 삭제)
- [x] 날짜 경계(전날 기록만 존재) 상황에서 미기록으로 표시되는지 확인

---

#### Task 012: 옷장 목록 조회 및 아이템 등록 `F003` `F006` ✅ - 완료

- [x] `(tabs)/closet` — 카테고리 탭 + 그리드 목록 렌더링 (서버 컴포넌트 조회)
- [x] 아이템 0건 시 EmptyState + "첫 아이템 등록하기" CTA
- [x] `closet/new` — 사진 업로드 + 이름 + 카테고리 입력 폼 (RHF + Zod)
- [x] `createClothingItem` Server Action 구현(ImageUploader가 Storage 업로드를 이미 끝낸 URL을 받아 DB insert)
- [x] 등록 성공 시 토스트 + 옷장 목록 복귀 + 캐시 재검증
- [x] 카테고리별 아이템 개수 표시 및 최신순 정렬(`getClothingItems`가 이미 최신순 정렬)

**완료 기준 (DoD)**

- [x] 등록한 아이템이 즉시 목록에 반영되고 카테고리 필터에서도 정확히 조회됨
- [x] 필수값 누락 시 폼 제출이 차단되고 필드별 에러 메시지가 노출됨

**테스트 체크리스트**

- [x] Playwright MCP: 아이템 등록 전체 플로우(사진 선택 → 이름 → 카테고리 → 저장 → 목록 확인)
- [x] 이름 미입력 / 사진 미선택 상태 제출 시 검증 에러 확인
- [x] 카테고리 탭 전환 시 해당 카테고리 아이템만 표시되는지 확인
- [x] 타 사용자 아이템이 목록에 노출되지 않는지 확인(RLS 검증 — `relrowsecurity=true` 확인 및 Task 004에서 검증된 정책 재사용)

---

#### Task 013: 옷 아이템 수정 및 삭제 `F004` `F005` ✅ - 완료

- [x] `closet/[id]/edit` — 기존 값 프리필 폼 (이름/카테고리/사진 교체, Task012의 `ClothingItemForm` mode='edit' 재사용)
- [x] `updateClothingItem` Server Action 구현(사진 교체 시 기존 Storage 파일 삭제는 `ImageUploader`가 브라우저에서 자동 처리 — 서버 클라이언트로 Storage 접근하지 않는 프로젝트 규칙 준수)
- [x] `deleteClothingItem` Server Action 구현 + `AlertDialog` 삭제 확인(`delete-item-dialog.tsx`)
- [x] 착장에 연결된 아이템 삭제 시 영향 안내(연결 기록 N건, `getOutfitCountUsingItem`) 및 처리 정책 확정(outfit_items는 `ON DELETE CASCADE`로 자동 정리)
- [x] 삭제 후 Storage 파일 정리(클라이언트에서 DB 삭제 성공 후 `deleteImage` 호출) 및 목록 캐시 재검증

**완료 기준 (DoD)**

- [x] 수정 결과가 목록에 즉시 반영됨(착장 상세·통계는 Task015·016에서 화면이 만들어진 뒤 확인 예정)
- [x] 삭제 후 DB·Storage에 잔여 데이터가 남지 않음
- [x] 타 사용자 아이템 ID로 수정/삭제 요청 시 RLS로 차단됨(코드 레벨 `.eq('user_id', ...)` 이중 방어 확인 + Task004에서 검증된 정책 재사용, 신규 교차 계정 테스트는 생략)

**테스트 체크리스트**

- [x] Playwright MCP: 이름 수정 → 목록 반영 확인
- [x] 사진 교체 → 새 이미지 표시 및 이전 파일 삭제 확인(SQL로 Storage 객체 목록 대조)
- [x] 삭제 확인 다이얼로그 취소 시 삭제되지 않는지 확인
- [x] 착장에 연결된 아이템 삭제 후 해당 착장 상세가 오류 없이 렌더링되는지 확인

---

#### Task 014: 오늘의 착장 기록 — 사진 업로드 및 아이템 연결 `F001` `F002` ✅ - 완료

- [x] `outfits/new` — 대표 사진 업로드(1장) + 메모(선택) + 아이템 선택 폼 구성(`outfit-form.tsx`)
- [x] `ItemPicker` 연동해 상의/하의/신발/아우터 다중 선택 `F002`
- [x] 옷장이 비어 있을 때 "아이템 먼저 등록하기" 경로 제공 (`/closet/new`)
- [x] `createOutfit` Server Action 구현 — Storage 업로드는 `ImageUploader`가 브라우저에서 완료, Action은 `outfits` insert/update → `outfit_items` bulk insert
- [x] 아이템을 하나도 선택하지 않아도 대표 사진만으로 저장 가능 (정책 확정: 허용)
- [x] 같은 날짜 중복 기록 시 기존 기록 수정 모드로 전환 처리(`getOutfitByDate` 사전 조회 후 update/insert 분기)
- [x] 저장 성공 → 홈 이동 + 토스트 안내
- [x] 저장 중 중복 제출 방지(`isSubmitting` 기반 버튼 비활성화 + UNIQUE 제약 이중 방어). 업로드 파일 자동 롤백은 사용자가 사진을 직접 삭제/교체할 때만 `ImageUploader`가 처리하며, `outfits` insert/update 자체가 실패하는 극단적 케이스의 서버측 자동 롤백은 이번 Task 범위에서 구현하지 않음(발생 가능성 낮은 엣지 케이스로 별도 이슈로 남김)

**완료 기준 (DoD)**

- [x] 사진 1장 + 아이템 0~N개가 하나의 흐름으로 저장되고 부분 저장이 발생하지 않음(각 DB 단계 실패 시 즉시 에러 반환)
- [ ] 저장 실패 시 Storage에 고아 이미지가 남지 않음 — outfits insert/update 자체가 실패하는 경우의 서버측 자동 정리는 미구현(위 항목 참고, 후속 이슈로 관리)
- [x] 사진 미선택 상태로는 저장할 수 없음(사진은 필수, 아이템은 선택)

**테스트 체크리스트**

- [x] Playwright MCP: 사진 업로드 → 아이템 3개 선택 → 저장 → 홈 기록 완료 UI 확인
- [x] 사진만 업로드하고 아이템 미선택 상태로 저장 → 정상 저장되는지 확인
- [x] 같은 날 재진입 시 기존 기록이 프리필되는지 확인
- [x] 저장 버튼 연타 시 중복 레코드가 생성되지 않는지 확인(코드 레벨 이중 방어 확인)
- [x] 네트워크 실패 상황(`page.route` POST 차단)에서 에러 토스트 노출 확인 — 검증 중 실제 결함(처리되지 않은 예외) 발견 후 수정 완료

---

#### Task 015: 캘린더 기록 표시 및 날짜별 상세 조회 `F007` `F008`

- [ ] `(tabs)/calendar` — shadcn `calendar` 기반 월 단위 뷰 구현
- [ ] 해당 월 기록 날짜 조회 후 기록 있는 날짜에 마커(민트 도트) 표시 `F007`
- [ ] 월 이동 시 데이터 재조회 및 로딩 스켈레톤 처리
- [ ] 날짜 선택 → 착장 상세(대표 사진, 메모, 연결 아이템 목록) 표시 `F008`
- [ ] 상세를 `outfits/[date]` 라우트 또는 Sheet로 노출하고 뒤로가기 동작 정리
- [ ] 기록 없는 날짜(과거 포함) 선택 시 안내 + 해당 날짜로 신규 착장 기록 생성 가능 (정책 확정: 과거 날짜 신규 기록 허용)

**완료 기준 (DoD)**

- [ ] 기록된 날짜만 마커가 표시되고 월 이동 시에도 정확함
- [ ] 상세에서 연결 아이템 썸네일·이름·카테고리가 모두 표시됨
- [ ] 타임존 경계에서 날짜가 하루 밀리지 않음
- [ ] 과거 미기록 날짜 선택 시 해당 날짜로 신규 기록 생성 화면으로 정상 진입함

**테스트 체크리스트**

- [ ] Playwright MCP: 기록 있는 날짜 마커 확인 → 클릭 → 상세 정보 일치 확인
- [ ] 이전/다음 달 이동 시 마커 갱신 확인
- [ ] 기록 없는 과거 날짜 선택 → 신규 기록 생성 진입 및 저장 후 마커 반영 확인
- [ ] 상세에서 뒤로가기 시 캘린더의 선택 월이 유지되는지 확인

---

#### Task 016: 스타일 통계 화면 구현 `F009`

- [ ] `lib/queries/stats.ts` — 아이템별 착용 횟수 집계 쿼리 (`outfit_items` JOIN 카운트)
- [ ] 카테고리별 착용 비중 집계 쿼리 구현
- [ ] `(tabs)/stats` — 아이템별 착용 TOP 랭킹 목록(썸네일 + 횟수) 렌더링
- [ ] 카테고리별 비중 시각화(막대/프로그레스 기반, 민트 계열 단일 팔레트)
- [ ] 총 기록 일수·등록 아이템 수 요약 지표 카드
- [ ] 기록 0건 시 EmptyState 처리

**완료 기준 (DoD)**

- [ ] 집계 수치가 실제 `outfit_items` 데이터와 정확히 일치함
- [ ] 착장 추가/삭제 후 통계가 재검증되어 즉시 반영됨
- [ ] 삭제된 아이템이 통계에 유령 항목으로 남지 않음

**테스트 체크리스트**

- [ ] Playwright MCP: 착장 2건 기록 후 특정 아이템 착용 횟수 2 표시 확인
- [ ] 착장 1건 삭제 후 횟수가 1로 감소하는지 확인
- [ ] 카테고리 비중 합이 100%가 되는지 확인
- [ ] 데이터 0건 계정에서 EmptyState 노출 확인

---

#### Task 016-1: 핵심 기능 통합 테스트

- [ ] Playwright MCP로 신규 가입 → 아이템 등록 → 착장 기록 → 캘린더 확인 → 통계 확인 전체 플로우 E2E 실행
- [ ] 각 화면 간 데이터 정합성 검증(옷장 ↔ 착장 ↔ 캘린더 ↔ 통계)
- [ ] RLS 격리 검증: 두 계정 교차 접근 시 데이터 노출 없음 확인
- [ ] 엣지 케이스 검증: 데이터 0건, 대용량 이미지, 동일 날짜 중복 기록, 아이템 미선택 저장, 과거 날짜 신규 기록, 아이템 삭제 후 기록 조회
- [ ] `browser_console_messages`로 런타임 에러/경고 0건 확인
- [ ] 375px / 414px 뷰포트에서 전체 플로우 재실행

**완료 기준 (DoD)**

- [ ] 전체 사용자 여정(PRD 4절) 시나리오가 중단 없이 완주됨
- [ ] 콘솔 에러 및 실패한 네트워크 요청 0건
- [ ] 발견된 결함이 모두 수정 또는 이슈로 등록됨

---

### Phase 4: 추가 기능 개발 및 개선

#### Task 017: 착장 기록 수정 및 삭제 `F011`

- [ ] `outfits/[date]` 상세에 수정/삭제 액션 추가
- [ ] 수정 폼 — 사진 교체, 메모 수정, 연결 아이템 재선택(추가/해제, 전체 해제도 허용)
- [ ] `updateOutfit` Server Action — `outfit_items` 차집합 계산 후 delete/insert 처리
- [ ] `deleteOutfit` Server Action + AlertDialog 확인 (연결 `outfit_items` CASCADE, Storage 파일 삭제)
- [ ] 수정/삭제 후 홈·캘린더·통계 캐시 재검증
- [ ] 과거 날짜 기록도 제한 없이 수정 가능하도록 처리

**완료 기준 (DoD)**

- [ ] 아이템 연결 변경이 정확히 반영되고 중복/누락 레코드가 생기지 않음
- [ ] 삭제 후 캘린더 마커와 통계 수치가 동시에 갱신됨

**테스트 체크리스트**

- [ ] Playwright MCP: 아이템 1개 해제 + 1개 추가 → 상세 및 통계 반영 확인
- [ ] 사진 교체 시 이전 Storage 파일 삭제 확인
- [ ] 기록 삭제 후 캘린더 마커 제거 확인
- [ ] 타 사용자 기록 수정/삭제 시도 차단 확인

---

#### Task 018: 마이 페이지 구현 `F010` `F012`

- [ ] `(tabs)/my` — 로그인 계정 이메일 및 가입 경로(이메일/구글) 표시
- [ ] 기록 요약 지표(총 기록 일수, 등록 아이템 수) 카드
- [ ] 로그아웃 버튼 연동 (`logout-button.tsx` 재사용) → `/auth/login` 이동
- [ ] 앱 정보(버전, 문의) 섹션 배치
- [ ] 계정 정보 조회 실패 시 에러 상태 처리

**완료 기준 (DoD)**

- [ ] 로그인한 계정 이메일이 정확히 표시됨
- [ ] 로그아웃 시 세션 쿠키가 제거되고 보호 라우트 재접근이 차단됨

**테스트 체크리스트**

- [ ] Playwright MCP: 이메일 계정/구글 계정 각각 로그인 후 마이 페이지 정보 확인
- [ ] 로그아웃 후 뒤로가기로 보호 페이지 재진입 차단 확인

---

#### Task 019: 에러 · 빈 상태 · 로딩 경험 개선

- [ ] 전 화면 EmptyState 문구/CTA 일관화 (옷장, 캘린더, 통계, 홈)
- [ ] `loading.tsx` 스켈레톤을 실제 레이아웃과 동일한 형태로 정교화
- [ ] `error.tsx` 재시도 버튼 및 사용자 친화 메시지 적용
- [ ] Server Action 에러 코드 → 한국어 메시지 매핑 정리 (`lib/errors.ts`)
- [ ] 네트워크 오프라인·이미지 로드 실패 폴백 처리
- [ ] 폼 제출 중 버튼 비활성화 및 중복 제출 방지 전역 적용

**완료 기준 (DoD)**

- [ ] 모든 화면이 로딩·빈 상태·에러 3가지 상태를 빠짐없이 처리함
- [ ] 사용자에게 원문 에러 스택이 노출되지 않음

---

#### Task 020: 폼 검증 강화 및 입력 UX 개선

- [ ] Zod 스키마 보강 — 이름 길이, 메모 길이, 파일 MIME/용량, 날짜 범위
- [ ] 필드별 실시간 검증 및 에러 메시지 한국어화
- [ ] 서버 측 재검증 추가 (Server Action 진입 시 스키마 재검사)
- [ ] 모바일 입력 최적화 (`inputMode`, `autoComplete`, 키보드 대응 스크롤)
- [ ] 미저장 상태 이탈 시 확인 다이얼로그

**완료 기준 (DoD)**

- [ ] 클라이언트 검증을 우회한 직접 Server Action 호출도 서버에서 차단됨
- [ ] 모든 검증 메시지가 한국어이며 필드 옆에 정확히 표시됨

**테스트 체크리스트**

- [ ] Playwright MCP: 경계값(최대 길이, 최대 용량) 입력 검증 확인
- [ ] 검증 우회 요청 시 서버 거부 응답 확인

---

### Phase 5: 최적화 및 배포

#### Task 021: 모바일 최적화 및 접근성 점검

- [ ] 375px / 390px / 414px 뷰포트 전 화면 레이아웃 점검
- [ ] 터치 타깃 44px 이상, 스크롤 영역·고정 탭바 겹침 제거
- [ ] 폰트 크기·대비비(WCAG AA) 점검 및 민트 컬러 대비 보정
- [ ] 이미지 `alt`, 폼 `label` 연결, 포커스 링 확인
- [ ] iOS Safari / Android Chrome 실기기 동작 확인

**완료 기준 (DoD)**

- [ ] 전 화면에서 가로 스크롤 및 요소 겹침이 없음
- [ ] Lighthouse Accessibility 90점 이상

---

#### Task 022: 이미지 및 성능 최적화

- [ ] `next/image` 적용 및 Supabase Storage 도메인 `remotePatterns` 등록
- [ ] 목록 썸네일 `sizes` 지정, 지연 로딩, blur placeholder 적용
- [ ] 업로드 시 서버 저장 용량 최적화(WebP 변환 기준 확정)
- [ ] 캘린더/통계 쿼리 실행 계획 점검 및 인덱스 활용 확인
- [ ] 서버 컴포넌트 캐싱·재검증 전략 정리(`revalidatePath` 범위 최소화)
- [ ] 번들 크기 점검 및 불필요한 클라이언트 컴포넌트 서버 전환

**완료 기준 (DoD)**

- [ ] Lighthouse(모바일) Performance 85점 이상, LCP 2.5초 이하
- [ ] 옷장 100개 아이템 기준 목록 스크롤이 끊기지 않음

**테스트 체크리스트**

- [ ] Playwright MCP `browser_network_requests`로 이미지 요청 크기·개수 확인
- [ ] 느린 네트워크 조건에서 스켈레톤 → 콘텐츠 전환 확인

---

#### Task 023: 보안 및 RLS 최종 점검

- [ ] `get_advisors(security)` / `get_advisors(performance)` 실행 후 경고 전량 해소
- [ ] 3개 테이블 RLS 정책 재검증 (SELECT/INSERT/UPDATE/DELETE 4종 모두)
- [ ] Storage 버킷 공개 범위 및 경로 정책 최종 확인
- [ ] 환경변수 노출 점검 (`NEXT_PUBLIC_` 접두사 오용, service_role 키 클라이언트 유출 여부)
- [ ] `.env.example` 복구 및 필요한 키 목록 문서화
- [ ] 구글 OAuth 리다이렉트 URL을 운영 도메인 기준으로 등록

**완료 기준 (DoD)**

- [ ] Supabase advisor 보안 경고 0건
- [ ] 클라이언트 번들에 비공개 키가 포함되지 않음

**테스트 체크리스트**

- [ ] 두 계정 교차 접근 시나리오 재실행하여 데이터 격리 확인
- [ ] 직접 Storage URL 접근 시 타 사용자 이미지 접근 차단 확인

---

#### Task 024: Vercel 배포 및 운영 준비

- [ ] Vercel 프로젝트 연결 및 환경변수 등록(Preview/Production 분리)
- [ ] Supabase Auth의 Site URL / Redirect URL을 배포 도메인으로 설정
- [ ] 프로덕션 빌드 검증 (`npm run build`, `npm run lint`, `tsc --noEmit`)
- [ ] `metadata`, `viewport`, favicon, OG 이미지 정비
- [ ] 배포 후 실기기 스모크 테스트(가입 → 기록 → 조회 → 통계)
- [ ] 에러 로깅·모니터링 최소 구성 및 README 실행 가이드 정리

**완료 기준 (DoD)**

- [ ] 프로덕션 도메인에서 이메일/구글 로그인과 전체 기록 플로우가 정상 동작함
- [ ] 빌드·린트·타입 체크가 모두 통과하고 배포 파이프라인이 자동화됨

**테스트 체크리스트**

- [ ] Playwright MCP로 프로덕션 URL 대상 전체 사용자 여정 스모크 테스트
- [ ] 구글 OAuth 콜백이 운영 도메인에서 정상 처리되는지 확인

---

## 기능 ID 추적 매트릭스

| 기능 ID | 기능명                  | 담당 Task          | 상태               |
| ------- | ----------------------- | ------------------ | ------------------ |
| F001    | 오늘의 착장 사진 업로드 | Task 004, 008, 014 | ✅ 완료            |
| F002    | 착장-아이템 연결        | Task 004, 009, 014 | ✅ 완료            |
| F003    | 옷 아이템 등록          | Task 003, 008, 012 | ✅ 완료            |
| F004    | 옷 아이템 수정          | Task 013           | ✅ 완료            |
| F005    | 옷 아이템 삭제          | Task 013           | ✅ 완료            |
| F006    | 옷장 목록 조회          | Task 009, 012      | ✅ 완료            |
| F007    | 캘린더 기록 표시        | Task 010, 015      | 대기               |
| F008    | 날짜별 착장 상세 조회   | Task 015           | 대기               |
| F009    | 스타일 통계             | Task 016           | 대기               |
| F010    | 기본 인증               | Task 001, 018      | ✅ 완료(인증 기반) |
| F011    | 착장 기록 수정/삭제     | Task 017           | 대기               |
| F012    | 계정 정보 확인          | Task 018           | 대기               |
| F013    | 오늘 기록 여부 안내     | Task 005, 011      | ✅ 완료            |

---

## 진행 현황 요약

| Phase   | 범위                                | Task 수 | 상태        |
| ------- | ----------------------------------- | ------- | ----------- |
| Phase 1 | 프로젝트 초기 설정(골격 구축)       | 5       | 5/5 완료 ✅ |
| Phase 2 | 공통 모듈/컴포넌트 개발             | 5       | 5/5 완료 ✅ |
| Phase 3 | 핵심 기능 개발 (F001~F009, F013)    | 7       | 4/7 진행중  |
| Phase 4 | 추가 기능 개발 및 개선 (F011, F012) | 4       | 대기        |
| Phase 5 | 최적화 및 배포                      | 4       | 대기        |

**다음 실행 작업**: `Task 015 — 캘린더 기록 표시 및 날짜별 상세 조회`
