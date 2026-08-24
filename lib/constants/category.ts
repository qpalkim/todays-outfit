export const CLOTHING_CATEGORIES = [
  "top",
  "bottom",
  "shoes",
  "outer",
  "etc",
] as const;

export type ClothingCategory = (typeof CLOTHING_CATEGORIES)[number];

export const CLOTHING_CATEGORY_LABELS: Record<ClothingCategory, string> = {
  top: "상의",
  bottom: "하의",
  shoes: "신발",
  outer: "아우터",
  etc: "기타",
};

export const CLOTHING_CATEGORY_EMOJIS: Record<ClothingCategory, string> = {
  top: "👕",
  bottom: "👖",
  shoes: "👟",
  outer: "🧥",
  etc: "🧢",
};
