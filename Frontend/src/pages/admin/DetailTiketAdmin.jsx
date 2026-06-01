import { useState } from "react";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { TypeBadge, StatusBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";

export default function DetailTiketAdmin({ onNav, selectedTicket, ticketsHilang, setTicketsHilang, ticketsTemuan, setTicketsTemuan, setPostingan }) {
  const [catatan, setCatatan] = useState(selectedTicket?.catatan || "");
  const t = selectedTicket;

  if (!t) return null;

  const isHilang = t.type === "hilang";
  const setTickets = isHilang ? setTicketsHilang : setTicketsTemuan;
  const backPage = isHilang ? "admin_tiket_hilang" : "admin_tiket_temuan";

  const handleTerima = () => {
    if (isHilang) {
      setTickets(prev => prev.map(tk => tk.id === t.id ? { ...tk, status: "diproses", catatan } : tk));
    } else {
      setTickets(prev => prev.map(tk => tk.id === t.id ? { ...tk, status: "diterima", catatan } : tk));
      const newPost = {
        id: `POST-${Date.now()}`,
        type: "temuan",
        item: t.item,
        location: t.location,
        time: "Baru saja",
        status: "menunggu",
        color: t.color,
        category: t.category,
        desc: t.desc,
        img: t.img,
        ticketId: t.id,
      };
      setPostingan(prev => [newPost, ...prev]);
    }
    onNav(backPage);
  };

  const handleTolak = () => {
    setTickets(prev => prev.filter(tk => tk.id !== t.id));
    onNav(backPage);
  };

  const handleAdminConfirm = () => {
    setTickets(prev => prev.map(tk => {
      if (tk.id !== t.id) return tk;
      const updated = { ...tk, adminConfirm: true };
      if (updated.studentConfirm) updated.status = "selesai";
      return updated;
    }));
    onNav(backPage);
  };

  return (
    <AppLayout activePage={backPage} onNav={onNav} title="Detail Tiket" isAdmin={true}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <button onClick={() => onNav(backPage)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: COLORS.primary, fontWeight: 600, fontSize: 14, marginBottom: 24 }}>
          <Icon name="arrow_back" color={COLORS.primary} size={18} /> Kembali ke Daftar Tiket
        </button>

        <div style={{ background: "white", borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontFamily: "monospace", color: "#64748b" }}>{t.id}</span>
              <TypeBadge type={t.type} />
              <StatusBadge status={t.status} />
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{t.item}</h1>
            <p style={{ fontSize: 14, color: "#64748b" }}>Dilaporkan pada {t.time}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "white", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>
              <Icon name="print" size={16} color="#64748b" /> Cetak
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <img src={t.img} alt={t.item} style={{ width: "100%", height: 280, objectFit: "cover" }} />
            </div>

            <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: "100%", background: isHilang ? COLORS.error : COLORS.primary }} />
              <div style={{ paddingLeft: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name="person" color={COLORS.primary} size={20} /> Informasi Pelapor
                    </h3>
                    {[
                      { label: "Nama Lengkap", value: t.nama, bold: true },
                      { label: "NIM", value: t.nim },
                      { label: "No. HP", value: t.phone },
                    ].map(f => (
                      <div key={f.label} style={{ marginBottom: 14 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{f.label}</p>
                        <p style={{ fontSize: f.bold ? 16 : 14, fontWeight: f.bold ? 600 : 400, color: COLORS.onSurface, margin: 0 }}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name="category" color={COLORS.primary} size={20} /> Kategori & Lokasi
                    </h3>
                    {[
                      { label: "Kategori Barang", value: t.category },
                      { label: "Warna Dominan", value: t.color },
                      { label: "Lokasi", value: t.location },
                    ].map(f => (
                      <div key={f.label} style={{ marginBottom: 14 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{f.label}</p>
                        <p style={{ fontSize: 14, color: COLORS.onSurface, margin: 0 }}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Deskripsi Barang</p>
                  <div style={{ background: COLORS.surfaceContainerLow, padding: 18, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                    <p style={{ fontSize: 15, color: COLORS.onSurface, lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="handshake" color={COLORS.primary} size={20} /> Status Verifikasi Mutual
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Konfirmasi Mahasiswa", done: t.studentConfirm, icon: "school" },
                  { label: "Konfirmasi Admin", done: t.adminConfirm, icon: "admin_panel_settings" },
                ].map(v => (
                  <div key={v.label} style={{ background: v.done ? "#f0fdf4" : COLORS.surfaceContainerLow, borderRadius: 12, padding: 16, border: `1px solid ${v.done ? "#bbf7d0" : "#e2e8f0"}`, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: v.done ? "#dcfce7" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={v.done ? "check_circle" : v.icon} color={v.done ? COLORS.success : "#94a3b8"} size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: v.done ? "#166534" : "#64748b", margin: 0 }}>{v.label}</p>
                      <p style={{ fontSize: 12, color: v.done ? COLORS.success : "#94a3b8", margin: 0 }}>{v.done ? "Sudah dikonfirmasi" : "Belum dikonfirmasi"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Panel Aksi Admin</h3>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Catatan Admin</label>
                <textarea value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="Masukkan catatan atau alasan keputusan..." rows={4}
                  style={{ width: "100%", borderRadius: 10, padding: 12, border: "1px solid #e2e8f0", fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Catatan ini terlihat oleh pelapor.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {t.status === "menunggu" && (
                  <>
                    <button onClick={handleTerima} style={{ width: "100%", padding: "14px", borderRadius: 10, background: COLORS.primary, color: "white", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Icon name="check_circle" color="white" size={20} />
                      {isHilang ? "Terima (Status → Diproses)" : "Terima & Publikasi Postingan"}
                    </button>
                    <button onClick={handleTolak} style={{ width: "100%", padding: "14px", borderRadius: 10, background: "white", border: `2px solid ${COLORS.errorContainer}`, color: COLORS.error, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Icon name="cancel" color={COLORS.error} size={20} /> Tolak Laporan
                    </button>
                  </>
                )}
                {(t.status === "diproses" || t.status === "diterima") && !t.adminConfirm && (
                  <button onClick={handleAdminConfirm} style={{ width: "100%", padding: "14px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a", color: "#b45309", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Icon name="handshake" color="#b45309" size={20} /> Konfirmasi Barang Ditemukan/Diklaim
                  </button>
                )}
                {t.adminConfirm && (
                  <div style={{ padding: 14, background: "#f0fdf4", borderRadius: 10, textAlign: "center", border: "1px solid #bbf7d0" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#166534", margin: 0 }}>✓ Admin sudah mengkonfirmasi</p>
                    <p style={{ fontSize: 12, color: COLORS.success, margin: "4px 0 0" }}>{t.studentConfirm ? "Kedua pihak sudah konfirmasi" : "Menunggu konfirmasi mahasiswa"}</p>
                  </div>
                )}
                {t.status !== "menunggu" && (
                  <button onClick={() => onNav(backPage)} style={{ width: "100%", padding: "12px", borderRadius: 10, background: COLORS.surfaceContainerLow, color: COLORS.onSurface, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    Kembali ke Daftar
                  </button>
                )}
              </div>

              {isHilang && t.status === "diproses" && (
                <div style={{ marginTop: 20, padding: 14, background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1d4ed8", marginBottom: 4 }}>💡 Tip</p>
                  <p style={{ fontSize: 12, color: "#1e40af", margin: 0, lineHeight: 1.5 }}>Untuk membuat postingan dari tiket ini, buka Manajemen Postingan → Tambah Postingan, lalu masukkan ID tiket: <strong>{t.id}</strong></p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}