"use client";

import {
  CLOTHING_CATEGORIES,
  CLOTHING_CATEGORY_EMOJIS,
  CLOTHING_CATEGORY_LABELS,
  type ClothingCategory,
} from "@/lib/constants/category";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type CategoryFilterValue = ClothingCategory | "all";

interface CategoryTabsProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
  className?: string;
}

/**
 * 목록 화면용 카테고리 필터 탭(전체 + 상의/하의/신발/아우터/기타).
 * Tabs/TabsList를 w-full로 늘려 화면 폭에 맞게 균등 분배하되(TabsTrigger는
 * 베이스 클래스에 flex-1이 있어 자동으로 늘어남), 탭이 화면보다 넓어지는
 * 경우엔 TabsTrigger의 shrink-0가 축소를 막아 바깥 overflow-x-auto 컨테이너가
 * 가로 스크롤로 처리한다.
 */
export function CategoryTabs({ value, onChange, className }: CategoryTabsProps) {
  return (
    <div className="scrollbar-hide -mx-4 overflow-x-auto px-4">
      <Tabs
        value={value}
        onValueChange={(next) => onChange(next as CategoryFilterValue)}
        className={cn("w-full", className)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="all" className="shrink-0">
            전체
          </TabsTrigger>
          {CLOTHING_CATEGORIES.map((category) => (
            <TabsTrigger key={category} value={category} className="shrink-0">
              {CLOTHING_CATEGORY_EMOJIS[category]} {CLOTHING_CATEGORY_LABELS[category]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
