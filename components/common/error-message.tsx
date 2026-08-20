"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/** 화면 단위 에러 상태를 안내하고 선택적으로 재시도 버튼을 제공한다 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <AlertTriangle className="size-8 text-destructive" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
