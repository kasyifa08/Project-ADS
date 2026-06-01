import { useState, useEffect } from "react";
import api from "../../api/axios";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { TypeBadge, StatusBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";

export default function StatusTiket({
  onNav,
  setSelectedTicket
}) {
  const [tab, setTab] = useState("hilang");
  const [selected, setSelected] = useState(null);

  const [ticketsHilang, setTicketsHilang] = useState([]);
  const [ticketsTemuan, setTicketsTemuan] = useState([]);
  useEffect(() => {
    fetchTickets();
  }, []);
  const tickets =
    tab === "hilang"
      ? ticketsHilang
      : ticketsTemuan;

  const setTickets =
    tab === "hilang"
      ? setTicketsHilang
      : setTicketsTemuan;

  const fetchTickets = async () => {
    try {
      const response = await api.get("/tickets/my/");

      console.log("My tickets response:", response.data);

      const data = response.data;

      const formatted = data.map((item) => ({
        id: item.id,
        item: item.nama_barang,
        type: item.tipe,
        status: item.status,
        location: item.lokasi,
        category: item.kategori || "-",
        color: item.warna || "-",
        time: new Date(item.waktu_kejadian).toLocaleDateString("id-ID"),
        desc: item.deskripsi,
        img:
          item.foto_url ||
          "https://via.placeholder.com/400x300?text=No+Image",
        adminConfirm: false,
        studentConfirm: false,
      }));

      console.log("Formatted tickets:", formatted);

      setTicketsHilang(
        formatted.filter((t) => t.type === "hilang")
      );

      setTicketsTemuan(
        formatted.filter((t) => t.type === "temuan")
      );

      if (formatted.length > 0) {
        setSelected(formatted[0]);
      }

    } catch (error) {
      console.error("ERROR:", error);
    }
  };

  const handleStudentConfirm = (id) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== id) return t;
      const updated = { ...t, studentConfirm: true };
      if (updated.adminConfirm) updated.status = "selesai";
      return updated;
    }));
    setSelected(prev => {
      const updated = { ...prev, studentConfirm: true };
      if (updated.adminConfirm) updated.status = "selesai";
      return updated;
    });
  };

  return (
    <AppLayout activePage="tiket" onNav={onNav} title="Tiket Saya" isAdmin={false}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Tiket Saya</h1>
            <p style={{ fontSize: 14, color: COLORS.onSurfaceVariant }}>Pantau status laporan barang hilang dan temuan Anda.</p>
          </div>
          <button onClick={() => onNav("lapor")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: COLORS.primary, color: "white", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
            <Icon name="add" color="white" size={18} /> Buat Laporan Baru
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["hilang", "search_off", "Laporan Kehilangan"], ["temuan", "inventory_2", "Laporan Temuan"]].map(([key, icon, label]) => (
            <button key={key} onClick={() => { setTab(key); setSelected(key === "hilang" ? ticketsHilang[0] : ticketsTemuan[0]); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", background: tab === key ? COLORS.primary : COLORS.primaryFixed, color: tab === key ? "white" : COLORS.primary }}>
              <Icon name={icon} size={16} color={tab === key ? "white" : COLORS.primary} /> {label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Daftar Tiket</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tickets.map(item => {
                const isActive = selected?.id === item.id;
                return (
                  <div key={item.id} onClick={() => setSelected(item)} style={{ background: "white", borderRadius: 12, borderLeft: `4px solid ${isActive ? COLORS.primary : "#e2e8f0"}`, padding: 16, cursor: "pointer", boxShadow: isActive ? `0 2px 8px rgba(0,74,198,0.1)` : "0 1px 3px rgba(0,0,0,0.05)", border: isActive ? `1px solid ${COLORS.primary}30` : "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>{item.id}</span>
                      <TypeBadge type={item.type} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{item.item}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: COLORS.onSurfaceVariant }}>{item.time}</span>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selected && (
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
              <img src={selected.img} alt={selected.item} style={{ width: "100%", height: 220, objectFit: "cover" }} />
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{selected.item}</h2>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{selected.id}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <TypeBadge type={selected.type} />
                    <StatusBadge status={selected.status} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {[
                    { icon: "location_on", label: "Lokasi", value: selected.location },
                    { icon: "category", label: "Kategori", value: selected.category },
                    { icon: "palette", label: "Warna", value: selected.color },
                    { icon: "schedule", label: "Waktu", value: selected.time },
                  ].map((f, i) => (
                    <div key={i} style={{ background: COLORS.surfaceContainerLow, borderRadius: 10, padding: 12 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                        <Icon name={f.icon} size={14} color={COLORS.primary} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{f.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: COLORS.surfaceContainerLow, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Deskripsi</p>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: COLORS.onSurface, margin: 0 }}>{selected.desc}</p>
                </div>

                {selected.catatan && (
                  <div style={{ background: "#eff6ff", borderRadius: 10, padding: 16, marginBottom: 16, border: "1px solid #bfdbfe" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Catatan Admin</p>
                    <p style={{ fontSize: 14, color: "#1e40af", margin: 0 }}>{selected.catatan}</p>
                  </div>
                )}

                {(selected.status === "diproses" || selected.status === "diterima") && (
                  <div style={{ background: selected.studentConfirm ? "#f0fdf4" : "#fffbeb", borderRadius: 12, padding: 18, marginBottom: 16, border: `1px solid ${selected.studentConfirm ? "#bbf7d0" : "#fde68a"}` }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                      <Icon name={selected.studentConfirm ? "check_circle" : "handshake"} color={selected.studentConfirm ? COLORS.success : "#b45309"} size={20} />
                      <span style={{ fontWeight: 600, fontSize: 14, color: selected.studentConfirm ? "#166534" : "#92400e" }}>
                        {selected.studentConfirm ? "Anda sudah mengkonfirmasi barang ditemukan" : "Konfirmasi Barang Ditemukan"}
                      </span>
                    </div>
                    {!selected.studentConfirm ? (
                      <>
                        <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.5, margin: "0 0 12px" }}>
                          Jika barang Anda sudah ditemukan dan sudah diambil, klik tombol di bawah untuk mengkonfirmasi. Diperlukan konfirmasi dari kedua pihak.
                        </p>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                          <span style={{ fontSize: 12, color: "#92400e" }}>
                            Status Admin: {selected.adminConfirm ? "✓ Sudah konfirmasi" : "⏳ Belum konfirmasi"}
                          </span>
                        </div>
                        <button onClick={() => handleStudentConfirm(selected.id)} style={{ padding: "10px 20px", background: "#b45309", color: "white", borderRadius: 8, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                          <Icon name="check" color="white" size={16} /> Konfirmasi Sudah Ditemukan
                        </button>
                      </>
                    ) : (
                      <p style={{ fontSize: 13, color: "#166534", margin: 0 }}>
                        {selected.adminConfirm ? "✓ Kedua pihak sudah konfirmasi. Tiket akan segera ditutup." : "⏳ Menunggu konfirmasi dari admin."}
                      </p>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => { setSelectedTicket(selected); onNav("detail_tiket"); }} style={{ flex: 1, padding: 12, background: COLORS.primary, color: "white", borderRadius: 8, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
                    Lihat Detail Lengkap
                  </button>
                  <button style={{ padding: 12, background: COLORS.errorContainer, color: COLORS.error, borderRadius: 8, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
                    Tutup Tiket
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}