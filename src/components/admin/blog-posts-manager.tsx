"use client";

import { useMemo, useState, useTransition } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { saveBlogPost, deleteBlogPost } from "@/lib/actions";
import type { BlogPost } from "@/lib/types";
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

const emptyPost: Partial<BlogPost> = {
  title: "",
  category: "Web Dev",
  author: "Adistira",
  excerpt: "",
  content: "",
  image_url: "",
  external_url: "",
  published_at: new Date().toISOString().slice(0, 10),
  sort_order: 0,
  status: "published",
  coming_soon: false,
};

export function BlogPostsManager({ posts }: { posts: BlogPost[] }) {
  const { t } = useAdminLanguage();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<BlogPost>>(emptyPost);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveBlogPost({
        id: editing.id,
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        author: formData.get("author") as string,
        excerpt: (formData.get("excerpt") as string) || null,
        content: (formData.get("content") as string) || null,
        image_url: (formData.get("image_url") as string) || null,
        external_url: (formData.get("external_url") as string) || null,
        published_at: (formData.get("published_at") as string) || new Date().toISOString().slice(0, 10),
        sort_order: Number(formData.get("sort_order") || 0),
        status: formData.get("status") as "draft" | "published",
        coming_soon: formData.get("coming_soon") === "on",
      });
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.blogSaved);
        setOpen(false);
      }
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteBlogPost(deleteId);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.blogDeleted);
        setDeleteId(null);
      }
    });
  }

  const columns = useMemo<ColumnDef<BlogPost>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.blog.titleCol} />
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.blog.category} />
        ),
      },
      {
        accessorKey: "author",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.blog.author} />
        ),
      },
      {
        accessorKey: "published_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.blog.fields.publishedAt} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.published_at}</span>
        ),
      },
      {
        accessorKey: "coming_soon",
        header: t.blog.fields.comingSoon,
        cell: ({ row }) => (row.original.coming_soon ? t.common.yes : t.common.no),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.blog.fields.status} />
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
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t.blog.title}</h1>
          <p className="text-muted-foreground">{t.blog.subtitle}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                onClick={() => {
                  setEditing(emptyPost);
                  setOpen(true);
                }}
                className="w-full bg-primary hover:bg-primary/90 sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t.blog.add}
              </Button>
            }
          />
          <DialogContent className="max-h-[90vh] w-[calc(100%-1rem)] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing.id ? t.blog.edit : t.blog.add}</DialogTitle>
            </DialogHeader>
            <form key={editing.id ?? "new"} action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t.blog.fields.title}</Label>
                <Input name="title" defaultValue={editing.title ?? ""} required />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t.blog.fields.category}</Label>
                  <Input name="category" defaultValue={editing.category ?? "Web Dev"} />
                </div>
                <div className="space-y-2">
                  <Label>{t.blog.fields.author}</Label>
                  <Input name="author" defaultValue={editing.author ?? "Adistira"} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.blog.fields.excerpt}</Label>
                <Textarea name="excerpt" defaultValue={editing.excerpt ?? ""} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>{t.blog.fields.content}</Label>
                <Textarea name="content" defaultValue={editing.content ?? ""} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>{t.blog.fields.imageUrl}</Label>
                <Input name="image_url" defaultValue={editing.image_url ?? ""} />
              </div>
              <div className="space-y-2">
                <Label>{t.blog.fields.externalUrl}</Label>
                <Input name="external_url" defaultValue={editing.external_url ?? ""} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t.blog.fields.publishedAt}</Label>
                  <Input
                    name="published_at"
                    type="date"
                    defaultValue={editing.published_at?.slice(0, 10) ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.blog.fields.sortOrder}</Label>
                  <Input name="sort_order" type="number" defaultValue={editing.sort_order ?? 0} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.blog.fields.status}</Label>
                <select
                  name="status"
                  defaultValue={editing.status ?? "published"}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="draft">{t.blog.fields.draft}</option>
                  <option value="published">{t.blog.fields.published}</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="coming_soon"
                  defaultChecked={editing.coming_soon ?? false}
                />
                {t.blog.fields.comingSoon}
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
        data={posts}
        searchKey="title"
        searchPlaceholder={t.blog.search}
        emptyMessage={t.blog.empty}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        description={t.delete.blog}
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
