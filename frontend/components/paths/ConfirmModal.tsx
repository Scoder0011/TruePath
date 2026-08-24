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
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-ink-deep"
      >
        <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 font-body text-sm text-gray-600 dark:text-ink-soft">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 font-body text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-ink-soft dark:hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-amber px-4 py-2 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
