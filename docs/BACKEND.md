# 오늘 뭐 입었지? 백엔드 설계 문서 (비개발자용)

> 이 문서는 다시 봐도 이해할 수 있도록, 어려운 용어는 최대한 쉬운 말로 풀어 썼습니다.
> 기준 시점: `docs/ROADMAP.md` 기준 **Phase 1~4 전부 완료**, Phase 5(최적화·배포)도 **Task 024(Vercel 배포)까지 마쳐** 실제 서비스가 **`https://todays-outfit-nine.vercel.app/`** 에서 운영 중입니다. PRD의 핵심 기능 F001~F013이 전부 구현되어, "옷 등록 → 오늘 착장 기록 → 캘린더 확인 → 통계 확인"까지 처음부터 끝까지 실제로 동작합니다.

## 1. 한눈에 보는 구조

이 앱은 자체 서버를 두지 않고, **Supabase**라는 서비스 하나가 "로그인 처리 + 데이터 저장소 + 사진 저장소" 세 가지 역할을 모두 대신해 줍니다. 서비스는 **Vercel**이라는 곳에 올라가 있어서, 사용자는 앱을 설치하지 않고 브라우저 주소창에 URL만 입력하면 바로 사용할 수 있습니다.

데이터가 흘러가는 순서는 대략 이렇습니다.

1. **로그인**: 사용자가 이메일/비밀번호 또는 구글 계정으로 로그인하면, Supabase가 신원을 확인하고 브라우저에 "세션 쿠키(로그인 상태를 기억하는 작은 열쇠)"를 발급합니다.
2. **매 요청마다 문지기 확인**: 사용자가 어떤 페이지로 이동할 때마다 `proxy.ts`(루트, Next.js가 요청을 가로채 먼저 검사하는 문지기 코드)가 실행되고, 내부적으로 `lib/supabase/proxy.ts`의 `updateSession()`을 호출합니다. 이 문지기는 요청 경로가 정확히 `/`(홈 주소 자체)이거나 `/auth`로 시작하는 경우(로그인/회원가입/비밀번호 재설정 화면)만 로그인 없이 통과시키고, **그 외 모든 경로(옷장·캘린더·통계·마이 페이지, 착장 기록 화면 등)는 로그인 세션이 없으면 `/auth/login`으로 돌려보냅니다.** 검색엔진 크롤러가 파비콘·OG 이미지·`robots.txt`는 볼 수 있도록 이 경로들만 문지기 검사에서 예외 처리되어 있습니다.
3. **화면에서 데이터 조회 요청**: 로그인이 확인되면, 서버 컴포넌트(화면을 서버에서 미리 그려주는 코드)가 `lib/queries/` 안의 조회 함수를 통해 Supabase 데이터베이스에 "내 데이터를 보여줘"라고 요청합니다.
4. **보안 정책(RLS) 확인**: 데이터베이스는 요청을 받으면 "이 요청을 보낸 사람이 정말 이 데이터의 주인인가"를 자동으로 확인합니다(3절에서 자세히 설명). 주인이 아니면 아예 결과가 0건으로 나옵니다.
5. **데이터 반환 및 화면 표시**: 통과된 데이터만 화면에 표시됩니다.
6. **저장/수정/삭제(지금은 실제로 다 됩니다)**: 사용자가 사진을 올리거나 옷을 등록하는 것 같은 "쓰기" 작업은 두 단계로 나뉘어 처리됩니다.
   - **사진 업로드는 브라우저가 직접** Supabase Storage(사진 창고)로 보냅니다(`lib/storage/upload.ts`의 `uploadImage`). 이때 이미지를 장변 1280px로 줄이고 WebP 형식으로 압축해 용량을 아낍니다.
   - **데이터베이스 저장(옷 정보, 착장 기록)은 Server Action**(서버에서만 실행되는 저장 담당 함수, `app/outfits/actions.ts`·`app/closet/actions.ts`)이 담당합니다. 이 함수들은 입력값 검사 → 로그인 확인 → **실제 `insert`/`update`/`delete` 실행**까지 전 과정을 수행하며, 저장이 끝나면 `revalidatePath`로 관련 화면(홈·캘린더·통계 등)의 캐시를 갱신해 최신 상태가 즉시 반영되도록 합니다.

