import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3, Users, Menu, X, Heart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/services/firebase";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/patients", icon: Users, label: "Patients" },
];

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-['Plus_Jakarta_Sans'] font-bold">MedCore</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <nav className="border-b bg-card p-2 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => { logout(); setOpen(false); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-muted-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </nav>
      )}
    </div>
  );
};
