import { ImageResponse } from "next/og";

import { Mascot } from "@/components/common/mascot";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** 브라우저 탭·즐겨찾기에 쓰이는 파비콘 — 민트 배경에 브랜드 캐릭터(셔츠 버디) */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
      }}
    >
      <Mascot size={26} />
    </div>,
    { ...size },
  );
}
