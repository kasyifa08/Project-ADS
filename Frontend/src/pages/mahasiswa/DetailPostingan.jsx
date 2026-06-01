import { useEffect, useState } from "react";
import api from "../../api/axios";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { TypeBadge, StatusBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";

export default function DetailPostingan({ onNav, selectedItem }) {
  const [item, setItem] = useState(selectedItem);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If selectedItem passed as prop, use it
    if (selectedItem?.id) {
      setItem(selectedItem);
    }
  }, [selectedItem]);

  if (loading) {
    return (
      <AppLayout activePage="cari" onNav={onNav} title="Detail Barang">
        <div style={{ padding: 20, textAlign: "center" }}>
          Memuat data...
        </div>
      </AppLayout>
    );
  }

  if (!item) {
    return (
      <AppLayout activePage="cari" onNav={onNav} title="Detail Barang">
        <div style={{ padding: 20, textAlign: "center" }}>
          <p style={{ color: COLORS.onSurfaceVariant }}>Data tidak ditemukan</p>
          <button
            onClick={() => onNav("cari")}
            style={{
              marginTop: 16,
              padding: "10px 20px",
              background: COLORS.primary,
              color: "white",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Kembali ke Pencarian
          </button>
        </div>
      </AppLayout>
    );
  }

  // Handle different field names from backend
  const namaBarang = item.judul || item.nama_barang || item.item || "Tanpa Nama";
  const lokasi = item.lokasi_ditemukan || item.lokasi || item.location || "-";  
  const kategori = item.kategori || item.category || "-";
  const warna = item.warna || item.color || "-";
  const waktuKejadian = item.waktu_ditemukan || item.waktu_kejadian || item.time;  
  const deskripsi = item.deskripsi || item.desc || item.description || "-";
  const ciriBarang = item.ciri_barang || item.characteristics || "-";
  const fotoUrl = item.foto_url || item.img || "https://via.placeholder.com/400x300";  
  const tipe = item.tipe || item.type || "temuan";
  const status = item.status || "menunggu";

  // Formats date and strictly removes the clock pattern
  const formatDisplayTime = (timeInput) => {
    if (!timeInput) return "-";
    const timeStr = String(timeInput);
    
    // If it's already a localized string ("6/5/2026, 00.00.00"), drop the clock segment after the comma
    if (timeStr.includes(",")) {
      return timeStr.split(",")[0].trim();
    }
    
    // If it contains slashes but no comma yet
    if (timeStr.includes("/")) {
      return timeStr;
    }

    // Parse raw ISO timestamps cleanly without returning time parameters
    if (timeStr.includes("T") || !isNaN(Date.parse(timeStr))) {
      return new Date(timeStr).toLocaleDateString("id-ID");
    }
    
    return timeStr;
  };

  console.log("DETAIL ITEM:", item);
  
  return (
    <AppLayout activePage="cari" onNav={onNav} title="Detail Barang" isAdmin={false}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <button onClick={() => onNav("cari")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: COLORS.primary, fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
          <Icon name="arrow_back" color={COLORS.primary} size={18} /> Kembali
        </button>

        <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
            <img src={fotoUrl} alt={namaBarang} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 24, left: 28, display: "flex", gap: 10 }}>
              <TypeBadge type={tipe} />
              <StatusBadge status={status} />
            </div>
          </div>

          <div style={{ padding: 32 }}>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 8, color: COLORS.onSurface }}>{namaBarang}</h1>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 28, fontFamily: "monospace" }}>ID Postingan: {item.id}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { icon: "location_on", label: "Lokasi", value: lokasi },
                { icon: "category", label: "Kategori", value: kategori },
                { icon: "palette", label: "Warna", value: warna },
                { icon: "schedule", label: "Waktu", value: formatDisplayTime(waktuKejadian) },
              ].map((f, i) => (
                <div key={i} style={{ background: COLORS.surfaceContainerLow, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                    <Icon name={f.icon} size={14} color={COLORS.primary} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</span>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>{f.value}</p>
                </div>
              ))}
            </div>

            <div style={{ background: COLORS.surfaceContainerLow, borderRadius: 12, padding: 20, marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Deskripsi Barang</p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: COLORS.onSurface, margin: 0 }}>{deskripsi}</p>
            </div>

            <div style={{ background: COLORS.surfaceContainerLow, borderRadius: 12, padding: 20, marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Ciri Barang</p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: COLORS.onSurface, margin: 0 }}>{ciriBarang}</p>
            </div>

            {tipe === "hilang" ? (
              <div style={{ background: "#fff7ed", borderRadius: 14, padding: 20, border: "1px solid #fed7aa", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <Icon name="info" color="#ea580c" size={18} />
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#9a3412" }}>Jika Anda menemukan barang ini</span>
                </div>
                <p style={{ fontSize: 13, color: "#9a3412", lineHeight: 1.6, margin: "0 0 12px" }}>
                  Silakan serahkan ke Pos Keamanan Kampus terdekat dan hubungi nomor yang tertera, atau klik tombol di bawah untuk membuat laporan temuan.
                </p>
                <button onClick={() => onNav("lapor")} style={{ padding: "10px 20px", background: "#ea580c", color: "white", borderRadius: 8, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
                  Laporkan Saya Menemukannya
                </button>
              </div>
            ) : (
              <div style={{ background: "#f0fdf4", borderRadius: 14, padding: 20, border: "1px solid #bbf7d0", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <Icon name="inventory_2" color={COLORS.success} size={18} />
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>Barang ini telah ditemukan</span>
                </div>
                <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.6, margin: "0 0 12px" }}>
                  Barang disimpan di Pos Keamanan. Silakan hubungi admin atau datang langsung untuk mengklaim.
                </p>
                <button onClick={() => onNav("lapor")} style={{ padding: "10px 20px", background: COLORS.success, color: "white", borderRadius: 8, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
                  Klaim Barang Ini
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ flex: 1, padding: 14, background: COLORS.primary, color: "white", borderRadius: 10, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
                Hubungi Admin
              </button>
              <button style={{ padding: 14, background: COLORS.surfaceContainerLow, color: COLORS.onSurface, borderRadius: 10, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="share" size={18} color={COLORS.onSurface} /> Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}