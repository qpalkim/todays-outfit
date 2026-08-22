import { ImageResponse } from "next/og";

export const alt = "오늘 뭐 입었지? — 매일의 착장을 기록하는 개인 옷장 로그";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 링크 공유 시 노출되는 OG 이미지 — 민트 배경에 앱 이름과 한 줄 소개를 담는다 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background: "#137b5e",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "rgba(255, 255, 255, 0.16)",
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          옷
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
          오늘 뭐 입었지?
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.85)",
          }}
        >
          매일의 착장을 기록하는 개인 옷장 로그
        </div>
      </div>
    ),
    { ...size },
  );
}
