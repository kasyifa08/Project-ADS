import { useState, useEffect } from "react";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { TypeBadge, StatusBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  primary: COLORS.primary,
  primaryFixed: COLORS.primaryFixed,
  onSurfaceVariant: COLORS.onSurfaceVariant,
  outlineVariant: COLORS.outlineVariant,
};

export default function CariBarang({ onNav, postingan, setSelectedItem }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("semua");
  const [filterCat, setFilterCat] = useState("semua");

  // Pure filtering logic
  const filtered = (postingan || []).filter(item => {
    const itemTitle = item.judul || item.nama_barang || item.item || "";
    const itemLoc = item.lokasi_ditemukan || item.lokasi || item.location || "";
    const itemCat = item.kategori || item.category || "Lainnya";

    const matchSearch =
      itemTitle.toLowerCase().includes(search.toLowerCase()) ||
      itemLoc.toLowerCase().includes(search.toLowerCase());

    const itemTypeLower = (item.tipe || item.type || item.ticket_type || item.status_laporan || "").toLowerCase();
    const matchType = filterType === "semua" || itemTypeLower === filterType;

    const matchCat = filterCat === "semua" || itemCat === filterCat;
    return matchSearch && matchType && matchCat;
  });

  return (
    <AppLayout activePage="cari" onNav={onNav} title="Cari Barang" isAdmin={false}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Search & Filter Controls */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <Icon name="search" size={20} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari berdasarkan nama barang atau lokasi..." style={{ width: "100%", paddingLeft: 46, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 10, border: `1px solid ${C.outlineVariant}`, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["semua", "hilang", "temuan"].map(t => (
              <button key={t} onClick={() => setFilterType(t)} style={{ padding: "6px 16px", borderRadius: 99, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: filterType === t ? C.primary : C.primaryFixed, color: filterType === t ? "white" : C.primary }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${C.outlineVariant}`, fontSize: 13, outline: "none", background: "white" }}>
              <option value="semua">Semua Kategori</option>
              {["Elektronik", "Aksesori", "Dompet & Tas", "Kunci", "Dokumen", "Pakaian", "Lainnya"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <p style={{ fontSize: 14, color: C.onSurfaceVariant, marginBottom: 16 }}>Menampilkan <strong>{filtered.length}</strong> hasil</p>

        {/* Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {filtered.map(item => {
            const namaBarang = item.judul || item.nama_barang || item.item || "Tanpa Nama";
            const lokasi = item.lokasi_ditemukan || item.lokasi || item.location || "-";
            const fotoUrl = item.foto_url || item.img || "https://via.placeholder.com/400x300?text=No+Image";
            const waktu = item.waktu_ditemukan || item.waktu_kejadian || item.time || "-";
            const tipeBarang = item.tipe || item.type || item.ticket_type || item.status_laporan || "temuan";

            return (
              <div key={item.id || item._id} style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", cursor: "pointer" }}>
                <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                  <img src={fotoUrl} alt={namaBarang} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 10, left: 10 }}>
                    <TypeBadge type={tipeBarang} />
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <h4 style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>{namaBarang}</h4>
                  <p style={{ fontSize: 12, color: C.onSurfaceVariant, marginBottom: 8, lineHeight: 1.5 }}>{(item.deskripsi || item.desc || "").slice(0, 60)}...</p>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <Icon name="location_on" size={13} color="#94a3b8" />
                    <span style={{ fontSize: 12, color: "#64748b" }}>{lokasi}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 14 }}>
                    <Icon name="schedule" size={13} color="#94a3b8" />
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                      {String(waktu).includes('T') ? new Date(waktu).toLocaleDateString("id-ID") : waktu}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <StatusBadge status={item.status} />
                    <button onClick={() => { setSelectedItem(item); onNav("detail_postingan"); }} style={{ padding: "6px 14px", background: C.primaryFixed, color: C.primary, borderRadius: 8, fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer" }}>
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}