"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

export default function DeletePropertyButton({ id }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    const confirmed = window.confirm(
      "Delete this property permanently? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/portfolio?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        window.alert(data.error || "Could not delete property.");
        return;
      }
      router.push("/dashboard/my-properties");
      router.refresh();
    } catch {
      window.alert("Something went wrong while deleting.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={deleting}
      className="inline-flex rounded-xl border border-red-200 bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:border-red-400 disabled:opacity-50 transition-colors"
    >
      {deleting ? "Deleting..." : "Delete property"}
    </button>
  );
}

