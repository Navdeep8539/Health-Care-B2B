import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Bell,
  LogOut,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/services/firebase";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/patients", icon: Users, label: "Patients" },
];

export const AppSidebar = () => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar-background text-sidebar-foreground min-h-screen p-4">
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="p-2 bg-primary rounded-xl">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-sidebar-foreground">
            MedCore
          </h1>
          <p className="text-xs text-sidebar-muted">Healthcare Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              location.pathname === to
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border pt-4 space-y-3">
        <div className="px-3">
          <p className="text-sm font-medium truncate">{user?.email ?? "User"}</p>
          <p className="text-xs text-sidebar-muted">Staff</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