정리하면, **"조회(읽기)"와 "저장(쓰기)" 통로 모두 완전히 뚫려 있고, 실사용자가 실제로 데이터를 쌓고 있는 상태**입니다.

## 2. 데이터는 어디에 저장되나요? (테이블 소개)

테이블(엑셀 시트처럼 데이터를 행/열로 정리해 두는 것)은 3개가 만들어져 있습니다. 위치는 `supabase/migrations/20260820083353_create_outfit_tables.sql`입니다.

### outfits — 하루하루의 "오늘 착장" 기록을 저장하는 시트

- **저장하는 정보**: 기록 날짜(`record_date`), 대표 사진 경로(`photo_url`, 필수), 메모(`memo`, 선택 입력), 이 기록의 주인(`user_id`), 만든 시각(`created_at`)
- **다른 테이블과의 관계**: 한 사람(`user_id`)이 여러 개의 기록을 가질 수 있는 1:N 관계입니다. 단, **같은 사람이 같은 날짜에 2개를 만들 수는 없도록** `UNIQUE(user_id, record_date)` 제약(같은 값의 조합이 중복되지 못하게 막는 규칙)이 걸려 있습니다.
- **왜 이렇게 만들었나**: PRD가 "하루에 대표 착장 1건"을 원칙으로 하기 때문에(F013), 데이터베이스 차원에서부터 중복 기록이 물리적으로 불가능하게 설계했습니다. 실제로 `app/outfits/actions.ts`의 `createOutfit`은 저장 전에 `getOutfitByDate`로 같은 날짜 기록이 있는지 먼저 확인해, 있으면 새로 만들지 않고 기존 기록을 수정하는 방식으로 동작합니다.

### clothing_items — 옷장에 등록된 옷 하나하나를 저장하는 시트

- **저장하는 정보**: 카테고리(`category`: 상의/하의/신발/아우터/기타), 이름(`name`), 사진 경로(`photo_url`), 주인(`user_id`)
- **다른 테이블과의 관계**: 역시 한 사람이 여러 옷을 등록할 수 있는 1:N 관계입니다.
- **왜 이렇게 만들었나**: `category` 컬럼에는 `CHECK` 제약(정해진 값 외에는 저장을 거부하는 규칙)이 걸려 있어 `top/bottom/shoes/outer/etc` 다섯 가지 값 외에는 저장될 수 없습니다. 이 다섯 값은 코드 쪽 상수(`lib/constants/category.ts`)와 반드시 같은 값을 쓰도록 마이그레이션 파일 맨 위에 주석으로 명시되어 있습니다.
- **정직하게 알려드립니다(사진 필수 여부 변경)**: `supabase/migrations/...create_outfit_tables.sql` 파일에는 `photo_url text not null`(사진 필수)로 적혀 있지만, 개발 도중(ROADMAP Task 012) "옷 사진은 선택 사항으로 등록 가능"으로 정책이 바뀌면서 실제 데이터베이스는 사진 없이도 저장이 가능하도록 바뀌었습니다(`app/closet/actions.ts`의 `createClothingItem`이 `existing_photo_url ?? null`로 저장하고, `lib/supabase/types.ts`도 `photo_url: string | null`로 되어 있습니다). **다만 이 변경을 반영한 새 마이그레이션 파일이 저장소에 없어**, 지금 저장소의 SQL 파일과 실제 운영 중인 데이터베이스 구조가 완전히 일치하지 않는 부분입니다. 기능 자체는 정상 동작하지만, 스키마 이력 관리 관점에서는 확인·정리가 필요합니다.

### outfit_items — "오늘 착장"과 "옷장 아이템"을 서로 이어주는 연결 시트

