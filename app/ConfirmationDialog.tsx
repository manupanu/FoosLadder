"use client";
import { ReactNode } from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-charcoal-700 rounded-xl p-6 max-w-md w-full mx-4 border border-persian_green-500/30 shadow-xl animate-fadeInUp">
        <h3 className="text-xl font-bold text-saffron-400 mb-4">{title}</h3>
        <div className="text-charcoal-200 mb-6">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-charcoal-600 text-charcoal-200 hover:bg-charcoal-500 transition font-medium focus:outline-none focus:ring-2 focus:ring-charcoal-400"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 ${
              isDangerous
                ? "bg-burnt_sienna-600 text-white hover:bg-burnt_sienna-700 focus:ring-burnt_sienna-400"
                : "bg-persian_green-600 text-white hover:bg-persian_green-700 focus:ring-persian_green-400"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}