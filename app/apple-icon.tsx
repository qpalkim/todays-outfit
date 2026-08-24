import { ImageResponse } from "next/og";

import { Mascot } from "@/components/common/mascot";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS 홈 화면 추가 시 쓰이는 아이콘 — icon.tsx와 동일한 브랜드 캐릭터를 더 큰 캔버스로 재사용 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3b8d5d",
        }}
      >
        <Mascot size={132} />
      </div>
    ),
    { ...size },
  );
}