- **저장하는 정보**: 어떤 착장 기록(`outfit_id`)에 어떤 옷 아이템(`clothing_item_id`)이 연결되어 있는지만 담습니다.
- **다른 테이블과의 관계**: 착장 1건에 옷 여러 개, 옷 1개가 여러 착장에 등장할 수 있는 **N:M(다대다) 관계**를 표현하는 중간 다리 역할입니다. `ON DELETE CASCADE`(부모 데이터가 지워지면 자식 데이터도 자동으로 함께 지워지는 규칙)가 걸려 있어서, 착장 기록이나 옷 아이템을 지우면 거기 연결된 이 다리 데이터도 자동으로 함께 정리됩니다. `UNIQUE(outfit_id, clothing_item_id)`로 같은 조합의 중복 저장도 막습니다.
- **왜 이렇게 만들었나**: "오늘 상의A + 하의B + 신발C를 입었다"처럼 여러 옷을 한 기록에 자유롭게 연결하는 F002 요구사항을 구현하려면 이런 다리 테이블이 필요합니다. `createOutfit` Server Action은 기존 기록을 수정할 때 이 테이블의 연결을 **전부 지운 뒤 새로 선택한 아이템으로 다시 채우는 방식**으로 "아이템 재선택"을 구현하고 있습니다.

### 인덱스(찾는 속도를 빠르게 해주는 색인)

실제 마이그레이션 파일 기준으로는 `clothing_items(user_id, category)`, `outfit_items(clothing_item_id)`에 별도 인덱스가 만들어져 있습니다. 여기에 더해 `outfits(user_id, record_date)`와 `outfit_items(outfit_id, clothing_item_id)`는 각각 `UNIQUE` 제약을 걸 때 자동으로 만들어지는 색인을 그대로 검색 속도 향상에도 사용하고 있습니다. ROADMAP Task 022에서 `EXPLAIN ANALYZE`(쿼리가 실제로 어떤 경로로 실행되는지 확인하는 명령)로 이 인덱스들이 실제 캘린더·옷장 조회에서 사용되는 것을 확인했습니다.

### Storage 버킷(사진 파일을 담는 창고)

`supabase/migrations/20260820083401_create_storage_buckets.sql`에서 `outfit-photos`(착장 사진용)와 `item-photos`(옷 아이템 사진용) 두 개의 창고가 만들어졌습니다. 사진 파일 자체는 이 창고에 저장되고, 데이터베이스의 `photo_url` 컬럼에는 그 파일이 있는 "주소"만 저장됩니다.

## 3. 내 정보는 안전한가요? (보안 장치)

여러 사람이 같은 앱을 함께 쓰기 때문에, "내가 등록한 옷과 기록이 다른 사람 화면에는 절대 보이면 안 된다"는 것이 가장 기본적인 보안 요구사항입니다. 이를 지켜주는 장치가 세 가지 있습니다.

**① RLS(Row Level Security, 행 단위 보안 — 내 데이터만 나에게 보이게 하는 자물쇠)**

3개 테이블 모두 RLS가 켜져 있고, 각 테이블마다 조회(SELECT)·등록(INSERT)·수정(UPDATE)·삭제(DELETE) 4종류의 자물쇠(정책, Policy)가 걸려 있어 총 12개입니다. 규칙은 단순합니다.

```sql
create policy "Users can view own outfits"
  on public.outfits for select
  using (auth.uid() = user_id);
```

이 코드가 하는 일: 로그인한 사람의 고유번호(`auth.uid()`)와 그 기록의 주인(`user_id`)이 같을 때만 조회를 허용합니다.
왜 이렇게 만들었나: 데이터베이스 자체가 "너는 네 것만 봐야 한다"를 강제하기 때문에, 화면 코드나 Server Action에 실수가 있어도 남의 데이터가 새어 나가지 않습니다. 실제로 `app/outfits/actions.ts`·`app/closet/actions.ts`는 `.eq("user_id", ...)` 조건을 코드에서도 한 번 더 걸어(2중 방어), RLS와 코드 양쪽이 모두 "내 것만"을 확인합니다.

