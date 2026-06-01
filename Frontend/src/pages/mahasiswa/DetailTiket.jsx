import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { TypeBadge, StatusBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";

export default function DetailTiket({ onNav, selectedTicket, ticketsHilang, ticketsTemuan, setTicketsHilang, setTicketsTemuan }) {
  const allTickets = [...ticketsHilang, ...ticketsTemuan];
  const item = selectedTicket || allTickets[0];

  const handleStudentConfirm = () => {
    const setter = item.type === "hilang" ? setTicketsHilang : setTicketsTemuan;
    setter(prev => prev.map(t => {
      if (t.id !== item.id) return t;
      const updated = { ...t, studentConfirm: true };
      if (updated.adminConfirm) updated.status = "selesai";
      return updated;
    }));
  };

  const timeline = [
    { status: "Laporan Dibuat", desc: "Laporan berhasil dikirim dan menunggu verifikasi admin.", time: item?.time || "-", done: true, icon: "add_circle" },
    { status: "Verifikasi Admin", desc: "Laporan sedang ditinjau oleh petugas.", time: "Ditinjau", done: item?.status !== "menunggu", icon: "verified" },
    { status: "Sedang Diproses", desc: "Tim sedang melakukan pengecekan.", time: item?.status === "diproses" || item?.status === "selesai" ? "Diproses" : "-", done: item?.status === "diproses" || item?.status === "selesai", icon: "manage_search" },
    { status: "Selesai", desc: "Barang telah dikembalikan ke pemilik.", time: item?.status === "selesai" ? "Selesai" : "-", done: item?.status === "selesai", icon: "check_circle" },
  ];

  return (
    <AppLayout activePage="tiket" onNav={onNav} title="Detail Tiket" isAdmin={false}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <button onClick={() => onNav("tiket")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: COLORS.primary, fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
          <Icon name="arrow_back" color={COLORS.primary} size={18} /> Kembali ke Tiket Saya
        </button>

        {item && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div>
              <div style={{ background: "white", borderRadius: 16, padding: 28, marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{item.item}</h1>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{item.id}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <TypeBadge type={item.type} />
                    <StatusBadge status={item.status} />
                  </div>
                </div>
                <img src={item.img} alt={item.item} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12, marginBottom: 20 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {[
                    { icon: "location_on", label: "Lokasi", value: item.location },
                    { icon: "category", label: "Kategori", value: item.category },
                    { icon: "palette", label: "Warna", value: item.color },
                    { icon: "schedule", label: "Waktu", value: item.time },
                  ].map((f, i) => (
                    <div key={i} style={{ background: COLORS.surfaceContainerLow, borderRadius: 10, padding: 14 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                        <Icon name={f.icon} size={14} color={COLORS.primary} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{f.value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: COLORS.surfaceContainerLow, borderRadius: 10, padding: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Deskripsi</p>
                  <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>

              <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 24 }}>Riwayat Status</h3>
                {timeline.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < timeline.length - 1 ? 24 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.done ? COLORS.primary : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name={t.icon} color={t.done ? "white" : "#94a3b8"} size={18} />
                      </div>
                      {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, marginTop: 8, background: t.done ? COLORS.primaryFixed : "#f1f5f9" }} />}
                    </div>
                    <div style={{ paddingTop: 6, paddingBottom: i < timeline.length - 1 ? 24 : 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: t.done ? COLORS.onSurface : "#94a3b8" }}>{t.status}</p>
                      <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, marginBottom: 4 }}>{t.desc}</p>
                      <p style={{ fontSize: 12, color: "#94a3b8" }}>{t.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Aksi</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button style={{ padding: 12, background: COLORS.primary, color: "white", borderRadius: 8, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>Hubungi Admin</button>
                  <button style={{ padding: 12, background: COLORS.surfaceContainerLow, color: COLORS.onSurface, borderRadius: 8, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>Bagikan Laporan</button>
                  <button style={{ padding: 12, background: COLORS.errorContainer, color: COLORS.error, borderRadius: 8, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>Tutup Tiket</button>
                </div>
              </div>

              {(item.status === "diproses" || item.status === "diterima") && (
                <div style={{ background: item.studentConfirm ? "#f0fdf4" : "#fffbeb", borderRadius: 14, padding: 20, marginBottom: 16, border: `1px solid ${item.studentConfirm ? "#bbf7d0" : "#fde68a"}` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                    <Icon name="handshake" color={item.studentConfirm ? COLORS.success : "#b45309"} size={20} />
                    <span style={{ fontWeight: 600, fontSize: 14, color: item.studentConfirm ? "#166534" : "#92400e" }}>Verifikasi Mutual</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.studentConfirm ? COLORS.success : "#d1d5db" }} />
                      <span style={{ fontSize: 13, color: "#64748b" }}>Mahasiswa: {item.studentConfirm ? "✓ Sudah konfirmasi" : "Belum"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.adminConfirm ? COLORS.success : "#d1d5db" }} />
                      <span style={{ fontSize: 13, color: "#64748b" }}>Admin: {item.adminConfirm ? "✓ Sudah konfirmasi" : "Belum"}</span>
                    </div>
                  </div>
                  {!item.studentConfirm && (
                    <button onClick={handleStudentConfirm} style={{ width: "100%", padding: "10px", background: "#b45309", color: "white", borderRadius: 8, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
                      Konfirmasi Sudah Ditemukan
                    </button>
                  )}
                </div>
              )}

              <div style={{ background: "#fff7ed", borderRadius: 14, padding: 18, border: "1px solid #fed7aa" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <Icon name="info" color="#ea580c" size={18} />
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#9a3412" }}>Informasi</span>
                </div>
                <p style={{ fontSize: 13, color: "#9a3412", lineHeight: 1.6, margin: 0 }}>Jika barang ditemukan, Anda akan mendapat notifikasi dan diminta mengambil di Pos Keamanan Kampus.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}