프로젝트 구현 완료 후, 마무리 작업

1. 리팩토링

- [x] 불필요한 코드 있는지 체크 — 스타터킷 잔재 컴포넌트는 이미 전부 제거된 상태, `lib/utils.ts`의 영어 스타터킷 주석만 정리
- [x] 작성해 놓고 쓰지 않는 코드가 있는지 체크 — console.log/TODO/FIXME 등 잔재 없음 확인
- [x] 중복 코드 및 중복 컴포넌트 정리 — `category-select.tsx`/`category-tabs.tsx`는 폼 선택 vs 리스트 필터로 용도가 달라 중복 아님, 유지
- [x] 네이밍 및 폴더 구조 확인 — 컨벤션 위반 없음
- [x] 임시 주석, 콘솔 로그, 디버깅 코드 제거 — 해당 없음(사전 조사 결과 발견되지 않음)
- [x] 클라이언트에 노출되면 안 되는 환경 변수가 있는지 체크 — `NEXT_PUBLIC_` 접두사 변수만 클라이언트에서 사용됨을 확인
- [x] 깃에 올라가면 안 되는 파일이나 폴더가 있는지 체크 — `.env.local` 등 gitignore 정상 적용 확인
- [x] 사용하지 않는 패키지 제거 — 미사용 `date-fns` 제거
- [x] Lighthouse 점수 90점 이상 여부 확인 — Accessibility 93 / Best Practices 100 / SEO 100 달성. **Performance는 65~72점으로 미달.** 원인은 Supabase 프로젝트가 대칭키(HS256) JWT를 사용해 `supabase.auth.getClaims()` 호출마다 Supabase Auth 서버로 실제 네트워크 왕복(~2.3초)이 발생하기 때문. 요청당 중복 호출은 `React cache()`로 1회로 묶어 이미 반영했지만(호출 수 자체는 줄었지만 병렬 호출이라 체감 속도는 동일), 근본 해결에는 Supabase 대시보드에서 JWT 서명 키를 비대칭키(RS256/ES256)로 전환하는 인프라 변경이 필요함 — **후속 과제로 남김**

2. 오픈 그래프 및 SEO 최적화

- [x] og 이미지 서비스에 어울리게 수정 — `app/opengraph-image.tsx`가 이미 프로젝트 정체성에 맞게 구현되어 있어 그대로 사용
- [x] SEO 최적화
  - [x] title 및 description 최적화 — title 템플릿 적용, 로그인/회원가입 페이지 개별 title 추가
  - [x] robots.ts 추가 — 로그인 필요한 개인용 앱 특성상 `/`만 허용, 나머지 경로는 크롤링 차단. 이 과정에서 미들웨어가 `/robots.txt` 자체를 로그인 리다이렉트로 막고 있던 버그를 발견해 수정(`proxy.ts`)
- [x] 프로젝트 제목: 오늘 뭐 입었지? - Today's Outfit — `package.json` name/description 추가로 반영
- [x] 페이지별 메타데이터 확인 — 대부분 로그인 후 개인 화면이라 개별 title 실익이 낮아 루트 상속 유지, 공개 진입 경로(로그인/회원가입)만 개별 title 부여
- [x] 파비콘, 카드 메타데이터 확인 — `app/icon.tsx`, `app/apple-icon.tsx` 정상 확인, `openGraph.url`/`siteName` 보강
- [x] 실제 배포 url 기준으로 메타데이터 및 og 이미지 정상 노출 여부 확인 — `metadataBase`가 배포마다 바뀌는 `VERCEL_URL`에만 의존하던 문제를 `VERCEL_PROJECT_PRODUCTION_URL` 우선 사용으로 고정(`https://todays-outfit-nine.vercel.app`), 재배포 후 실사이트 확인 예정

3. 문서화

- README.md 작성
  - og 이미지 표지로 사용
  - 주요 화면 스크린샷 첨부
  - 프로젝트 소개
  - 기술 스택
  - 실행 방법
  - 배포 url
- BACKEND.md 수정
  - supabase 설계 구조
  - 백엔드 흐름
  - 데이터베이스 아키텍처
  - 테이블 구조
  - 테이블 간 관계
  - 인증 흐름
  - RLS 정책
  - @"supabase-backend-doc-writer (agent)" 서브 에이전트 사용
