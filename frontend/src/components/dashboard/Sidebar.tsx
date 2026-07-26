import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Route,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
  Bus,
  MapPin,
  Calendar,
  User,
  CalendarCheck,
  Truck,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

type UserRole = "parent" | "driver" | "admin" | "guard" | "school" | "police";

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  userEmail: string;
  logOut: () => void;
}

export const Sidebar = ({
  userRole,
  userName,
  userEmail,
  logOut,
}: SidebarProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navigationItems = {
    parent: [
      { name: "Dashboard", href: "/dashboard/parent", icon: Home },
      { name: "Children", href: "/dashboard/parent/children", icon: Users },
      { name: "Bookings", href: "/dashboard/parent/bookings", icon: Calendar },
      { name: "Live Tracking", href: "/dashboard/parent/track", icon: MapPin },
      {
        name: "Payments",
        href: "/dashboard/parent/payments",
        icon: DollarSign,
      },
      { name: "Vans", href: "/dashboard/parent/vans", icon: Bus },
      {
        name: "Feedback",
        href: "/dashboard/parent/feedback",
        icon: AlertTriangle,
      },
      {
        name: "Children Leave",
        href: "/dashboard/parent/children-leave",
        icon: CalendarCheck,
      },
    ],
    driver: [
      { name: "Dashboard", href: "/dashboard/driver", icon: Home },
      { name: "Routes", href: "/dashboard/driver/routes", icon: Route },
      { name: "Students", href: "/dashboard/driver/students", icon: Users },
      // { name: "Schedule", href: "/dashboard/driver/schedule", icon: Calendar },
      {
        name: "Live Tracking",
        href: "/dashboard/driver/tracking",
        icon: MapPin,
      },
      {
        name: "Earnings",
        href: "/dashboard/driver/earnings",
        icon: DollarSign,
      },
      {
        name: "Feedback",
        href: "/dashboard/driver/feedback",
        icon: AlertTriangle,
      },
      // {
      //   name: "Messages",
      //   href: "/dashboard/driver/messages",
      //   icon: AlertTriangle,
      // },
      { name: "Delay Reports", href: "/dashboard/driver/delays", icon: Clock },
      { name: "Leaves", href: "/dashboard/driver/leaves", icon: CalendarCheck },
      { name: "Vans", href: "/dashboard/driver/vans", icon: Truck },
    ],
    admin: [
      { name: "Dashboard", href: "/dashboard/admin", icon: Home },
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      { name: "Drivers", href: "/dashboard/admin/drivers", icon: Bus },
      { name: "Vans", href: "/dashboard/admin/vans", icon: Route },
      { name: "Routes", href: "/dashboard/admin/routes", icon: MapPin },
      {
        name: "Verifications",
        href: "/dashboard/admin/verifications",
        icon: Settings,
      },
      {
        name: "Complaints",
        href: "/dashboard/admin/complaints",
        icon: AlertTriangle,
      },
      { name: "Reports", href: "/dashboard/admin/reports", icon: TrendingUp },
    ],
    guard: [
      { name: "Dashboard", href: "/dashboard/guard", icon: Home },
      { name: "Vans", href: "/dashboard/guard/vans", icon: Bus },
      { name: "Students", href: "/dashboard/guard/students", icon: Users },
      // { name: "Schedule", href: "/dashboard/guard/schedule", icon: Calendar },
      // {
      //   name: "Verifications",
      //   href: "/dashboard/guard/verification",
      //   icon: Settings,
      // },
      { name: "Alerts", href: "/dashboard/guard/alerts", icon: AlertTriangle },
      // { name: "Reports", href: "/dashboard/guard/reports", icon: TrendingUp },
    ],
    // school: [
    //   { name: "Dashboard", href: "/dashboard/school", icon: Home },
    //   { name: "Students", href: "/dashboard/school/students", icon: Users },
    //   { name: "Teachers", href: "/dashboard/school/teachers", icon: Users },
    //   { name: "Routes", href: "/dashboard/school/routes", icon: Route },
    //   { name: "Vans", href: "/dashboard/school/vans", icon: Bus },
    // ],
    police: [
      { name: "Dashboard", href: "/dashboard/police", icon: Home },
      {
        name: "Verification Records",
        href: "/dashboard/police/records",
        icon: Users,
      },
      // {
      //   name: "Violations",
      //   href: "/dashboard/police/violations",
      //   icon: AlertTriangle,
      // },
      { name: "Reports", href: "/dashboard/police/reports", icon: TrendingUp },
    ],
    school: [
      { name: "Dashboard", href: "/dashboard/school", icon: Home },
      {
        name: "Complaints",
        href: "/dashboard/school/complaints",
        icon: AlertTriangle,
      },
      {
        name: "Driver Reports",
        href: "/dashboard/school/reports",
        icon: TrendingUp,
      },
      { name: "Guards", href: "/dashboard/school/guards", icon: Users },
      { name: "Branches", href: "/dashboard/school/branches", icon: Bus },
    ],
  };

  const currentNavItems = navigationItems[userRole.toLowerCase() as UserRole];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  Van Pooling
                </h2>
                <p className="text-xs text-neutral-600">Management System</p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <Avatar name={userName} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-neutral-600 truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {currentNavItems?.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-neutral-700 hover:bg-neutral-100",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            <div className="space-y-1">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <User className="w-5 h-5" />
                Profile
              </Link>
              <button
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors w-full text-left"
                onClick={logOut}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
