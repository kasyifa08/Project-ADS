import { Icon } from "./Icon";
import { COLORS } from "./data";

const user = JSON.parse(localStorage.getItem("user"));

const Sidebar = ({ active, onNav, isAdmin }) => {
  const studentLinks = [
    { key: "dashboard", icon: "dashboard", label: "Beranda" },
    { key: "cari", icon: "search_check", label: "Cari Barang" },
    { key: "tiket", icon: "confirmation_number", label: "Tiket Saya" },
    { key: "lapor", icon: "add_circle", label: "Lapor Barang" },
    { key: "notifikasi", icon: "notifications", label: "Notifikasi" },
  ];

  const adminLinks = [
    { key: "admin_dashboard", icon: "dashboard", label: "Dashboard" },
    { key: "__header_tiket", icon: null, label: "TIKET MASUK", isHeader: true },
    { key: "admin_tiket_hilang", icon: "search_off", label: "Barang Kehilangan", indent: true },
    { key: "admin_tiket_temuan", icon: "inventory_2", label: "Barang Temuan", indent: true },
    { key: "admin_verifikasi", icon: "verified", label: "Verifikasi Laporan" },
    { key: "admin_postingan", icon: "article", label: "Manajemen Postingan" },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <nav style={{
      position: "fixed", left: 0, top: 0, height: "100vh", width: 256,
      background: COLORS.navDark, display: "flex", flexDirection: "column",
      padding: "24px 0", zIndex: 50, boxShadow: "4px 0 20px rgba(0,0,0,0.3)"
    }}>
      <div style={{ padding: "0 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "white", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="search_check" color={COLORS.primary} size={20} />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 14 }}>IPB Lost & Found</div>
            <div style={{ color: "#60a5fa", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {isAdmin ? "Admin Portal" : "Student Portal"}
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {links.map((link, idx) => {
          if (link.isHeader) {
            return (
              <div key={idx} style={{ padding: "8px 24px 4px", fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {link.label}
              </div>
            );
          }
          const isActive = active === link.key;
          return (
            <button key={link.key} onClick={() => onNav(link.key)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: link.indent ? "10px 24px 10px 36px" : "12px 24px",
              background: isActive ? "rgba(96,165,250,0.15)" : "transparent",
              borderLeft: isActive ? `4px solid #60a5fa` : "4px solid transparent",
              color: isActive ? "white" : link.indent ? "#7ea4c8" : "#94a3b8",
              fontSize: link.indent ? 13 : 14, fontWeight: 500, cursor: "pointer", border: "none",
              textAlign: "left", transition: "all 0.2s"
            }}>
              {link.icon && <Icon name={link.icon} size={link.indent ? 17 : 20} color={isActive ? "white" : link.indent ? "#7ea4c8" : "#94a3b8"} />}
              {link.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={() => onNav("landing")} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "10px 0", background: "transparent",
          color: "#94a3b8", fontSize: 14, fontWeight: 500, cursor: "pointer", border: "none", textAlign: "left"
        }}>
          <Icon name="logout" size={20} color="#94a3b8" />
          Keluar
        </button>
      </div>
    </nav>
  );
};

const TopBar = ({ title, isAdmin }) => (
  <header
    style={{
      position: "fixed",
      top: 0,
      left: 256,
      right: 0,
      height: 72,
      background: "white",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      zIndex: 40,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    }}
  >
    {/* LEFT */}
    <div>
      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: "#0f172a",
          margin: 0,
        }}
      >
        {title}
      </h1>

      <p
        style={{
          fontSize: 13,
          color: "#64748b",
          marginTop: 2,
        }}
      >
        Sistem Lost & Found IPB
      </p>
    </div>

    {/* RIGHT */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >       
      {/* user info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingLeft: 16,
          borderLeft: "1px solid #e2e8f0",
        }}
      >
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
            }}
          >
            {user?.nama || "Admin"}
          </p>

          <p
            style={{
              fontSize: 12,
              color: "#64748b",
              margin: 0,
            }}
          >
            {user?.email || "admin@email.com"}
          </p>
        </div>

        {/* avatar */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "#dbeafe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="person" size={22} color="#2563eb" />
        </div>
      </div>
    </div>
  </header>
);

export const AppLayout = ({ children, activePage, onNav, title, isAdmin }) => (
  <div
    style={{
      fontFamily: "'Inter', sans-serif",
      minHeight: "100vh",
      background: COLORS.surface,
    }}
  >
    <Sidebar active={activePage} onNav={onNav} isAdmin={isAdmin} />

    <TopBar title={title} isAdmin={isAdmin} />

    <main
      style={{
        marginLeft: 256,
        padding: "96px 32px 32px",
        minHeight: "100vh",
      }}
    >
      {children}
    </main>
  </div>
);