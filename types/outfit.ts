import type { ClothingItem } from "@/types/clothing";

export interface Outfit {
  id: string;
  user_id: string;
  record_date: string;
  photo_url: string;
  memo: string | null;
  created_at: string;
}

export interface OutfitItem {
  id: string;
  outfit_id: string;
  clothing_item_id: string;
}

export interface OutfitWithItems extends Outfit {
  items: Array<OutfitItem & { clothing_item: ClothingItem }>;
}

export interface OutfitFormValues {
  record_date: string;
  photo_file: File | null;
  existing_photo_url?: string;
  memo?: string;
  clothing_item_ids: string[];
}
