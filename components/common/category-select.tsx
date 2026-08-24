"use client";

import {
  CLOTHING_CATEGORIES,
  CLOTHING_CATEGORY_EMOJIS,
  CLOTHING_CATEGORY_LABELS,
  type ClothingCategory,
} from "@/lib/constants/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  value?: ClothingCategory;
  onValueChange: (value: ClothingCategory) => void;
  disabled?: boolean;
  placeholder?: string;
}

/** 폼용 카테고리 Select — React Hook Form Controller의 field.value/field.onChange를 그대로 전달할 수 있는 시그니처 */
export function CategorySelect({
  value,
  onValueChange,
  disabled,
  placeholder = "카테고리 선택",
}: CategorySelectProps) {
  return (
    <Select
      value={value ?? ""}
      onValueChange={(next) => onValueChange(next as ClothingCategory)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {CLOTHING_CATEGORIES.map((category) => (
          <SelectItem key={category} value={category}>
            {CLOTHING_CATEGORY_EMOJIS[category]} {CLOTHING_CATEGORY_LABELS[category]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
