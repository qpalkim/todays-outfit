import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { Mascot } from "@/components/common/mascot";

export const alt = "오늘 뭐 입었지? — 매일의 착장을 기록하는 개인 옷장 로그";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const pretendardBold = readFileSync(
  join(process.cwd(), "public/fonts/Pretendard-Bold.subset.woff"),
);

const FEATURE_TAGS = ["📸 오늘의 착장", "👕 옷장", "📅 캘린더", "📊 통계"];

/** 링크 공유 시 노출되는 OG 이미지 — 짙은 민트 그라디언트 위에 브랜드 캐릭터와 핵심 기능 태그를 배치 */
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
          gap: 28,
          backgroundImage: "linear-gradient(135deg, #06301a 0%, #1c7a43 100%)",
          fontFamily: "Pretendard",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.14)",
          }}
        >
          <Mascot size={190} />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "white",
            letterSpacing: -1.5,
          }}
        >
          오늘 뭐 입었지?
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          매일의 착장을 기록하는 개인 옷장 로그
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          {FEATURE_TAGS.map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.14)",
                color: "white",
                fontSize: 22,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Pretendard",
          data: pretendardBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
