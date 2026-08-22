# 오늘 뭐 입었지? (Today's Outfit)

하루 단위로 "오늘 입은 옷"을 기록해, 실제로 어떤 옷을 입고 사는지 데이터로 되돌아보게 하는 모바일 웹 옷장 로그.

- 제품 요구사항: [`docs/PRD.md`](docs/PRD.md)
- 개발 로드맵: [`docs/ROADMAP.md`](docs/ROADMAP.md)

## 기술 스택

Next.js (App Router) · React · TypeScript · TailwindCSS v4 · shadcn/ui · React Hook Form + Zod · Supabase(Auth·DB·Storage) · Vercel

## 로컬 실행

1. 의존성 설치

   ```bash
   npm install
   ```

2. 환경변수 설정 — `.env.example`을 `.env.local`로 복사한 뒤 값을 채운다

   ```bash
   cp .env.example .env.local
   ```

   ```env
   NEXT_PUBLIC_SUPABASE_URL=[Supabase 프로젝트 URL]
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[Supabase publishable(anon) 키]
   ```

   두 값 모두 Supabase 대시보드의 Project Settings > API에서 확인할 수 있다. 클라이언트에 노출되는 것을 전제로 한 공개 키이며, 실제 데이터 접근 제어는 Supabase RLS 정책이 담당한다.

3. 개발 서버 실행

   ```bash
   npm run dev
   ```

   [http://localhost:3000](http://localhost:3000)에서 확인할 수 있다.

## 명령어

```bash
npm run dev     # 개발 서버 (Next.js)
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버 실행
npm run lint    # ESLint
```
