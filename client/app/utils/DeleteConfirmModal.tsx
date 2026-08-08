"use client";

import React, { FC } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Avatar } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  user: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
};

const DeleteConfirmModal: FC<Props> = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
  user,
}) => {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#111827]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10">
              <AlertTriangle size={20} className="text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete User
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 transition hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete this user? All of their data will
            be permanently removed.
          </p>

          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
            <Avatar
              src={user.avatar}
              sx={{
                width: 42,
                height: 42,
                bgcolor: "#10b981",
              }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-semibold text-slate-900 dark:text-white">
                {user.name}
              </p>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5 dark:border-slate-700">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-rose-500 px-5 py-2.5 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;