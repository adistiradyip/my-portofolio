"use client";

import { useMemo, useState, useTransition } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { saveService, deleteService } from "@/lib/actions";
import type { Service, ServiceIcon } from "@/lib/types";
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
import { Box, Layout, Monitor, Plus, Pencil, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ICON_OPTIONS: { value: ServiceIcon; label: string; icon: typeof Layout }[] = [
  { value: "layout", label: "Layout", icon: Layout },
  { value: "box", label: "Box", icon: Box },
  { value: "monitor", label: "Monitor", icon: Monitor },
  { value: "sparkles", label: "Sparkles", icon: Sparkles },
];

const emptyService: Partial<Service> = {
  title: "",
  description: "",
  icon: "layout",
  sort_order: 0,
  status: "published",
};

export function ServicesManager({ services }: { services: Service[] }) {
  const { t } = useAdminLanguage();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Service>>(emptyService);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveService({
        id: editing.id,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        icon: formData.get("icon") as ServiceIcon,
        sort_order: Number(formData.get("sort_order") || 0),
        status: formData.get("status") as "draft" | "published",
      });
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.serviceSaved);
        setOpen(false);
      }
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteService(deleteId);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.serviceDeleted);
        setDeleteId(null);
      }
    });
  }

  const columns = useMemo<ColumnDef<Service>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.services.titleCol} />
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
      },
      {
        accessorKey: "icon",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.services.fields.icon} />
        ),
        cell: ({ row }) => {
          const option = ICON_OPTIONS.find((item) => item.value === row.original.icon);
          const Icon = option?.icon ?? Layout;
          return (
            <span className="inline-flex items-center gap-2 capitalize text-muted-foreground">
              <Icon className="h-4 w-4" />
              {row.original.icon}
            </span>
          );
        },
      },
      {
        accessorKey: "description",
        header: t.services.fields.description,
        cell: ({ row }) => (
          <span className="line-clamp-2 max-w-md text-sm text-muted-foreground">
            {row.original.description}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.services.fields.status} />
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
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t.services.title}</h1>
          <p className="text-muted-foreground">{t.services.subtitle}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                onClick={() => {
                  setEditing(emptyService);
                  setOpen(true);
                }}
                className="w-full bg-primary hover:bg-primary/90 sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t.services.add}
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing.id ? t.services.edit : t.services.add}</DialogTitle>
            </DialogHeader>
            <form key={editing.id ?? "new"} action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t.services.fields.title}</Label>
                <Input name="title" defaultValue={editing.title ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label>{t.services.fields.description}</Label>
                <Textarea
                  name="description"
                  defaultValue={editing.description ?? ""}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t.services.fields.icon}</Label>
                  <select
                    name="icon"
                    defaultValue={editing.icon ?? "layout"}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{t.services.fields.sortOrder}</Label>
                  <Input
                    name="sort_order"
                    type="number"
                    defaultValue={editing.sort_order ?? 0}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.services.fields.status}</Label>
                <select
                  name="status"
                  defaultValue={editing.status ?? "published"}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="published">{t.services.fields.published}</option>
                  <option value="draft">{t.services.fields.draft}</option>
                </select>
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
        data={services}
        searchKey="title"
        searchPlaceholder={t.services.search}
        emptyMessage={t.services.empty}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        description={t.delete.service}
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
