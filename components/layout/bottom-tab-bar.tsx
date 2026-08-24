"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Calendar, Home, Shirt, User } from "lucide-react";

import { cn } from "@/lib/utils";

interface TabItem {
  href: string;
  label: string;
  icon: typeof Home;
}

const TABS: TabItem[] = [
  { href: "/", label: "홈", icon: Home },
  { href: "/closet", label: "옷장", icon: Shirt },
  { href: "/calendar", label: "캘린더", icon: Calendar },
  { href: "/stats", label: "통계", icon: BarChart3 },
  { href: "/my", label: "마이", icon: User },
];

/** 현재 경로가 탭 링크에 해당하는지 판정한다(홈은 정확히 일치, 나머지는 하위 경로 포함) */
function isTabActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface BottomTabBarProps {
  /** 비로그인 상태면 홈 이외의 탭은 로그인 페이지로 보낸다 */
  isAuthenticated: boolean;
}

/** 하단 탭바 — 홈/옷장/캘린더/통계/마이 5개 탭과 활성 탭 하이라이트를 렌더링한다 */
export function BottomTabBar({ isAuthenticated }: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md rounded-t-2xl border-t border-border/50 bg-background shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16 items-stretch">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = isTabActive(pathname, href);
          const targetHref =
            isAuthenticated || href === "/" ? href : "/auth/login";
          return (
            <Link
              key={href}
              href={targetHref}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-full px-4 py-1 transition-colors",
                  isActive && "bg-accent",
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2 : 1.5} />
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
