import { useEffect, useState } from "react";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { TypeBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";
import api from "../../api/axios";

export default function VerifikasiLaporan({ onNav }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState({});

  // ambil data dari backend
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets/all");
      setTickets(res.data || []);
    } catch (err) {
      console.error("Gagal ambil tickets:", err);
    }
  };

  // hanya yang menunggu
  const allPending = tickets.filter((t) => t.status === "menunggu");

  // VERIFIKASI (terima -> diproses)
  const handleVerify = async (id, type) => {
    try {
      setLoading((prev) => ({ ...prev, [id]: true }));

      await api.patch(`/tickets/${id}/status`, {
        status: "diproses",
      });

      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "diproses" } : t
        )
      );
    } catch (err) {
      console.error(err);
      alert("Gagal verifikasi");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // TOLAK
  const handleReject = async (id) => {
    try {
      setLoading((prev) => ({ ...prev, [id]: true }));

      await api.patch(`/tickets/${id}/status`, {
        status: "ditolak",
      });

      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menolak tiket");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <AppLayout
      activePage="admin_verifikasi"
      onNav={onNav}
      title="Verifikasi Laporan"
      isAdmin={true}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* header */}
        <div
          style={{
            background: "#fef3c7",
            borderRadius: 14,
            padding: 16,
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 24,
            border: "1px solid #fde68a",
          }}
        >
          <Icon name="pending" color="#b45309" size={20} />
          <p style={{ fontSize: 14, color: "#92400e", fontWeight: 500, margin: 0 }}>
            Terdapat <strong>{allPending.length}</strong> laporan menunggu verifikasi Anda.
          </p>
        </div>

        {/* list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {allPending.map((t) => (
            <div
              key={t.id}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden" }}>
                  <img
                    src={t.foto_url}
                    alt={t.nama_barang}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontFamily: "monospace", color: "#64748b" }}>
                      #{t.id}
                    </span>
                    <TypeBadge type={t.tipe} />
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>
                    {t.nama_barang}
                  </h3>

                  <div style={{ fontSize: 13, color: "#64748b" }}>
                    📍 {t.lokasi}
                  </div>
                </div>
              </div>

              {/* tombol */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  disabled={loading[t.id]}
                  onClick={() => handleVerify(t.id)}
                  style={{
                    padding: "10px 20px",
                    background: "#dcfce7",
                    color: "#16a34a",
                    borderRadius: 8,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✓ Verifikasi
                </button>

                <button
                  disabled={loading[t.id]}
                  onClick={() => handleReject(t.id)}
                  style={{
                    padding: "10px 20px",
                    background: COLORS.errorContainer,
                    color: COLORS.error,
                    borderRadius: 8,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✕ Tolak
                </button>
              </div>
            </div>
          ))}

          {allPending.length === 0 && (
            <div style={{ textAlign: "center", padding: 64, color: "#94a3b8" }}>
              <Icon name="check_circle" size={64} color="#bbf7d0" />
              <p style={{ fontSize: 18, fontWeight: 600, color: "#16a34a" }}>
                Semua laporan sudah diverifikasi!
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}