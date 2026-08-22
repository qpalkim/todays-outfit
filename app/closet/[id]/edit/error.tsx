"use client";

import { ErrorMessage } from "@/components/common/error-message";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4">
      <ErrorMessage
        message="문제가 발생했어요. 잠시 후 다시 시도해주세요"
        onRetry={reset}
      />
    </div>
  );
}
