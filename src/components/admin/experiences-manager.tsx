"use client";

import { useMemo, useState, useTransition } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { saveExperience, deleteExperience } from "@/lib/actions";
import type { Experience } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const emptyExp: Partial<Experience> = {
  company: "",
  role: "",
  description: "",
  current: false,
  sort_order: 0,
};

export function ExperiencesManager({ experiences }: { experiences: Experience[] }) {
  const { t } = useAdminLanguage();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Experience>>(emptyExp);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveExperience({
        id: editing.id,
        company: formData.get("company") as string,
        role: formData.get("role") as string,
        description: formData.get("description") as string,
        start_date: (formData.get("start_date") as string) || null,
        end_date: (formData.get("end_date") as string) || null,
        current: formData.get("current") === "on",
        sort_order: Number(formData.get("sort_order") || 0),
      });
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.experienceSaved);
        setOpen(false);
      }
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteExperience(deleteId);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.experienceDeleted);
        setDeleteId(null);
      }
    });
  }

  const columns = useMemo<ColumnDef<Experience>[]>(
    () => [
      {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t.experiences.role} />,
        cell: ({ row }) => <span className="font-medium">{row.original.role}</span>,
      },
      {
        accessorKey: "company",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.experiences.company} />
        ),
      },
      {
        id: "period",
        header: t.experiences.period,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.start_date ?? "—"} —{" "}
            {row.original.current ? t.experiences.present : row.original.end_date ?? "—"}
          </span>
        ),
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
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t.experiences.title}</h1>
          <p className="text-muted-foreground">{t.experiences.subtitle}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                onClick={() => {
                  setEditing(emptyExp);
                  setOpen(true);
                }}
                className="w-full bg-primary hover:bg-primary/90 sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t.experiences.add}
              </Button>
            }
          />
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing.id ? t.experiences.edit : t.experiences.add}</DialogTitle>
            </DialogHeader>
            <form key={editing.id ?? "new"} action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t.experiences.fields.company}</Label>
                  <Input name="company" defaultValue={editing.company ?? ""} required />
                </div>
                <div className="space-y-2">
                  <Label>{t.experiences.fields.role}</Label>
                  <Input name="role" defaultValue={editing.role ?? ""} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.experiences.fields.description}</Label>
                <Textarea name="description" defaultValue={editing.description ?? ""} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t.experiences.fields.startDate}</Label>
                  <Input name="start_date" type="date" defaultValue={editing.start_date ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label>{t.experiences.fields.endDate}</Label>
                  <Input name="end_date" type="date" defaultValue={editing.end_date ?? ""} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="current" defaultChecked={editing.current} />
                {t.experiences.fields.current}
              </label>
              <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
                {isPending ? t.common.saving : t.common.save}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={experiences}
        searchKey="role"
        searchPlaceholder={t.experiences.search}
        emptyMessage={t.experiences.empty}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        description={t.delete.experience}
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
