import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import userContext from "../../context/userContext";
import { getFileUrl } from "../../api/apiConstant";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const AvatarProfile = ({ title, subtitle }: HeaderProps) => {
  const { user, logOut } = useContext(userContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const userName = user?.full_name || user?.name || "User";
  const userRole = user?.role || "Guest";
  
  // if (user?.profile_photo) {
  //   const imageUrl = getFileUrl(user.profile_photo);
  //   console.log("Original profile_photo:", user.profile_photo);
  //   console.log("Generated image URL:", imageUrl);
  // }

  return (
    <header className="px-4 sm:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Actions Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Profile Dropdown */}
          <div
            className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-neutral-200 relative"
            ref={dropdownRef}
          >
            {/* Avatar Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 sm:gap-2 hover:bg-neutral-50 rounded-lg p-1 sm:p-2 transition-colors"
              title="Profile Menu"
              aria-expanded={isDropdownOpen}
            >
              {user?.profile_photo ? (
                <Avatar
                  src={
                    user.profile_photo instanceof File
                      ? URL.createObjectURL(user.profile_photo)
                      : getFileUrl(user.profile_photo)
                  }
                  name={userName}
                  size="sm"
                />
              ) : (
                <Avatar name={userName} size="sm" />
              )}
              <div className="hidden md:flex flex-col items-start min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-neutral-600 truncate capitalize">
                  {userRole.toLowerCase()}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-600 transition-transform duration-200 hidden sm:block ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 origin-top-right">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
                  <p className="text-sm font-semibold text-neutral-900 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-neutral-600 truncate capitalize">
                    {userRole.toLowerCase()}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {/* Dashboard Link */}
                  <Link
                    to={`/dashboard/${user?.role ? user.role.toLowerCase() : "user"}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary hover:text-white transition-colors duration-150"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary hover:text-white transition-colors duration-150"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200" />

                {/* Logout Button */}
                <button
                  onClick={logOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
