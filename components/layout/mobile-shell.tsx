interface MobileShellProps {
  children: React.ReactNode;
}

/** 페이지 콘텐츠의 세로 스크롤과 기본 여백만 담당한다(폭 제약은 app/layout.tsx의 max-w-md가 담당) */
export function MobileShell({ children }: MobileShellProps) {
  return <div className="flex min-h-full flex-col gap-4 p-4">{children}</div>;
}
