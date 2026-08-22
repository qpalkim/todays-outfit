"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteClothingItem } from "@/app/closet/actions";
import { deleteImage, getStoragePathFromPublicUrl } from "@/lib/storage/upload";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteItemDialogProps {
  itemId: string;
  photoUrl: string;
  connectedOutfitCount: number;
}

/** 아이템 삭제 확인 다이얼로그 — DB 삭제 성공 후 브라우저에서 Storage 파일을 정리한다 */
export function DeleteItemDialog({
  itemId,
  photoUrl,
  connectedOutfitCount,
}: DeleteItemDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    let result;
    try {
      result = await deleteClothingItem(itemId);
    } catch {
      setIsDeleting(false);
      toast.error("네트워크 연결을 확인해주세요");
      return;
    }

    if (!result.success) {
      setIsDeleting(false);
      toast.error(result.error);
      return;
    }

    const path = getStoragePathFromPublicUrl("item-photos", photoUrl);
    if (path) {
      void deleteImage({ bucket: "item-photos", path });
    }

    toast.success("아이템을 삭제했어요");
    router.push("/closet");
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive">
          <Trash2 className="size-4" />
          아이템 삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>아이템을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            {connectedOutfitCount > 0
              ? `이 아이템은 ${connectedOutfitCount}개의 착장 기록에 연결되어 있어요. 삭제하면 해당 기록에서도 이 아이템 연결이 함께 제거됩니다.`
              : "삭제하면 되돌릴 수 없어요."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
