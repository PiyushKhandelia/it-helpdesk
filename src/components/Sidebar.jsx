
import {
  LayoutDashboard,
  Ticket,
  Users,
  ChartNoAxesCombined,
  Settings,
  Bell,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "All Tickets", icon: Ticket },
  { label: "My Team", icon: Users },
  { label: "Reports", icon: ChartNoAxesCombined },
  { label: "Settings", icon: Settings },
];

function Sidebar({
  activePage,
  setActivePage,
  ticketCount,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-icon">
          <ShieldCheck size={25} />
        </div>
        <div>
          <h2>HelpDesk</h2>
          <span>INCIDENT MANAGEMENT</span>
        </div>
      </div>

      <div className="workspace-label">WORKSPACE</div>

      <nav className="navigation">
        {navigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${activePage === label ? "active" : ""}`}
            onClick={() => {
              setActivePage(label);
              setSidebarOpen(false);
            }}
          >
            <Icon size={19} />
            <span>{label}</span>

            {label === "All Tickets" && (
              <span className="nav-count">{ticketCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="support-card">
          <div className="support-icon">
            <Bell size={18} />
          </div>
          <strong>Need assistance?</strong>
          <p>Contact your IT administrator for help.</p>
        </div>

        <div className="profile">
          <div className="avatar">AD</div>
          <div className="profile-info">
            <strong>Admin Demo</strong>
            <span>Administrator</span>
          </div>
          <ChevronDown size={17} />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
