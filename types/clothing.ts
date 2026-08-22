import type { ClothingCategory } from "@/lib/constants/category";

export interface ClothingItem {
  id: string;
  user_id: string;
  category: ClothingCategory;
  name: string;
  photo_url: string | null;
  created_at: string;
}

export interface ClothingItemFormValues {
  name: string;
  category: ClothingCategory;
  photo_file: File | null;
  existing_photo_url?: string;
}
