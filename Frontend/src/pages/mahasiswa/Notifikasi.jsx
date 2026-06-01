// src/pages/mahasiswa/Notifikasi.jsx
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { COLORS } from "../../components/data";

// ─── DESIGN TOKENS (sesuai tailwind.config dari HTML asli) ────────────────────
const C = {
  primary: COLORS.primary,
  primaryContainer: COLORS.primaryContainer,
  primaryFixed: COLORS.primaryFixed,
  primaryFixedDim: "#b4c5ff",
  secondary: COLORS.secondary,
  secondaryFixed: "#d5e3ff",
  secondaryContainer: COLORS.secondaryContainer,
  surface: COLORS.surface,
  surfaceContainerLow: COLORS.surfaceContainerLow,
  surfaceContainer: "#eceef0",
  surfaceContainerHigh: "#e6e8ea",
  surfaceContainerLowest: COLORS.surfaceContainerLowest,
  onSurface: COLORS.onSurface,
  onSurfaceVariant: COLORS.onSurfaceVariant,
  outlineVariant: COLORS.outlineVariant,
  outline: COLORS.outline,
  error: COLORS.error,
  errorContainer: COLORS.errorContainer,
  navDark: COLORS.navDark,
};

// ─── NOTIFICATION CARD ────────────────────────────────────────────────────────
const NotifCard = ({ notif, onMarkRead }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surfaceContainerLowest,
        padding: 24,
        borderRadius: 12,
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.06)",
        borderLeft: `4px solid ${notif.borderColor}`,
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Icon bubble */}
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: "50%",
            background: notif.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon name={notif.icon} size={24} color={notif.iconColor} fill={notif.iconFill} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Tag + time */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span
              style={{
                background: notif.tagBg, color: notif.tagColor,
                padding: "2px 8px", borderRadius: 4,
                fontSize: 12, fontWeight: 600,
                display: "inline-block", marginBottom: 6,
              }}
            >
              {notif.tag}
            </span>
            <h3
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 16, fontWeight: 700,
                color: C.onSurface, lineHeight: 1.4,
              }}
            >
              {notif.title}
            </h3>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.onSurfaceVariant, whiteSpace: "nowrap", marginLeft: 16, marginTop: 2 }}>
            {notif.time}
          </span>
        </div>

        {/* Body */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14, lineHeight: 1.6,
            color: C.onSurfaceVariant,
            marginTop: 8,
          }}
        >
          {notif.body}
        </p>

        {/* Action row (only for unread) */}
        {!notif.read && (
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => onMarkRead(notif.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: C.primary, fontSize: 13, fontWeight: 600,
                padding: "4px 0",
                display: "flex", alignItems: "center", gap: 4,
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            >
              <Icon name="done" size={16} color={C.primary} />
              Tandai sudah dibaca
            </button>
          </div>
        )}
      </div>

      {/* Unread dot */}
      {notif.dot && !notif.read && (
        <div
          style={{
            width: 8, height: 8, borderRadius: "50%",
            background: C.primary, flexShrink: 0, alignSelf: "center",
          }}
        />
      )}
    </div>
  );
};

