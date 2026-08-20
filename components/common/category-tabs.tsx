"use client";

import {
  CLOTHING_CATEGORIES,
  CLOTHING_CATEGORY_LABELS,
  type ClothingCategory,
} from "@/lib/constants/category";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type CategoryFilterValue = ClothingCategory | "all";

interface CategoryTabsProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
  className?: string;
}

/** 목록 화면용 카테고리 필터 탭(전체 + 상의/하의/신발/아우터/기타) */
export function CategoryTabs({ value, onChange, className }: CategoryTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onChange(next as CategoryFilterValue)}
      className={className}
    >
      <TabsList className="w-full">
        <TabsTrigger value="all">전체</TabsTrigger>
        {CLOTHING_CATEGORIES.map((category) => (
          <TabsTrigger key={category} value={category}>
            {CLOTHING_CATEGORY_LABELS[category]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
