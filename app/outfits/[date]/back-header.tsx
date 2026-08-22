"use client";

import { useRouter } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";

interface OutfitDetailHeaderProps {
  title: string;
}

/** 착장 상세 헤더 — 뒤로가기는 router.back()으로 처리해 캘린더의 선택 월(?year&month)을 유지한다 */
export function OutfitDetailHeader({ title }: OutfitDetailHeaderProps) {
  const router = useRouter();

  return <AppHeader title={title} onBack={() => router.back()} />;
}
