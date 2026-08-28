"use client";

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Yes, I completed it",
  cancelLabel = "Not yet",
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-zinc-700 bg-[#0b0b0b] p-6 shadow-2xl"
      >
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 font-body text-sm text-zinc-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 font-body text-sm text-zinc-400 transition-colors hover:bg-zinc-900"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-blue-600 px-4 py-2 font-body text-sm font-medium text-white transition-opacity hover:bg-blue-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
