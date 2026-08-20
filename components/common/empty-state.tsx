"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

/** 데이터가 없는 화면(옷장/캘린더/통계 등)에서 공통으로 쓰는 빈 상태 안내 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      {icon}
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button type="button" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