// ─── MAIN NOTIFIKASI PAGE ─────────────────────────────────────────────────────
const Notifikasi = ({ onNav }) => {
  const [notifs, setNotifs] = useState([]);

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = async () => {
    try {
      await Promise.all(
        notifs
          .filter(n => !n.read)
          .map(n => api.patch(`/notifications/${n.id}/read`))
      );

      setNotifs(prev =>
        prev.map(n => ({
          ...n,
          read: true,
          dot: false,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications:", error);
    }
  };
  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifs(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, read: true, dot: false }
            : n
        )
      );
    } catch (error) {
      console.error("Error marking notification:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications/");

      const formatted = response.data.map((item) => {
        let notifType = "laporan";

        if (item.pesan?.toLowerCase().includes("ditolak")) {
          notifType = "ditolak";
        } else if (
          item.pesan?.toLowerCase().includes("diterima") ||
          item.pesan?.toLowerCase().includes("diproses") ||
          item.pesan?.toLowerCase().includes("selesai") ||
          item.pesan?.toLowerCase().includes("dikonfirmasi")
        ) {
          notifType = "diproses";
        }

        return {
          id: item.id,
          ticket_id: item.ticket_id,

          tag:
            notifType === "ditolak"
              ? "Ditolak"
              : notifType === "diproses"
                ? "Diterima"
                : "Laporan",

          tagBg:
            notifType === "diproses"
              ? "#dcfce7"
              : notifType === "ditolak"
                ? "#ffdad6"
                : "#fef3c7",

          tagColor:
            notifType === "diproses"
              ? "#16a34a"
              : notifType === "ditolak"
                ? C.error
                : "#b45309",

          borderColor:
            notifType === "diproses"
              ? "#bbf7d0"
              : notifType === "ditolak"
                ? C.errorContainer
                : "#fcd34d",

          iconBg:
            notifType === "diproses"
              ? "#dcfce7"
              : notifType === "ditolak"
                ? "#ffdad6"
                : "#fef3c7",

          iconColor:
            notifType === "diproses"
              ? "#16a34a"
              : notifType === "ditolak"
                ? C.error
                : "#b45309",

          icon:
            notifType === "diproses"
              ? "check_circle"
              : notifType === "ditolak"
                ? "cancel"
                : "info",

          iconFill: true,

          // AMBIL LANGSUNG DARI DATABASE
          title: item.judul,
          body: item.pesan,

          time: item.created_at
            ? new Date(item.created_at).toLocaleString("id-ID")
            : "-",

          dot: !item.is_read,
          read: item.is_read || false,
        };
      });

      setNotifs(formatted);
      console.log("Notifications fetched:", formatted);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Auto-refresh notifications every 10 seconds to catch status changes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout activePage="notifikasi" onNav={onNav} title="Notifikasi">
      {/* Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; display:inline-block; }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#f7f9fb; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 1280, margin: "0 auto" }}>

        {/* Page header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 24, fontWeight: 700,
                color: C.onSurface, letterSpacing: "-0.02em", lineHeight: 1.2,
              }}
            >
              Notifikasi
              {unreadCount > 0 && (
                <span
                  style={{
                    marginLeft: 12,
                    background: C.primaryContainer,
                    color: "white",
                    fontSize: 14, fontWeight: 700,
                    padding: "2px 10px", borderRadius: 99,
                    verticalAlign: "middle",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </h1>
            <p style={{ fontSize: 14, color: C.onSurfaceVariant, marginTop: 4, lineHeight: 1.5 }}>
              Pantau status laporan barang hilang dan temuan kamu di sini.
            </p>
          </div>

          {/* Mark all read */}
          <button
            onClick={markAllRead}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              color: C.primary, fontFamily: "Inter, sans-serif",
              fontSize: 14, fontWeight: 600,
              padding: "8px 16px", borderRadius: 8,
              background: "none", border: "none", cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${C.primaryFixed}66`}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <Icon name="done_all" size={20} color={C.primary} />
            Mark all as read
          </button>
        </div>

        {/* Notification list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {notifs && notifs.length > 0 ? (
            notifs.map(notif => (
              <NotifCard key={notif.id} notif={notif} onMarkRead={markRead} />
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "32px", color: C.onSurfaceVariant }}>
              <Icon name="notifications_none" size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 16, fontWeight: 500 }}>Belum ada notifikasi</p>
            </div>
          )}
        </div>

        {/* Load more */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <button
            style={{
              padding: "12px 32px",
              border: `1px solid ${C.outlineVariant}`,
              borderRadius: 8,
              fontFamily: "Inter, sans-serif",
              fontSize: 14, fontWeight: 600,
              color: C.onSurfaceVariant,
              background: "none", cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.surfaceContainerLow}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            Muat Notifikasi Sebelumnya
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Notifikasi;