`outfit_items`(연결 다리 테이블)는 자기 자신에 `user_id`가 없기 때문에, "이 연결이 속한 착장 기록의 주인이 나인가"를 매번 검사합니다.

```sql
create policy "Users can insert own outfit items"
  on public.outfit_items for insert
  with check (
    exists (select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.user_id = auth.uid())
    and exists (select 1 from public.clothing_items c
      where c.id = outfit_items.clothing_item_id and c.user_id = auth.uid())
  );
```

이 코드가 하는 일: 새 연결을 등록할 때 "연결하려는 착장도 내 것, 연결하려는 옷 아이템도 내 것"인지 둘 다 검사합니다.
왜 이렇게 만들었나: 남의 착장 기록에 몰래 내 옷을 연결하거나, 남의 옷을 내 기록에 끌어다 붙이는 두 가지 시도를 모두 막기 위해서입니다.

**성능 최적화에 대해 참고**: ROADMAP Task 023에 따르면, 이 12개 정책은 이후 `auth.uid()`를 행마다 새로 계산하지 않도록 `(select auth.uid())` 형태로 다시 다듬어져 실제 운영 데이터베이스에 적용되었습니다. **다만 이 최적화를 반영한 새 마이그레이션 파일이 저장소에는 없어**, 위에 인용한 코드는 "정책의 의미(누가 접근 가능한가)"를 보여주는 원본 마이그레이션 파일 기준이고, 실제 운영 DB의 SQL 문구는 성능 개선판으로 조금 다를 수 있습니다(의미·결과는 동일).

**② Storage 접근 정책 — 사진 창고도 사람별로 칸이 나뉘어 있습니다**

사진은 업로드할 때 `{내_고유번호}/{임의의_파일명}.webp` 형태의 경로에 저장됩니다(`lib/storage/upload.ts`).

