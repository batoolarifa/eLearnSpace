"use client";

import React, { FC, useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Avatar, Tooltip, IconButton } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { Inbox, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import Loader from "../../../components/Loader/Loader";
import { format } from "timeago.js";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../../../../redux/features/user/userApi";
import AddAdminModal from "../Team/AddAdminModal";
import DeleteConfirmModal from "../../../utils/DeleteConfirmModal";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  purchased: number;
  avatar: string;
  created_at: string;
}

type Props = {
  isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { isLoading, data, error, refetch } = useGetAllUsersQuery({});
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [rows, setRows] = useState<UserRow[]>([]);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);

  useEffect(() => {
    if (data) {
      const formattedRows: UserRow[] = (
        isTeam
          ? data.users.filter((user: any) => user.role === "admin")
          : data.users
      ).map((item: any) => ({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        purchased: item.courses?.length || 0,
        avatar: item.avatar?.url,
        created_at: format(item.createdAt),
      }));

      setRows(formattedRows);
    }
  }, [data, isTeam]);

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id).unwrap();
      toast.success(`${userToDelete.name} was deleted successfully.`);
      refetch();
      setUserToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user.");
    }
  };

  const columns: GridColDef<UserRow>[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      minWidth: 65,
      renderCell: (params) => (
        <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          #{String(params.value).slice(-6)}
        </span>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<UserRow>) => (
        <div className="flex items-center gap-3 py-2 overflow-hidden">
          <Avatar
            src={params.row.avatar}
            alt={params.row.name}
            sx={{
              width: 32,
              height: 32,
              fontSize: "13px",
              fontWeight: 700,
              bgcolor: "#10b981",
              color: "#ffffff",
              flexShrink: 0,
            }}
          >
            {params.row.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <span className="truncate text-[13.5px] font-semibold text-slate-900 dark:text-slate-100">
            {params.row.name}
          </span>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.8,
      minWidth: 140,
      renderCell: (params) => (
        <span className="truncate text-[13px] font-medium text-slate-500 dark:text-slate-400">
          {params.value}
        </span>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.8,
      minWidth: 80,
      renderCell: (params) => {
        const isAdmin = params.value === "admin";
        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
              isAdmin
                ? "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                : "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-300"
            }`}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "purchased",
      headerName: "Purchased",
      flex: 1,
      minWidth: 105,
      renderCell: (params) => (
        <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {params.value} {params.value === 1 ? "Course" : "Courses"}
        </span>
      ),
    },
    {
      field: "created_at",
      headerName: "Joined",
      flex: 0.9,
      minWidth: 85,
      renderCell: (params) => (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {params.value}
        </span>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.7,
      minWidth: 75,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<UserRow>) => (
        <Tooltip title="Delete User" arrow placement="top">
          <IconButton
            onClick={() => setUserToDelete(params.row)}
            size="small"
            className="transition-colors hover:bg-rose-500/10 dark:hover:bg-rose-500/20"
          >
            <AiOutlineDelete
              size={18}
              className="text-slate-500 transition-colors hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400"
            />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "emailAction",
      headerName: "Email",
      flex: 0.7,
      minWidth: 75,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<UserRow>) => (
        <Tooltip title="Send Email" arrow placement="top">
            <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
              params.row.email
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton
              size="small"
              className="transition-colors hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
            >
              <AiOutlineMail
                size={18}
                className="text-slate-500 transition-colors hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400"
              />
            </IconButton>
          </a>
        </Tooltip>
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {isTeam ? "Manage Team" : "All Users"}
          </h1>

          <p className="mt-1.5 text-sm text-slate-500 dark:text-[#94a3b8]">
            {isTeam
              ? "Manage and monitor all platform administrators."
              : "View and monitor all registered platform users."}
          </p>
        </div>

        {isTeam && (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all duration-150 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/25 active:scale-[0.98] sm:self-auto"
            onClick={() => setOpenAddAdmin(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Admin</span>
          </button>
        )}
      </div>

      {/* MUI DataGrid Card Container */}
      <Box
       sx={{
    width: "100%",
    overflowX: "auto",
    borderRadius: "20px",
  }}
    >

      <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minWidth: 1000, // important
      minHeight: { xs: 450, sm: 520, lg: 620 },
      height: { xs: 450, sm: 520, lg: 620 },
      p: { xs: 1, sm: 2 },
      borderRadius: "20px",
      backgroundColor: isDark ? "#111827" : "#ffffff",
      border: isDark
        ? "1px solid rgba(255,255,255,.08)"
        : "1px solid #e5e7eb",
      boxShadow: isDark
        ? "0 1px 2px rgba(0,0,0,.2)"
        : "0 10px 30px rgba(15,23,42,.06)",
    }}
  >
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          columnHeaderHeight={54}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          slots={{
            noRowsOverlay: () => (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
                <Inbox className="h-8 w-8" strokeWidth={1.5} />
                <p className="text-sm font-medium">No users found</p>
              </div>
            ),
          }}
          sx={{
            flex: 1,
            border: "none",
            color: isDark ? "#f8fafc" : "#111827",
            backgroundColor: isDark ? "#111827" : "#ffffff",
            fontSize: "13.5px",

            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: isDark ? "#111827" : "#ffffff",
              overflowX: "hidden !important",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            },

            "& .MuiDataGrid-main": {
              borderRadius: "14px",
              overflow: "hidden",
            },

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: isDark ? "#1a2333" : "#f8fafc",
              borderBottom: isDark
                ? "1px solid rgba(255,255,255,.08)"
                : "1px solid #e5e7eb",
              borderRadius: 0,
            },

            "& .MuiDataGrid-columnHeader": {
              backgroundColor: isDark ? "#1a2333" : "#f8fafc",
              paddingLeft: "8px",
              paddingRight: "8px",
              "&:focus, &:focus-within": {
                outline: "none",
              },
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              color: isDark ? "#e5e7eb" : "#334155",
              fontWeight: 700,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: ".05em",
            },

            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },

            "& .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton":
              {
                color: isDark ? "#94a3b8" : "#64748b",
              },

            "& .MuiDataGrid-cell": {
              borderBottom: isDark
                ? "1px solid rgba(255,255,255,.06)"
                : "1px solid #f1f5f9",
              color: isDark ? "#f3f4f6" : "#111827",
              display: "flex",
              alignItems: "center",
              paddingTop: "4px",
              paddingBottom: "4px",
              paddingLeft: "8px",
              paddingRight: "8px",
              "&:focus, &:focus-within": {
                outline: "none !important",
              },
            },

            "& .MuiDataGrid-row": {
              transition: "background-color .15s ease",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: isDark
                ? "rgba(16,185,129,.08)"
                : "rgba(16,185,129,.05)",
            },

            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: isDark
                ? "rgba(16,185,129,.15)"
                : "rgba(16,185,129,.10)",
            },

            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: isDark
                ? "rgba(16,185,129,.18)"
                : "rgba(16,185,129,.14)",
            },

            "& .MuiDataGrid-footerContainer": {
              flexShrink: 0,
              backgroundColor: isDark ? "#1a2333" : "#f8fafc",
              borderTop: isDark
                ? "1px solid rgba(255,255,255,.08)"
                : "1px solid #e5e7eb",
              borderBottomLeftRadius: "14px",
              borderBottomRightRadius: "14px",
              color: isDark ? "#f8fafc" : "#111827",
              minHeight: "52px",
            },

            "& .MuiTablePagination-root": {
              color: isDark ? "#cbd5e1" : "#475569",
              fontSize: "13px",
            },

            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "13px",
              },

            "& .MuiCheckbox-root": {
              color: isDark ? "#64748b" : "#94a3b8",
            },

            "& .MuiCheckbox-root.Mui-checked": {
              color: "#10b981",
            },

            "& .MuiDataGrid-overlay": {
              backgroundColor: isDark ? "#111827" : "#ffffff",
            },
          }}
        />
      </Box>
      </Box>

      {/* Add Admin Modal */}
      {isTeam && (
        <AddAdminModal
          open={openAddAdmin}
          onClose={() => setOpenAddAdmin(false)}
          users={data?.users || []}
          refetch={refetch}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        user={
          userToDelete
            ? {
                name: userToDelete.name,
                email: userToDelete.email,
                avatar: userToDelete.avatar,
              }
            : null
        }
      />
    </div>
  );
};

export default AllUsers;