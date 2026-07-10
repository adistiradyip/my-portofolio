"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";

type DeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: string;
  onConfirm: () => void;
  isPending?: boolean;
};

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  description,
  onConfirm,
  isPending,
}: DeleteConfirmDialogProps) {
  const { t } = useAdminLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="px-6 pt-6 pb-2">
          <DialogHeader className="gap-3">
            <DialogTitle>{t.delete.title}</DialogTitle>
            <DialogDescription className="leading-relaxed">{description}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col gap-3 px-6 pt-5 pb-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {t.common.cancel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full bg-destructive text-white hover:bg-destructive/90 sm:w-auto"
          >
            {t.common.delete}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