```sql
create policy "Users can upload own bucket objects"
  on storage.objects for insert
  with check (
    bucket_id in ('outfit-photos', 'item-photos')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

이 코드가 하는 일: 업로드하려는 파일 경로의 맨 앞 폴더 이름이 내 고유번호와 같을 때만 업로드를 허용합니다. 같은 형태로 조회(select)·수정(update)·삭제(delete) 정책도 각각 하나씩, 총 4종이 두 버킷에 공통 적용됩니다.
왜 이렇게 만들었나: 남의 고유번호 폴더에 사진을 몰래 끼워 넣거나, 남의 사진을 지우고 바꾸는 것을 막기 위해서입니다.

**주의할 점(정직하게 알려드립니다)**: 두 창고(`outfit-photos`, `item-photos`)는 모두 **공개(public) 버킷**입니다. 즉 사진을 "올리고 지우고 바꾸는" 행위는 본인 폴더로 엄격히 제한되지만, **사진 주소(URL)를 정확히 아는 사람은 로그인 없이도 그 사진을 볼 수 있습니다.** ROADMAP Task 023에서도 이 점을 다시 확인했고, "개인용 앱 특성상 치명적이지 않고, 파일명이 추측 불가능한 UUID라 사실상 비공개나 다름없다"는 판단으로 그대로 유지하기로 결정했습니다.

**③ 라우트 보호 — 로그인 안 하면 화면 자체에 못 들어갑니다**

`proxy.ts`(루트)가 모든 페이지 요청에 대해 로그인 여부를 먼저 확인합니다. 실제 코드(`lib/supabase/proxy.ts`)를 보면 로그인 없이 접근을 허용하는 경로는 정확히 `/`(홈 주소)와 `/auth`로 시작하는 로그인·회원가입·비밀번호 재설정 화면뿐이고, **그 외의 모든 경로(옷장, 캘린더, 통계, 마이 페이지, 착장 기록 화면 등)는 로그인하지 않으면 자동으로 `/auth/login`으로 돌려보냅니다.**

## 4. 인증(로그인) 흐름

- **이메일/비밀번호**: `components/login-form.tsx`·`sign-up-form.tsx`가 브라우저용 Supabase 클라이언트(`lib/supabase/client.ts`)로 로그인/가입을 요청합니다.
- **구글 로그인**: `components/google-login-button.tsx`가 `supabase.auth.signInWithOAuth({ provider: "google" })`를 호출해 구글 로그인 화면으로 이동시키고, 구글 인증이 끝나면 `app/auth/callback/route.ts`가 전달받은 코드를 세션으로 교환(`exchangeCodeForSession`)한 뒤 홈(`/`)으로 돌려보냅니다. 실패 시 `/auth/error`로 이동합니다.
- **세션 저장 방식**: 로그인에 성공하면 Supabase가 세션을 브라우저 쿠키에 저장합니다. 서버 쪽에서는 `lib/supabase/server.ts`의 `createClient()`가 `next/headers`의 `cookies()`를 통해 이 쿠키를 읽어 "지금 요청한 사람이 누구인지"를 확인합니다. 같은 파일의 `getAuthClaims()`는 React의 `cache()`로 감싸져 있어, 한 번의 화면 렌더링 안에서 로그인 확인 요청이 여러 번 중복 발생하지 않도록 최적화되어 있습니다.
- **비밀번호 재설정**: `app/auth/forgot-password`, `app/auth/update-password` 라우트가 담당하며, F010 범위의 기존 구현입니다.
- **로그아웃**: `components/logout-button.tsx`가 세션을 종료하고 `/auth/login`으로 이동시키며, 마이 페이지(`app/(tabs)/my/page.tsx`)에 배치되어 있습니다.

## 5. 지금까지 만들어진 기능 / 아직 안 만들어진 기능

| 기능 | 상태 | 설명 |
| --- | --- | --- |
| 데이터베이스 뼈대(테이블·관계·제약조건) | 완료 | `outfits`/`clothing_items`/`outfit_items` 3개 테이블, 관계, 인덱스가 모두 생성되어 운영 중 |
| RLS 보안 정책 12종 + Storage 정책 4종 | 완료 | 두 계정으로 교차 접근 테스트(Task 004, 016-1, 023)까지 실제로 수행되어 데이터 격리가 확인됨 |
| 인증(이메일/구글/비밀번호 재설정/로그아웃) | 완료 | F010, 기존 구현을 그대로 재사용 |
| 옷 아이템 등록·수정·삭제·조회(F003~F006) | 완료 | `createClothingItem`/`updateClothingItem`/`deleteClothingItem`이 실제 DB에 insert/update/delete를 수행함 |
| 오늘의 착장 기록 등록·수정·삭제(F001·F002·F011) | 완료 | `createOutfit`(같은 날짜면 자동으로 수정 모드 전환)·`deleteOutfit`이 실제 DB에 write함 |
| 캘린더 기록 표시 및 날짜별 상세(F007·F008) | 완료 | `getOutfitDatesInMonth`, `getOutfitByDate` 등 실사용 중 |
| 스타일 통계(F009) | 완료 | `getItemWearCounts`, `getCategoryDistribution` 등 실사용 중 |
| 홈 — 오늘 기록 여부 안내(F013) | 완료 | `getRecentOutfitDates`로 최근 7일 스트릭까지 표시 |
| 계정 정보 확인(F012) | 완료 | 이메일, 가입 경로(이메일/구글), 총 기록 일수·아이템 수 표시 |
| 이미지 업로드/리사이즈/WebP 변환 | 완료 | `components/common/image-uploader.tsx` + `lib/storage/upload.ts` |
| Vercel 배포 | 완료 | `https://todays-outfit-nine.vercel.app/` 에서 실사용 가능 |
| 배포 도메인 대상 실기기 스모크 테스트 | 미완료 | ROADMAP Task 024 체크리스트에 남아 있음(에뮬레이션으로만 검증됨) |
| Lighthouse Performance 90점 이상 | 미달성 | `docs/ISSUES.md` 기준 65~72점. Supabase JWT가 대칭키(HS256) 방식이라 로그인 확인마다 실제 네트워크 왕복이 발생하는 것이 원인으로 파악됨. 비대칭키(RS256 등) 전환은 Supabase 대시보드 설정이 필요해 후속 과제로 남겨짐 |
| `profiles` 타입 잔재 정리 | 미완료 | `lib/supabase/types.ts`에 실제로는 쓰이지 않는 `profiles` 테이블 타입이 여전히 남아 있음(아래 6절 참고) |
| 마이그레이션 파일과 실제 DB 상태 동기화 | 확인 필요 | `clothing_items.photo_url` NULL 허용 변경, Task 023의 RLS 성능 최적화가 로컬 SQL 파일에는 반영되지 않음 |

