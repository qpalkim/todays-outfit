"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { ClothingItem } from "@/types/clothing";
import { CLOTHING_CATEGORY_LABELS } from "@/lib/constants/category";
import {
  CategoryTabs,
  type CategoryFilterValue,
} from "@/components/common/category-tabs";
import { ItemCard } from "@/components/common/item-card";
import { EmptyState } from "@/components/common/empty-state";

interface ClosetListProps {
  items: ClothingItem[];
}

/** 옷장 아이템을 카테고리 탭으로 필터링해 그리드로 보여주는 클라이언트 목록 */
export function ClosetList({ items }: ClosetListProps) {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterValue>("all");

  if (items.length === 0) {
    return (
      <EmptyState
        title="아직 등록한 아이템이 없어요"
        description="옷장에 첫 아이템을 등록해보세요"
        actionLabel="첫 아이템 등록하기"
        onAction={() => router.push("/closet/new")}
      />
    );
  }

  const filteredItems =
    categoryFilter === "all"
      ? items
      : items.filter((item) => item.category === categoryFilter);

  return (
    <div className="flex flex-col gap-4">
      <CategoryTabs value={categoryFilter} onChange={setCategoryFilter} />
      <p className="text-sm text-muted-foreground">
        {categoryFilter === "all"
          ? `전체 ${filteredItems.length}개`
          : `${CLOTHING_CATEGORY_LABELS[categoryFilter]} ${filteredItems.length}개`}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            variant="editable"
            onClick={() => router.push(`/closet/${item.id}/edit`)}
          />
        ))}
      </div>
    </div>
  );
}
