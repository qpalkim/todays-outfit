## 수정 요구사항

### 1. 디자인 및 UI 개선 — 완료

- ~~오픈 그래프 이미지 개선~~ → `app/opengraph-image.tsx`를 브랜드 캐릭터(`components/common/mascot.tsx`, "셔츠 버디")로 재설계
- ~~파비콘 아이콘 변경~~ → `app/icon.tsx`, `app/apple-icon.tsx`를 브랜드 캐릭터 기반으로 교체
- ~~Jua 폰트 대신 다른 폰트로 교체~~ → 포인트 폰트를 Gaegu로 교체(`lib/fonts.ts`)
- ~~전체 페이지 기본 흰색 배경 변경~~ → `--background`에 옅은 민트 톤(`oklch(0.98 0.004 155)`)을 줘서 흰색 `--card`와 대비되도록 조정
- ~~하단 탭 선택 상태 개선~~ → `--primary`/`--accent`/`--ring`의 hue를 180(시안)에서 155(민트)로 이동해 근본 원인 해결
- ~~스켈레톤 UI 색상 개선~~ → `components/ui/skeleton.tsx`의 `bg-accent`를 `bg-muted`(중립 회색)로 변경
- ~~스켈레톤 UI 레이아웃 개선~~ → stats/closet/outfit detail의 `loading.tsx`를 실제 콘텐츠 레이아웃에 맞게 재작성

### 2. 페이지 및 UX 개선

- ~~홈 화면 콘텐츠 보완~~ → 완료. 홈 화면에 핵심 기능 4가지(기록/옷장/캘린더/통계) 소개 섹션을 상시 노출로 추가(`app/(tabs)/page.tsx`)
- ~~옷 아이템 등록 진입점 추가~~ → 완료. 옷장 목록 상단에 "+ 추가" 버튼 고정 배치(`app/(tabs)/closet/page.tsx`, 아이템 1개 이상일 때만 노출)
- ~~404 페이지 제작~~ → 완료. 전역 `app/not-found.tsx` 신규 작성
- 다크모드 지원 — **보류**: `docs/PRD.md`가 MVP 범위에서 명시적으로 제외하고 있어 이번 라운드에서는 진행하지 않음. 추후 별도로 검토

### 3. 기능 및 품질 검증

- 로드맵 파일에 정의된 테스트 및 검증 사항을 모두 수행했는지 체크 — 확인 완료
  - `docs/ROADMAP.md` 미완료 12건 중 7건은 Vercel/Supabase/Google 계정 접근이 필요해 에이전트가 대행 불가(사용자 진행 필요, Task024)
  - Task014(착장 기록) DoD "저장 실패 시 Storage에 고아 이미지가 남지 않음"은 **서버측** 자동 정리를 가리키며, 이번에도 미구현으로 남김 — `app/closet/actions.ts` 등 기존 Server Action은 "Storage 정리는 브라우저 클라이언트가 담당한다"는 프로젝트 원칙을 따르고 있어(Task013 참고) 서버측 정리를 추가하면 이 원칙이 깨짐
  - 대신 옷 아이템 등록/수정 폼(`app/closet/clothing-item-form.tsx`)에는 착장 기록 폼(`outfit-form.tsx`)에만 있던 **클라이언트측** 베스트에포트 롤백(저장 실패 시 방금 올린 사진을 Storage에서 정리)이 빠져있던 걸 발견해 동일하게 이식함 — 별개 갭이었지만 같은 종류의 실사용 리스크라 함께 해결
  - 나머지(Lighthouse 점수, 실기기 테스트, 느린 네트워크 테스트)는 코드 변경 대상이 아닌 환경적 제약으로 남음

### 4. 확장 가능성 — 완료

- ~~서비스 로고 및 캐릭터 일러스트 제작~~ → `/design`으로 브랜드 캐릭터 "셔츠 버디" 확정 후 `components/common/mascot.tsx`로 컴포넌트화
  - 적용 완료: 파비콘(`app/icon.tsx`), 애플 아이콘(`app/apple-icon.tsx`), OG 이미지(`app/opengraph-image.tsx`), 404 페이지(`app/not-found.tsx`), 빈 상태(옷장·통계 `EmptyState`, 홈 미기록 카드, 착장 상세 미기록 카드)

주요 민트 색상: #ADEBB3(캐릭터), #3b8d5d(UI 프라이머리·배지 배경)
