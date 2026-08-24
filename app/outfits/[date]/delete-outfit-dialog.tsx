"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteOutfit } from "@/app/outfits/actions";
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

interface DeleteOutfitDialogProps {
  outfitId: string;
  photoUrl: string;
}

/** 착장 기록 삭제 확인 다이얼로그 — DB 삭제 성공 후 브라우저에서 Storage 사진을 정리한다 */
export function DeleteOutfitDialog({
  outfitId,
  photoUrl,
}: DeleteOutfitDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    let result;
    try {
      result = await deleteOutfit(outfitId);
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

    const path = getStoragePathFromPublicUrl("outfit-photos", photoUrl);
    if (path) {
      void deleteImage({ bucket: "outfit-photos", path });
    }

    toast.success("착장 기록을 삭제했어요");
    router.push("/calendar");
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive">
          삭제하기
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>착장 기록을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            삭제하면 되돌릴 수 없어요.
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
