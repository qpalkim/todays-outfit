import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS 홈 화면 추가 시 쓰이는 아이콘 — icon.tsx와 동일한 모노그램을 더 큰 캔버스로 재사용 */
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
          background: "#137b5e",
          color: "white",
          fontSize: 96,
          fontWeight: 700,
        }}
      >
        옷
      </div>
    ),
    { ...size },
  );
}
