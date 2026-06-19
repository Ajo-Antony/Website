"use client";

import { useState } from "react";

export default function DeleteButton({
  id,
  action,
  label = "Delete",
  confirmText = "Delete this item? This can't be undone.",
}: {
  id: string;
  action: (id: string) => Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      onClick={async () => {
        if (!confirm(confirmText)) return;
        setBusy(true);
        await action(id);
        setBusy(false);
      }}
      disabled={busy}
      className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {busy ? "Deleting…" : label}
    </button>
  );
}
