import { useState, useEffect } from "react";
import api from "../../api/axios";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { TypeBadge, StatusBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";

export default function CariBarang({onNav,postingan,setSelectedItem}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("semua");
  const [filterCat, setFilterCat] = useState("semua");

  const filtered = postingan.filter(item => {
    const matchSearch =
      (item.item || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (item.location || "")
        .toLowerCase()
        .includes(search.toLowerCase()); const matchType = filterType === "semua" || item.type === filterType;
    const matchCat = filterCat === "semua" || item.category === filterCat;
    return matchSearch && matchType && matchCat;
  });

  useEffect(() => {
  console.log("postingan:", postingan);
}, [postingan]);

  return (
    <AppLayout activePage="cari" onNav={onNav} title="Cari Barang" isAdmin={false}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <Icon name="search" size={20} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari berdasarkan nama barang atau lokasi..." style={{ width: "100%", paddingLeft: 46, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 10, border: `1px solid ${COLORS.outlineVariant}`, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["semua", "hilang", "temuan"].map(t => (
              <button key={t} onClick={() => setFilterType(t)} style={{ padding: "6px 16px", borderRadius: 99, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: filterType === t ? COLORS.primary : COLORS.primaryFixed, color: filterType === t ? "white" : COLORS.primary }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${COLORS.outlineVariant}`, fontSize: 13, outline: "none", background: "white" }}>
              <option value="semua">Semua Kategori</option>
              {["Elektronik", "Aksesori", "Dompet & Tas", "Kunci", "Dokumen"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <p style={{ fontSize: 14, color: COLORS.onSurfaceVariant, marginBottom: 16 }}>Menampilkan <strong>{filtered.length}</strong> hasil</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", cursor: "pointer" }}>
              <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                <img src={item.img} alt={item.item} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 10, left: 10 }}><TypeBadge type={item.type} /></div>
              </div>
              <div style={{ padding: 16 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>{item.item}</h4>
                <p style={{ fontSize: 12, color: COLORS.onSurfaceVariant, marginBottom: 8, lineHeight: 1.5 }}>{(item.desc || "").slice(0, 60)}...</p>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                  <Icon name="location_on" size={13} color="#94a3b8" /><span style={{ fontSize: 12, color: "#64748b" }}>{item.location}</span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 14 }}>
                  <Icon name="schedule" size={13} color="#94a3b8" /><span style={{ fontSize: 12, color: "#64748b" }}>{item.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <StatusBadge status={item.status} />
                  <button onClick={() => { setSelectedItem(item); onNav("detail_postingan"); }} style={{ padding: "6px 14px", background: COLORS.primaryFixed, color: COLORS.primary, borderRadius: 8, fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer" }}>
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}