"use client";

import { useMemo, useState, useTransition } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { saveSkill, deleteSkill } from "@/lib/actions";
import type { Skill } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptySkill: Partial<Skill> = {
  name: "",
  category: "general",
  proficiency: 3,
  sort_order: 0,
};

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const { t } = useAdminLanguage();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Skill>>(emptySkill);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveSkill({
        id: editing.id,
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        proficiency: Number(formData.get("proficiency") || 3),
        sort_order: Number(formData.get("sort_order") || 0),
      });
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.skillSaved);
        setOpen(false);
      }
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteSkill(deleteId);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.skillDeleted);
        setDeleteId(null);
      }
    });
  }

  const columns = useMemo<ColumnDef<Skill>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t.skills.name} />,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.skills.category} />
        ),
        cell: ({ row }) => <span className="capitalize">{row.original.category}</span>,
      },
      {
        accessorKey: "proficiency",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t.skills.level} />,
        cell: ({ row }) => `${row.original.proficiency}/5`,
      },
      {
        id: "actions",
        header: () => <div className="text-right">{t.common.actions}</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setEditing(row.original);
                setOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(row.original.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [t],
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t.skills.title}</h1>
          <p className="text-muted-foreground">{t.skills.subtitle}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                onClick={() => {
                  setEditing(emptySkill);
                  setOpen(true);
                }}
                className="w-full bg-primary hover:bg-primary/90 sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t.skills.add}
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing.id ? t.skills.edit : t.skills.add}</DialogTitle>
            </DialogHeader>
            <form key={editing.id ?? "new"} action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t.skills.fields.name}</Label>
                <Input name="name" defaultValue={editing.name ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label>{t.skills.fields.category}</Label>
                <Input name="category" defaultValue={editing.category ?? "general"} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t.skills.fields.proficiency}</Label>
                  <Input
                    name="proficiency"
                    type="number"
                    min={1}
                    max={5}
                    defaultValue={editing.proficiency ?? 3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.skills.fields.sortOrder}</Label>
                  <Input name="sort_order" type="number" defaultValue={editing.sort_order ?? 0} />
                </div>
              </div>
              <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
                {isPending ? t.common.saving : t.common.save}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={skills}
        searchKey="name"
        searchPlaceholder={t.skills.search}
        emptyMessage={t.skills.empty}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        description={t.delete.skill}
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
