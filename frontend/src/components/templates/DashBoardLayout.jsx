import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, User, Settings, Menu, LogOut, X, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/mainlogo.png";
import ThemeToggle from "@/components/molecules/ThemeToggle";
import ProfileAvatar from "@/components/atoms/ProfileAvatar";
import NotificationBell from "@/components/atoms/NotificationBell";
import { useNavigate } from "react-router-dom";
const DashboardLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home />, path: "/dashboard" },
    { name: "Users", icon: <User />, path: "/users" },
    { name: "Settings", icon: <Settings />, path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-background text-text">
      {/* Sidebar (Desktop) */}
      <div
        className={`
          ${isOpen ? "w-56" : "w-16"}
          bg-card shadow-md transition-all duration-300 hidden lg:flex flex-col
        `}
      >
        {isOpen ? (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <img src={logo} alt="MyApp" className="w-8 h-7 rounded" />
            <button
              className="p-1 rounded hover:bg-card-muted cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <X />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center p-4 border-b border-border">
            <img src={logo} alt="MyApp" className="w-8 h-7 rounded mb-3" />
            <button
              className="p-1 rounded hover:bg-card-muted cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <Menu />
            </button>
          </div>
        )}

        <nav className={`flex-1 ${isOpen ? "mt-12" : "mt-4"} space-y-2`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path} // ✅ Instead of href
              className={({ isActive }) =>
                `flex items-center ${
                  isOpen ? "gap-3 px-5" : "justify-center"
                } p-3 rounded-md cursor-pointer transition-colors duration-150 ${
                  isActive
                    ? "bg-card-muted font-semibold"
                    : "hover:bg-card-muted"
                }`
              }
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="py-2 border-t border-border">
          <div
            className={`flex items-center ${
              isOpen ? "gap-3 px-3" : "flex-col"
            } rounded-md cursor-pointer `}
            onClick={() => {
              navigate(`/profile`);
            }}
          >
            <ProfileAvatar user={user} />

            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {user?.fullName || "Guest User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{user?.username || "unknown"}
                </span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            className={`flex items-center  ${
              isOpen ? "px-5 gap-3" : " justify-center"
            } w-full p-3 hover:bg-card-muted rounded-md mt-2 cursor-pointer`}
            onClick={() => logout()}
          >
            <LogOut />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 cursor-pointer ${
            isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Drawer */}
        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-56 bg-card shadow-lg z-50 transform transition-transform duration-300 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col`} // 👈 important: make it a flex column
        >
          <div className="flex items-center justify-between p-2 border-b border-border">
            <img src={logo} alt="MyApp" className="w-8 h-7 rounded" />
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded hover:bg-card-muted cursor-pointer"
            >
              <X />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 px-4.5 rounded-md ${
                    isActive
                      ? "bg-card-muted font-semibold"
                      : "hover:bg-card-muted"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout button pushed to bottom */}
          <div className="mt-auto p-2 space-y-2 border-t border-border">
            <div
              className={`flex items-center gap-3 p-1 rounded-md cursor-pointer `}
              onClick={() => {
                navigate(`/profile`);
              }}
            >
              <ProfileAvatar user={user} />

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {user?.fullName || "Guest User"}
                  </span>
                  {user?.isPrivate && (
                    <Lock className="w-3 h-3 text-primary animate-pulse" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  @{user?.username || "unknown"}
                </span>
              </div>
            </div>
            <button
              className={`flex items-center
                p-2 px-2.5 gap-3
               w-full hover:bg-card-muted rounded-md cursor-pointer`}
              onClick={() => logout()}
            >
              <LogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="flex items-center justify-between bg-card p-3 shadow z-30 sticky top-0">
          {/* Left side (mobile only) */}
          <div className="flex items-center gap-2 lg:hidden">
            <img src={logo} alt="MyApp" className="w-8 h-7 rounded" />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-0.5">
            <NotificationBell />
            <ThemeToggle />
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden cursor-pointer p-2 rounded hover:bg-card-muted "
            >
              <Menu />
            </button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
