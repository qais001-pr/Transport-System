import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Bus,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import userContext from "../../context/userContext";
import { AvatarProfile } from "../dashboard/Avatar";
import { getFileUrl } from "../../api/apiConstant";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLogin, user, logOut }: any = useContext(userContext);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#safety", label: "Safety" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-soft">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <Bus className="w-7 h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary leading-tight">
                Van Pooling
              </h1>
              <p className="text-xs text-neutral-600">School Transport</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-neutral-700 hover:text-primary font-medium transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          {!isLogin && !user ? (
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="md">
                  <LogIn className="w-5 h-5" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="md">
                  <User className="w-5 h-5" />
                  Register
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <AvatarProfile title="Dashboard" subtitle="Parent" />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-y-auto max-h-[70vh] pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-300",
            isOpen ? "max-h-[70vh] pb-6" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-neutral-700 hover:text-primary font-medium transition-colors duration-200 py-2"
              >
                {link.label}
              </a>
            ))}
            {!isLogin && !user ? (
              <div className="flex flex-col gap-3 pt-4 border-t border-neutral-200">
                <Link to="/login" className="w-full">
                  <Button
                    variant="ghost"
                    size="md"
                    className="w-full justify-center"
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                  >
                    <User className="w-5 h-5" />
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-4 border-t border-neutral-200">
                {/* Mobile User Profile Card */}
                <div className="bg-neutral-50 rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-3 mb-3">
                    {user?.profile_photo ? (
                      <Avatar
                        src={
                          user.profile_photo instanceof File
                            ? URL.createObjectURL(user.profile_photo)
                            : getFileUrl(user.profile_photo)
                        }
                        name={user?.full_name || user?.name || "User"}
                        size="sm"
                      />
                    ) : (
                      <Avatar
                        name={user?.full_name || user?.name || "User"}
                        size="sm"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {user?.full_name || user?.name || "User"}
                      </p>
                      <p className="text-xs text-neutral-600 truncate capitalize">
                        {user?.role?.toLowerCase() || "Guest"}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Menu Links */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/dashboard/${
                        user?.role ? user.role.toLowerCase() : "user"
                      }`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-white hover:text-primary rounded transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-white hover:text-primary rounded transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
