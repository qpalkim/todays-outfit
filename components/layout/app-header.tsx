"use client";

import { ChevronLeft } from "lucide-react";

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
}

/** 화면 타이틀과 선택적 뒤로가기 버튼을 보여주는 공통 상단 헤더 */
export function AppHeader({ title, onBack }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-1 border-b bg-background px-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="flex size-11 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-accent"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      <h1 className="flex-1 truncate px-1 text-base font-semibold">{title}</h1>
    </header>
  );
}
