import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { TypeBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";

const user = JSON.parse(localStorage.getItem("user"));

console.log(user);

export default function DashboardMahasiswa({ onNav, postingan, setSelectedItem }) {
  return (
    <AppLayout activePage="dashboard" onNav={onNav} title="Beranda" isAdmin={false}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <section style={{ borderRadius: 24, background: `linear-gradient(135deg, ${COLORS.navDark}, ${COLORS.primary})`, padding: "48px", color: "white", marginBottom: 32, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: "rgba(255,255,255,0.05)", borderRadius: "50%", filter: "blur(40px)" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 600 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Selamat datang, {user?.nama} 👋</h2>
            <p style={{ fontSize: 16, color: "rgba(219,234,254,0.9)", lineHeight: 1.7 }}>Portal digital terpusat untuk melaporkan dan mencari barang hilang di lingkungan kampus IPB University.</p>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
          <button onClick={() => onNav("lapor")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 28, background: "white", border: `1px solid ${COLORS.errorContainer}`, borderRadius: 16, cursor: "pointer", textAlign: "left" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ width: 64, height: 64, background: `${COLORS.errorContainer}80`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="search_off" color={COLORS.error} size={32} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Laporkan Kehilangan</h3>
                <p style={{ fontSize: 14, color: COLORS.onSurfaceVariant, margin: 0 }}>Kehilangan sesuatu? Buat laporan sekarang.</p>
              </div>
            </div>
            <Icon name="arrow_forward" color={COLORS.error} size={20} />
          </button>
          <button onClick={() => onNav("lapor")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 28, background: "white", border: `1px solid ${COLORS.primaryFixed}`, borderRadius: 16, cursor: "pointer", textAlign: "left" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ width: 64, height: 64, background: `${COLORS.primaryFixed}80`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="inventory_2" color={COLORS.primary} size={32} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Laporkan Temuan</h3>
                <p style={{ fontSize: 14, color: COLORS.onSurfaceVariant, margin: 0 }}>Menemukan barang milik orang lain? Laporkan.</p>
              </div>
            </div>
            <Icon name="arrow_forward" color={COLORS.primary} size={20} />
          </button>
        </section>

        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="grid_view" color={COLORS.primary} size={22} /> Postingan Terbaru
            </h2>
            <button onClick={() => onNav("cari")} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.primary, fontWeight: 600, fontSize: 14 }}>Lihat Semua →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {postingan.slice(0, 4).map((item) => (
              <div key={item.id} style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", cursor: "pointer" }}>
                <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                  <img src={item.img} alt={item.item} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 10, left: 10 }}><TypeBadge type={item.type} /></div>
                </div>
                <div style={{ padding: 16 }}>
                  <h4 style={{ fontWeight: 700, marginBottom: 8, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.item}</h4>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                    <Icon name="location_on" size={14} color="#94a3b8" /><span style={{ fontSize: 12, color: "#64748b" }}>{item.location}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 14 }}>
                    <Icon name="schedule" size={14} color="#94a3b8" /><span style={{ fontSize: 12, color: "#64748b" }}>{item.time}</span>
                  </div>
                  <button onClick={() => { setSelectedItem(item); onNav("detail_postingan"); }} style={{ width: "100%", padding: "8px", background: "#f8fafc", color: COLORS.primary, borderRadius: 8, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
                    Lihat Detail Postingan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}