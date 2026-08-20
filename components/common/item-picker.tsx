"use client";

import { useEffect, useState } from "react";

import type { ClothingItem } from "@/types/clothing";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CategoryTabs,
  type CategoryFilterValue,
} from "@/components/common/category-tabs";
import { ItemCard } from "@/components/common/item-card";
import { useItemSelection } from "@/hooks/use-item-selection";

interface ItemPickerProps {
  items: ClothingItem[];
  initialSelectedIds?: string[];
  onConfirm: (selectedIds: string[]) => void;
  trigger: React.ReactNode;
}

/** 옷장 아이템 다중 선택 시트 — 카테고리별 필터링과 선택 개수 표시를 제공한다 */
export function ItemPicker({
  items,
  initialSelectedIds = [],
  onConfirm,
  trigger,
}: ItemPickerProps) {
  const [open, setOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterValue>("all");
  const { selectedIds, isSelected, toggle, reset } =
    useItemSelection(initialSelectedIds);

  // 시트를 열 때마다 마지막으로 확정된 선택 목록으로 되돌려, 확인 없이 닫은 변경사항은 버려지도록 한다
  useEffect(() => {
    if (open) {
      reset(initialSelectedIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filteredItems =
    categoryFilter === "all"
      ? items
      : items.filter((item) => item.category === categoryFilter);

  function handleConfirm() {
    onConfirm(selectedIds);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="flex h-[85dvh] flex-col">
        <SheetHeader>
          <SheetTitle>아이템 선택</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <CategoryTabs value={categoryFilter} onChange={setCategoryFilter} />
          <div className="grid grid-cols-3 gap-2 pb-4">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                variant={isSelected(item.id) ? "selected" : "default"}
                onClick={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t p-4">
          <span className="text-sm text-muted-foreground">
            선택 {selectedIds.length}개
          </span>
          <Button type="button" onClick={handleConfirm}>
            확인
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
