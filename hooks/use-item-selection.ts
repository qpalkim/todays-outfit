import { useCallback, useState } from "react";

export interface UseItemSelectionResult {
  selectedIds: string[];
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clear: () => void;
  reset: (ids: string[]) => void;
}

/** 옷장 아이템 다중 선택 상태를 관리한다(카테고리 필터가 전환되어도 선택 상태는 유지된다) */
export function useItemSelection(
  initialIds: string[] = [],
): UseItemSelectionResult {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds],
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds((current) => Array.from(new Set([...current, ...ids])));
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const reset = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  return { selectedIds, isSelected, toggle, selectAll, clear, reset };
}
