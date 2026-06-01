import { useEffect, useState } from "react";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { TypeBadge, StatusBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";
import api from "../../api/axios";

export default function KelolaTiketTemuan({
  onNav,
  setPostingan,
  setSelectedTicket
}) {
  const [ticketsTemuan, setTicketsTemuan] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets/all");

      const temuan = res.data.filter(
        (t) => t.tipe === "temuan"
      );

      setTicketsTemuan(temuan);
    } catch (err) {
      console.error(err);
    }
  };
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState({});
  const filtered = ticketsTemuan.filter(t => filter === "semua" || t.status === filter);

  const handleTerima = async (ticket) => {
    try {
      setLoading(prev => ({
        ...prev,
        [ticket.id]: true
      }));

      await api.patch(
        `/tickets/${ticket.id}/status`,
        {
          status: "diproses"
        }
      );

      setTicketsTemuan(prev =>
        prev.map(t =>
          t.id === ticket.id
            ? {
              ...t,
              status: "diproses"
            }
            : t
        )
      );

      alert("Tiket diterima!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({
        ...prev,
        [ticket.id]: false
      }));
    }
  };

  const handleTolak = async (id) => {
    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      await api.patch(`/tickets/${id}/status`, { status: "ditolak" });
      setTicketsTemuan(prev => prev.filter(t => t.id !== id));
      alert("Tiket ditolak");
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      alert(error.response?.data?.detail || "Gagal menolak tiket");
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleAdminConfirm = async (id) => {
    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      await api.patch(`/tickets/${id}/status`, { status: "selesai" });
      setTicketsTemuan(prev => prev.map(t => {
        if (t.id !== id) return t;
        const updated = { ...t, adminConfirm: true, status: "selesai" };
        return updated;
      }));
      alert("Tiket dikonfirmasi selesai!");
    } catch (error) {
      console.error("Error confirming ticket:", error);
      alert(error.response?.data?.detail || "Gagal mengkonfirmasi tiket");
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <AppLayout activePage="admin_tiket_temuan" onNav={onNav} title="Tiket Temuan" isAdmin={true}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: "#dbeafe", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "center", marginBottom: 24, border: "1px solid #bfdbfe" }}>
          <Icon name="inventory_2" color="#1d4ed8" size={20} />
          <p style={{ fontSize: 14, color: "#1e40af", fontWeight: 500, margin: 0 }}>
            Terdapat <strong>{ticketsTemuan.filter(t => t.status === "menunggu").length}</strong> laporan temuan menunggu review. Jika diterima, postingan otomatis dibuat.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["semua", "menunggu", "diproses", "selesai"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 18px", borderRadius: 99, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", background: filter === f ? COLORS.primary : COLORS.primaryFixed, color: filter === f ? "white" : COLORS.primary }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((t, i) => (
            <div key={i} style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: t.status === "diproses" ? "1px solid #bbf7d0" : "1px solid #f1f5f9" }}>
              {t.status === "diproses" && (
                <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="check_circle" color={COLORS.success} size={16} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#166534" }}>Diproses — Postingan otomatis telah dibuat</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                    {t.foto_url ? (
                      <img
                        src={t.foto_url}
                        alt={t.nama_barang}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <Icon
                        name="inventory_2"
                        size={32}
                        color="#94a3b8"
                      />
                    )}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{t.id}</span>
                      <TypeBadge type={t.tipe} />
                      <StatusBadge status={t.status} />
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{t.nama_barang}</h3>
                    <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#64748b" }}>
                      <span>📍 {t.lokasi}</span>
                      <span>🕐 {new Date(t.waktu_kejadian).toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, marginTop: 6, maxWidth: 500 }}>{(t.deskripsi || "").slice(0, 100)}...</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {t.status === "menunggu" && (
                    <>
                      <button onClick={() => handleTerima(t)} disabled={loading[t.id]} style={{ padding: "10px 18px", background: "#dcfce7", color: "#16a34a", borderRadius: 8, fontWeight: 700, fontSize: 13, border: "none", cursor: loading[t.id] ? "not-allowed" : "pointer", opacity: loading[t.id] ? 0.6 : 1 }}>
                        {loading[t.id] ? "..." : "✓ Terima & Publikasi"}
                      </button>
                      <button onClick={() => handleTolak(t.id)} disabled={loading[t.id]} style={{ padding: "10px 18px", background: COLORS.errorContainer, color: COLORS.error, borderRadius: 8, fontWeight: 700, fontSize: 13, border: "none", cursor: loading[t.id] ? "not-allowed" : "pointer", opacity: loading[t.id] ? 0.6 : 1 }}>
                        {loading[t.id] ? "..." : "✕ Tolak"}
                      </button>
                    </>
                  )}
                  {t.status === "diproses" && !t.adminConfirm && (
                    <button onClick={() => handleAdminConfirm(t.id)} disabled={loading[t.id]} style={{ padding: "10px 18px", background: "#fffbeb", color: "#b45309", borderRadius: 8, fontWeight: 700, fontSize: 13, border: "1px solid #fde68a", cursor: loading[t.id] ? "not-allowed" : "pointer", opacity: loading[t.id] ? 0.6 : 1 }}>
                      {loading[t.id] ? "..." : "🤝 Konfirmasi Diklaim"}
                    </button>
                  )}
                  {t.status === "selesai" && (
                    <span style={{ padding: "10px 18px", background: "#f0fdf4", color: COLORS.success, borderRadius: 8, fontWeight: 700, fontSize: 13, border: "1px solid #bbf7d0", textAlign: "center" }}>
                      ✓ Selesai
                    </span>
                  )}
                  <button onClick={() => { setSelectedTicket(t); onNav("admin_detail_tiket"); }} style={{ padding: "10px 18px", background: COLORS.surfaceContainerLow, color: COLORS.onSurface, borderRadius: 8, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
              <Icon name="inbox" size={48} color="#94a3b8" style={{ display: "block", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 16, fontWeight: 500 }}>Tidak ada tiket ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}