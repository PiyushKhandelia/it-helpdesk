import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Topbar({
  activePage,
  search,
  setSearch,
  setSidebarOpen,
}) {
  const { theme, toggleTheme } = useTheme();

  const { user, profile, logout } = useAuth();

  const displayName =
    profile?.displayName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-button mobile-menu"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-separator">/</span>
          <strong>{activePage}</strong>
        </div>
      </div>

      <div className="topbar-actions">
        <label className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tickets..."
            aria-label="Search tickets"
          />
          <kbd>/</kbd>
        </label>

        <button
          className="icon-button theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        <button
          className="icon-button notification-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <button
            className="icon-button"
            onClick={() => logout().catch(console.error)}
            aria-label="Sign out"
            title="Sign out"
        >
            <LogOut size={19} />
        </button>

        <div
            className="avatar"
            title={displayName}
            aria-label={`Logged in as ${displayName}`}
        >
            {initials}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
