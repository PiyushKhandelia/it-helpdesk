
import { useEffect, useState } from "react";
import { Plus, ShieldCheck, CircleAlert, Clock3, CircleCheck, Ticket } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import TicketTable from "./components/TicketTable";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";

const initialTickets = [
  {
    id: "INC-1001",
    title: "Unable to connect to office Wi-Fi",
    category: "Network",
    priority: "High",
    status: "In Progress",
    assignee: "Rahul Sharma",
  },
  {
    id: "INC-1002",
    title: "Email application keeps crashing",
    category: "Software",
    priority: "Medium",
    status: "Open",
    assignee: "Priya Singh",
  },
  {
    id: "INC-1003",
    title: "Laptop keyboard is not responding",
    category: "Hardware",
    priority: "Low",
    status: "Resolved",
    assignee: "Amit Kumar",
  },
  {
    id: "INC-1004",
    title: "Access required for shared drive",
    category: "Access",
    priority: "High",
    status: "Open",
    assignee: "Unassigned",
  },
];

function DashboardApp() {
  const {
    user,
    profile,
    loading,
    logout,
    refreshProfile,
    profileError,
  } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tickets] = useState(initialTickets);
  
  useEffect(() => {
    if (!user) {
      setShowRegister(false);
    }
  }, [user]);

  const filteredTickets = tickets.filter((ticket) =>
    `${ticket.id} ${ticket.title} ${ticket.category} ${ticket.assignee}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const count = (status) =>
    tickets.filter((ticket) => ticket.status === status).length;

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-message">
          <p>Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-page">
        {showRegister ? (
          <Register onSwitch={() => setShowRegister(false)} />
        ) : (
          <Login onSwitch={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  if (!profile || profile.uid !== user.uid) {
    return (
      <div className="auth-page">
        <div className="auth-message">
          <h2>Profile unavailable</h2>
          <p>
            {profileError ||
              "Your HelpDesk profile could not be loaded. Please try again."}
          </p>
          <button
            className="primary-button"
            onClick={() => refreshProfile().catch(console.error)}
          >
            Retry profile loading
          </button>
          <button
            className="secondary-button"
            onClick={() => logout().catch(console.error)}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        ticketCount={tickets.length}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-area">
        <Topbar
          activePage={activePage}
          search={search}
          setSearch={setSearch}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="page-content">
          <section className="page-heading">
            <div>
              <div className="eyebrow">OVERVIEW</div>
              <h1>{activePage}</h1>
              <p>Monitor IT incidents and keep your team running smoothly.</p>
            </div>

            <button
              className="primary-button"
              onClick={() => window.alert("Ticket creation will be added in the next phase.")}
            >
              <Plus size={18} />
              Create ticket
            </button>
          </section>

          <section className="welcome-banner">
            <div>
              <span className="welcome-tag">IT OPERATIONS</span>
              <h2>Your service desk, at a glance.</h2>
              <p>
                Track incidents, manage requests and keep every issue moving.
              </p>
            </div>
            <div className="welcome-art">
              <ShieldCheck size={70} strokeWidth={1.2} />
            </div>
          </section>

          <section className="stats-grid">
            <StatCard
              label="Total tickets"
              value={tickets.length}
              detail="Sample records"
              icon={Ticket}
              color="blue"
            />
            <StatCard
              label="Open tickets"
              value={count("Open")}
              detail="Awaiting action"
              icon={CircleAlert}
              color="orange"
            />
            <StatCard
              label="In progress"
              value={count("In Progress")}
              detail="Being worked on"
              icon={Clock3}
              color="purple"
            />
            <StatCard
              label="Resolved"
              value={count("Resolved")}
              detail="Successfully closed"
              icon={CircleCheck}
              color="green"
            />
          </section>

          <TicketTable
            tickets={filteredTickets}
            onViewAll={() => setActivePage("All Tickets")}
          />

          <footer className="app-footer">
            <span>HelpDesk · Incident Management System</span>
            <span>Portfolio demo · Sample data only</span>
          </footer>
        </main>
      </div>

      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DashboardApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;