"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 p-4 text-center">
      <p className="text-sm text-muted-foreground">문제가 발생했습니다.</p>
      <button
        onClick={reset}
        className="rounded-md border px-4 py-2 text-sm font-medium"
      >
        다시 시도
      </button>
    </div>
  );
}
