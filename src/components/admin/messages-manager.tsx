"use client";

import { useMemo, useState, useTransition } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { markMessageRead, deleteMessage } from "@/lib/actions";
import type { ContactMessage } from "@/lib/types";
import { parseContactMessage } from "@/lib/message-utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Eye, Mail, MessageSquare, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatMessageDate(date: string, locale: "en" | "id") {
  return new Date(date).toLocaleString(locale === "id" ? "id-ID" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function MessagePreview({
  message,
  onOpen,
  labels,
}: {
  message: ContactMessage;
  onOpen: () => void;
  labels: { subject: string; phone: string; viewDetail: string };
}) {
  const parsed = parseContactMessage(message.message);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full max-w-md text-left"
    >
      <div className="rounded-xl border border-border bg-muted/30 p-3 transition hover:border-primary/30 hover:bg-muted/50">
        {(parsed.subject || parsed.phone) && (
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {parsed.subject && (
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-xs text-primary">
                {labels.subject}: {parsed.subject}
              </Badge>
            )}
            {parsed.phone && (
              <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" />
                {parsed.phone}
              </span>
            )}
          </div>
        )}

        <p className="line-clamp-2 text-sm leading-relaxed text-foreground">{parsed.body}</p>

        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
          <Eye className="h-3.5 w-3.5" />
          {labels.viewDetail}
        </span>
      </div>
    </button>
  );
}

function MessageDetailBody({
  raw,
  labels,
}: {
  raw: string;
  labels: { subject: string; phone: string; message: string };
}) {
  const parsed = parseContactMessage(raw);

  return (
    <div className="space-y-4">
      {(parsed.subject || parsed.phone) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {parsed.subject && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {labels.subject}
              </p>
              <p className="mt-1 font-medium">{parsed.subject}</p>
            </div>
          )}
          {parsed.phone && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {labels.phone}
              </p>
              <a href={`tel:${parsed.phone}`} className="mt-1 inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                <Phone className="h-4 w-4" />
                {parsed.phone}
              </a>
            </div>
          )}
        </div>
      )}

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          {labels.message}
        </p>
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {parsed.body}
        </div>
      </div>
    </div>
  );
}

export function MessagesManager({ messages }: { messages: ContactMessage[] }) {
  const { t, locale } = useAdminLanguage();
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openDetail(message: ContactMessage) {
    setSelected(message);
    if (!message.read) {
      startTransition(async () => {
        await markMessageRead(message.id, true);
      });
    }
  }

  function toggleRead(id: string, read: boolean) {
    startTransition(async () => {
      const result = await markMessageRead(id, !read);
      if (result.error) toast.error(result.error);
      else if (selected?.id === id) {
        setSelected((current) => (current ? { ...current, read: !read } : null));
      }
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteMessage(deleteId);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t.toast.messageDeleted);
        if (selected?.id === deleteId) setSelected(null);
        setDeleteId(null);
      }
    });
  }

  const columns = useMemo<ColumnDef<ContactMessage>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.messages.name} />
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.messages.email} />
        ),
        cell: ({ row }) => (
          <a
            href={`mailto:${row.original.email}`}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.email}
          </a>
        ),
      },
      {
        accessorKey: "message",
        header: t.messages.message,
        cell: ({ row }) => (
          <MessagePreview
            message={row.original}
            onOpen={() => openDetail(row.original)}
            labels={{
              subject: t.messages.subject,
              phone: t.messages.phone,
              viewDetail: t.messages.viewDetail,
            }}
          />
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t.messages.receivedAt} />
        ),
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {formatMessageDate(row.original.created_at, locale)}
          </span>
        ),
      },
      {
        accessorKey: "read",
        header: t.messages.status,
        cell: ({ row }) => (
          <Badge variant={row.original.read ? "secondary" : "default"}>
            {row.original.read ? t.messages.read : t.messages.unread}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">{t.common.actions}</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openDetail(row.original)}
              title={t.messages.viewDetail}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => toggleRead(row.original.id, row.original.read)}
              title={row.original.read ? t.messages.markUnread : t.messages.markRead}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteId(row.original.id)}
              title={t.common.delete}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [isPending, locale, t],
  );

  return (
    <div>
      <h1 className="mb-2 text-2xl font-extrabold text-foreground sm:text-3xl">{t.messages.title}</h1>
      <p className="mb-8 text-muted-foreground">{t.messages.subtitle}</p>

      <DataTable
        columns={columns}
        data={messages}
        searchKey="name"
        searchPlaceholder={t.messages.search}
        emptyMessage={t.messages.empty}
      />

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <div className="overflow-y-auto px-6 pt-6 pb-4">
            <DialogHeader>
              <DialogTitle>{t.messages.detailTitle}</DialogTitle>
            </DialogHeader>

            {selected && (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={selected.read ? "secondary" : "default"}>
                    {selected.read ? t.messages.read : t.messages.unread}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatMessageDate(selected.created_at, locale)}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t.messages.name}
                    </p>
                    <p className="mt-1 font-medium">{selected.name}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t.messages.email}
                    </p>
                    <a
                      href={`mailto:${selected.email}`}
                      className="mt-1 block font-medium text-primary hover:underline"
                    >
                      {selected.email}
                    </a>
                  </div>
                </div>

                <MessageDetailBody
                  raw={selected.message}
                  labels={{
                    subject: t.messages.subject,
                    phone: t.messages.phone,
                    message: t.messages.message,
                  }}
                />
              </div>
            )}
          </div>

          <div className="shrink-0 px-6 pt-5 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {selected && (
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${selected.email}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {t.messages.replyEmail}
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => toggleRead(selected.id, selected.read)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {selected.read ? t.messages.markUnread : t.messages.markRead}
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => setSelected(null)}
                className="w-full sm:ml-auto sm:w-auto"
              >
                {t.messages.close}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        description={t.delete.message}
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
