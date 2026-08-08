"use client";

import React, { FC, useMemo, useState } from "react";
import { X, Search, ShieldCheck } from "lucide-react";
import { Avatar } from "@mui/material";
import { toast } from "react-hot-toast";
import { useUpdateUserRoleMutation } from "../../../../redux/features/user/userApi";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    url?: string;
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  users: User[];
  refetch: () => void;
};

const AddAdminModal: FC<Props> = ({
  open,
  onClose,
  users,
  refetch,
}) => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [updateUserRole, { isLoading }] =
    useUpdateUserRoleMutation();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (user.role !== "user") return false;

      const keyword = search.toLowerCase();

      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      );
    });
  }, [users, search]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error("Please select a user.");
      return;
    }

    try {
      await updateUserRole({
        id: selectedUser._id,
        role: "admin",
      }).unwrap();

      toast.success(
        `${selectedUser.name} is now an admin.`
      );

      refetch();

      setSelectedUser(null);
      setSearch("");

      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#111827]">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">

          <div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Add Administrator
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Promote an existing user to administrator.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>

        </div>

        {/* Search */}

        <div className="p-6">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />

          </div>

          {/* User List */}

          <div className="mt-5 max-h-72 overflow-y-auto space-y-2">

            {filteredUsers.length === 0 ? (

              <div className="py-10 text-center text-sm text-slate-400">
                No users found.
              </div>

            ) : (

              filteredUsers.map((user) => (

                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-3 text-left transition

                  ${
                    selectedUser?._id === user._id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-slate-200 hover:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-500"
                  }`}
                >

                  <Avatar
                    src={user.avatar?.url}
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: "#10b981",
                    }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>

                  <div className="flex-1">

                    <p className="font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {user.email}
                    </p>

                  </div>

                  {selectedUser?._id === user._id && (
                    <ShieldCheck
                      className="text-emerald-500"
                      size={20}
                    />
                  )}

                </button>

              ))

            )}

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5 dark:border-slate-700">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            disabled={!selectedUser || isLoading}
            onClick={handleSubmit}
            className="rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Make Admin"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default AddAdminModal;