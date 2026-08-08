import {
  LayoutDashboard,
  Users,
  Receipt,
  BookPlus,
  MonitorPlay,
  Image as ImageIcon,
  HelpCircle,
  FolderTree,
  Sliders,
  UsersRound,
  BarChart3,
  ShoppingCart,
  UserCircle2,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  GraduationCap,
} from "lucide-react";


export const NAV_SECTIONS = [
  {
    label: "Dashboard",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin",
      },
    ],
  },

  {
    label: "Management",
    items: [
      {
        id: "users",
        label: "Users",
        icon: Users,
        path: "/admin/users",
      },
      {
        id: "invoices",
        label: "Invoices",
        icon: Receipt,
        path: "/admin/invoices",
      },
    ],
  },

  {
    label: "Content",
    items: [
      {
        id: "create-course",
        label: "Create Course",
        icon: BookPlus,
        path: "/admin/create-course",
      },
      {
        id: "live-courses",
        label: "Live Courses",
        icon: MonitorPlay,
        path: "/admin/courses",
      },
    ],
  },

  {
    label: "Customization",
    items: [
      {
        id: "hero",
        label: "Hero",
        icon: ImageIcon,
        path: "/admin/hero",
      },
      {
        id: "faq",
        label: "FAQ",
        icon: HelpCircle,
        path: "/admin/faq",
      },
      {
        id: "categories",
        label: "Categories",
        icon: FolderTree,
        path: "/admin/categories",
      },
    ],
  },

  {
    label: "Controllers",
    items: [
      {
        id: "team",
        label: "Manage Team",
        icon: UsersRound,
        path: "/admin/team",
      },
    ],
  },

  {
    label: "Analytics",
    items: [
      {
        id: "course-analytics",
        label: "Course Analytics",
        icon: BarChart3,
        path: "/admin/courses-analytics",
      },
      {
        id: "order-analytics",
        label: "Order Analytics",
        icon: ShoppingCart,
        path: "/admin/orders-analytics",
      },
      {
        id: "user-analytics",
        label: "User Analytics",
        icon: UserCircle2,
        path: "/admin/users-analytics",
      },
    ],
  },

  {
    label: "Extras",
    items: [
      {
        id: "logout",
        label: "Logout",
        icon: LogOut,
        path: "#", 
      },
    ],
  },
];

