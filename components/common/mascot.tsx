interface MascotProps {
  size?: number;
  className?: string;
}

/**
 * 브랜드 캐릭터 "셔츠 버디" — 콘텐츠가 없는 화면(빈 상태·404)과
 * 파비콘/OG 이미지에서 공통으로 쓰는 마스코트.
 * next/og(ImageResponse)에서도 그대로 재사용하므로 className 없이
 * SVG 프레젠테이션 속성만으로 그린다.
 */
export function Mascot({ size = 96, className }: MascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="102" cy="151" rx="36" ry="6.5" fill="#0d0d0d" opacity="0.07" />
      <path d="M86 118 L81 145" stroke="#ADEBB3" strokeWidth="14" strokeLinecap="round" />
      <path
        d="M112 118 Q122 133 127 143"
        stroke="#ADEBB3"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="78" cy="149" rx="11" ry="6.5" fill="#1a1a1a" />
      <ellipse cx="130" cy="147" rx="11" ry="6.5" fill="#1a1a1a" />
      <path
        d="M46 64 Q33 75 36 90"
        stroke="#ADEBB3"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M145 64 Q163 52 170 39"
        stroke="#ADEBB3"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <g transform="translate(34,22) scale(5.6,4.5)">
        <path
          d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
          fill="#ADEBB3"
        />
      </g>
      <circle cx="86" cy="63" r="3.5" fill="#1a1a1a" />
      <circle cx="116" cy="63" r="3.5" fill="#1a1a1a" />
      <path
        d="M92 73 Q101 79 110 73"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
