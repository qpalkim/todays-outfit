import localFont from "next/font/local";
import { Jua } from "next/font/google";

/** 본문 전용 폰트 — 실제 사용 중인 굵기(400/500/600)만 서브셋으로 로드해 번들 크기를 줄인다 */
export const pretendard = localFont({
  src: [
    {
      path: "../node_modules/pretendard/dist/web/static/woff2-subset/Pretendard-Regular.subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/pretendard/dist/web/static/woff2-subset/Pretendard-Medium.subset.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../node_modules/pretendard/dist/web/static/woff2-subset/Pretendard-SemiBold.subset.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

/** 타이틀·숫자 등 강조 요소에만 선택 적용하는 포인트 폰트(통통 튄 손글씨풍) */
export const pointFont = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-point",
  display: "swap",
});
