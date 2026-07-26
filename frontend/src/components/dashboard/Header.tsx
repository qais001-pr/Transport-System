import { useContext, useEffect, useRef, useState } from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
//@ts-ignore
import { getFileUrl } from "../../api/apiConstant";
//@ts-ignore
import { socket } from "../../sockets/socket";
//@ts-ignore
import userContext from "../../context/userContext";

export const Header = ({ title, subtitle, role, profile }: any) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  const { user }: any = useContext(userContext);

  useEffect(() => {
    if (user?.id) {
      socket.emit("join-user");
      console.log("user joined", user?.id)
    }
  }, [user]);

  useEffect(() => {
    socket.emit("notification-history", { page: 1, limit: 20 });

    const handleHistory = (res: any) => {
      setNotifications(res.data || []);
    };

    socket.on("notification-history", handleHistory);

    return () => {
      socket.off("notification-history", handleHistory);
    };
  }, []);

  useEffect(() => {
    const handleNotification = (data: any) => {
      const newNotification = {
        id: data.id || Date.now(),
        title: data.title,
        message: data.message,
        createdAt: new Date(),
        is_read: false,
      };

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === newNotification.id);
        if (exists) return prev;

        return [newNotification, ...prev];
      });
    };

    socket.on("new-notification", handleNotification);

    return () => {
      socket.off("new-notification", handleNotification);
    };
  }, []);

  const markAsRead = () => {
    socket.emit("mark-as-read");

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    socket.emit("remove-notification", { id });
  };

  useEffect(() => {
    socket.on("notification-removed", ({ id }: any) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    });

    return () => {
      socket.off("notification-removed");
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* <Button variant="ghost" size="sm">
            <Search className="w-4 h-4" />
          </Button> */}

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(!open);
                if (!open) markAsRead(); // auto mark as read on open
              }}
              className="relative"
            >
              <Bell className="w-4 h-4" />

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Dropdown */}
            {open && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border z-50"
              >
                <div className="p-3 border-b font-semibold flex justify-between">
                  Notifications
                  <button
                    className="text-xs text-blue-500"
                    onClick={markAsRead}
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 text-center">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-sm border-b hover:bg-gray-100 flex justify-between gap-2 ${
                          !n.is_read ? "bg-gray-50" : ""
                        }`}
                      >
                        <div>
                          <p className="font-medium">{n.title}</p>
                          <p className="text-xs text-gray-600">{n.message}</p>
                        </div>

                        {/* Cancel button */}
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2 pl-3 border-l">
            {profile ? (
              <Avatar src={getFileUrl(profile)} size="sm" />
            ) : (
              <Avatar name={role || "User"} size="sm" />
            )}

            <div className="hidden md:block">
              <p className="text-sm font-medium">{role}</p>
              <p className="text-xs text-gray-600">Online</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
