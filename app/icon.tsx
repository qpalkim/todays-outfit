import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** 브라우저 탭·즐겨찾기에 쓰이는 파비콘 — 민트 배경에 흰색 "옷" 모노그램 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#137b5e",
          color: "white",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        옷
      </div>
    ),
    { ...size },
  );
}