## 6. 요구사항과 비교했을 때

**PRD/ROADMAP에는 있는데 아직 없는 것**: 없습니다. F001~F013 전 기능이 화면과 함께 완성되어 있습니다.

**코드에는 있는데 요구사항에서 근거를 찾지 못한 것(군더더기 후보)**

- `lib/supabase/types.ts`에 `profiles`라는 테이블 타입이 여전히 남아 있습니다. 그런데 실제 마이그레이션 파일 어디에도 `profiles` 테이블을 만드는 코드가 없고, PRD 7절 데이터 모델에도 `profiles`는 없습니다. 코드 전체를 검색해도 `docs/ROADMAP.md`와 `lib/supabase/types.ts` 두 곳에서만 이 이름이 발견되어, 실제로 어디서도 쓰이지 않는 잔재로 보입니다. 당장 문제를 일으키진 않지만, 다음에 타입을 다시 생성하면 자연스럽게 사라질 가능성이 있는 항목입니다.
- Storage 버킷이 공개(public)로 설정된 점은 3절에서 설명한 대로 PRD에 명시적 근거는 없지만, ROADMAP Task 023에서 "개인용 앱 특성상 문제없다"고 의도적으로 확정한 설계입니다.

**그 외**: 테이블 구조·컬럼·제약조건은 PRD 7절 데이터 모델과 정확히 일치합니다(단, `clothing_items.photo_url`의 NULL 허용 여부는 5절·2절에서 설명한 대로 정책 변경이 있었고 이는 파일 이력에 정확히 반영되어 있지 않습니다).

## 7. 다음 단계

핵심 기능(F001~F013) 개발은 모두 끝났고, 남아 있는 항목은 대부분 "더 다듬는" 성격의 후속 과제입니다.

- **실기기 스모크 테스트**: 배포된 `https://todays-outfit-nine.vercel.app/`에서 실제 아이폰/안드로이드로 가입~기록~통계 전체 흐름을 한 번 더 확인하는 작업이 남아 있습니다(ROADMAP Task 024 잔여 체크리스트).
- **Lighthouse 성능 개선**: Supabase 프로젝트의 JWT 서명 방식을 대칭키(HS256)에서 비대칭키로 바꾸는 인프라 변경이 필요한 작업으로, Supabase 대시보드 설정이 필요해 이후 별도로 진행될 예정입니다.
- **`profiles` 타입 잔재 정리**와 **마이그레이션 파일-실DB 동기화**: 다음에 `Database` 타입을 다시 생성하거나 스키마를 정리할 때 함께 반영될 가능성이 높은 항목으로, 지금 당장 기능에 영향을 주지는 않습니다.

---

참고한 파일: `docs/ROADMAP.md`, `docs/PRD.md`, `docs/ISSUES.md`, `supabase/migrations/20260820083353_create_outfit_tables.sql`, `supabase/migrations/20260820083401_create_storage_buckets.sql`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/proxy.ts`, `lib/supabase/types.ts`, `proxy.ts`, `app/outfits/actions.ts`, `app/closet/actions.ts`, `lib/queries/outfits.ts`, `lib/queries/clothing-items.ts`, `lib/queries/stats.ts`, `lib/storage/upload.ts`, `lib/constants/category.ts`, `app/auth/callback/route.ts`, `components/google-login-button.tsx`, `app/(tabs)/my/page.tsx`, `package.json`(모두 `C:\Users\admin\Desktop\workspaces\todays-outfit` 기준 절대경로).
