"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Tooltip, IconButton } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { Plus, Inbox } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import { useDeleteCourseMutation, useGetAllCoursesQuery } from "../../../../redux/features/courses/coursesApi";
import Loader from "../../../components/Loader/Loader";
import { format } from "timeago.js";
import DeleteCourseModal from "./DeleteCourseModal";
import Link from "next/link";
import { redirect } from "next/navigation";

export interface CourseRow {
  id: string;
  title: string;
  ratings: string;
  purchased: string;
  created_at: string;
}

export default function AllCourses() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { isLoading, data, refetch } = useGetAllCoursesQuery({},  {
  refetchOnMountOrArgChange: true,
  });
  const [deleteCourse, { isSuccess, error, isLoading: isDeleting }] = useDeleteCourseMutation({});

  const [rows, setRows] = useState<CourseRow[]>([]);
  const [courseToDelete, setCourseToDelete] = useState<CourseRow | null>(null);

  useEffect(() => {
    if (data) {
      const formattedRows: CourseRow[] = data.courses.map((item: any) => ({
        id: item._id,
        title: item.name,
        ratings: item.ratings,
        purchased: item.purchased,
        created_at: format(item.createdAt),
      }));
      setRows(formattedRows);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course deleted successfully.");
      refetch();
      setCourseToDelete(null);
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage?.data?.message || "Failed to delete course.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    await deleteCourse(courseToDelete.id);
  };

  const columns: GridColDef<CourseRow>[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          #{String(params.value).slice(-6)}
        </span>
      ),
    },
    {
      field: "title",
      headerName: "Course Title",
      flex: 3,
      minWidth: 280,
      renderCell: (params) => (
        <span className="whitespace-normal break-words py-3 text-[13.5px] font-semibold leading-snug text-slate-900 dark:text-slate-100">
          {params.value}
        </span>
      ),
    },
    {
      field: "ratings",
      headerName: "Ratings",
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <FaStar className="text-[13px] text-amber-400" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "purchased",
      headerName: "Purchased",
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => (
        <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {params.value} Sales
        </span>
      ),
    },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {params.value}
        </span>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.4,
      minWidth: 64,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<CourseRow>) => (
        <Tooltip title="Edit Course" arrow placement="top">
          <Link href={`/admin/edit-course/${params.row.id}`}>
            <IconButton
              size="small"
              className="transition-colors hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
            >
              <FiEdit2
                size={17}
                className="text-slate-500 transition-colors hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400"
              />
            </IconButton>
          </Link>
        </Tooltip>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.4,
      minWidth: 64,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<CourseRow>) => (
        <Tooltip title="Delete Course" arrow placement="top">
          <IconButton
            onClick={() => setCourseToDelete(params.row)}
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
            All Courses
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-[#94a3b8]">
            Manage, edit and monitor all published courses.
          </p>
        </div>

        {/* Add Course CTA Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all duration-150 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/25 active:scale-[0.98] sm:self-auto"
            onClick={() => redirect("/admin/create-course")}
        >
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* MUI DataGrid Card Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: { xs: 480, md: 560, xl: 640 },
          height: { xs: 480, md: 560, xl: 640 },
          p: { xs: 1.5, sm: 2 },
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
                <p className="text-sm font-medium">No courses found</p>
              </div>
            ),
          }}
          sx={{
            flex: 1,
            border: "none",
            color: isDark ? "#f8fafc" : "#111827",
            backgroundColor: isDark ? "#111827" : "#ffffff",
            fontSize: "13.5px",

            "& .MuiDataGrid-main": {
              borderRadius: "14px",
              overflow: "hidden",
            },

            // Header
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: isDark ? "#1a2333" : "#f8fafc",
              borderBottom: isDark
                ? "1px solid rgba(255,255,255,.08)"
                : "1px solid #e5e7eb",
              borderRadius: 0,
            },

            "& .MuiDataGrid-columnHeader": {
              backgroundColor: isDark ? "#1a2333" : "#f8fafc",
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

            // Rows & cells
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: isDark ? "#111827" : "#ffffff",
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

            // Footer / pagination — pinned at the bottom of the card
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

      {/* Delete Confirmation Modal */}
      <DeleteCourseModal
        open={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        course={
          courseToDelete
            ? {
                title: courseToDelete.title,
                ratings: courseToDelete.ratings,
                purchased: courseToDelete.purchased,
              }
            : null
        }
      />
    </div>
  );
}