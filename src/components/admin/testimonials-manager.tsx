"use client";

import { useMemo, useState, useTransition } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { saveTestimonial, deleteTestimonial } from "@/lib/actions";
import type { Testimonial } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

const emptyTestimonial: Partial<Testimonial> = {
  quote: "",
  author: "",
  role: "",
  sort_order: 0,
  status: "published",
};

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const { t } = useAdminLanguage();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Testimonial>>(emptyTestimonial);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveTestimonial({
        id: editing.id,
        quote: formData.get("quote") as string,
        author: formData.get("author") as string,
        role: formData.get("role") as string,
        sort_order: Number(formData.get("sort_order") || 0),
        status: formData.get("status") as "draft" | "published",
      });
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.testimonialSaved);
        setOpen(false);
      }
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteTestimonial(deleteId);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.testimonialDeleted);
        setDeleteId(null);
      }
    });
  }

  const columns = useMemo<ColumnDef<Testimonial>[]>(
    () => [
      {
        accessorKey: "author",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.testimonials.author} />
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.author}</span>,
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.testimonials.role} />
        ),
      },
      {
        accessorKey: "quote",
        header: t.testimonials.quote,
        cell: ({ row }) => (
          <span className="line-clamp-2 max-w-md text-sm text-muted-foreground">
            {row.original.quote}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.testimonials.fields.status} />
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.status === "published" ? "default" : "secondary"}>
            {row.original.status}
          </Badge>
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
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t.testimonials.title}</h1>
          <p className="text-muted-foreground">{t.testimonials.subtitle}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                onClick={() => {
                  setEditing(emptyTestimonial);
                  setOpen(true);
                }}
                className="w-full bg-primary hover:bg-primary/90 sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t.testimonials.add}
              </Button>
            }
          />
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing.id ? t.testimonials.edit : t.testimonials.add}</DialogTitle>
            </DialogHeader>
            <form key={editing.id ?? "new"} action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t.testimonials.fields.quote}</Label>
                <Textarea name="quote" defaultValue={editing.quote ?? ""} rows={4} required />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t.testimonials.fields.author}</Label>
                  <Input name="author" defaultValue={editing.author ?? ""} required />
                </div>
                <div className="space-y-2">
                  <Label>{t.testimonials.fields.role}</Label>
                  <Input name="role" defaultValue={editing.role ?? ""} required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t.testimonials.fields.sortOrder}</Label>
                  <Input name="sort_order" type="number" defaultValue={editing.sort_order ?? 0} />
                </div>
                <div className="space-y-2">
                  <Label>{t.testimonials.fields.status}</Label>
                  <select
                    name="status"
                    defaultValue={editing.status ?? "published"}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="draft">{t.testimonials.fields.draft}</option>
                    <option value="published">{t.testimonials.fields.published}</option>
                  </select>
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
        data={testimonials}
        searchKey="author"
        searchPlaceholder={t.testimonials.search}
        emptyMessage={t.testimonials.empty}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        description={t.delete.testimonial}
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
