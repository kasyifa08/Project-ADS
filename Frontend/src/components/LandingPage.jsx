import { Icon } from "./Icon";
import { COLORS } from "./data";

export default function LandingPage({ onNav }) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.background, minHeight: "100vh" }}>
      <header style={{ background: "white", borderBottom: "1px solid #e2e8f0", position: "fixed", top: 0, width: "100%", zIndex: 50, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.primary }}>IPB Lost & Found</div>
          <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <a href="#" style={{ color: "#64748b", fontWeight: 500, textDecoration: "none", fontSize: 14 }}>Tentang Kami</a>
            <button onClick={() => onNav("login_mahasiswa")} style={{ background: COLORS.primary, color: "white", padding: "8px 24px", borderRadius: 8, fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14 }}>Masuk</button>
          </nav>
        </div>
      </header>
      <main style={{ paddingTop: 80 }}>
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 42, fontWeight: 700, color: COLORS.onSurface, lineHeight: 1.2, marginBottom: 20 }}>
                Selamat Datang di Portal <span style={{ color: COLORS.primary }}>Lost & Found</span> IPB University
              </h1>
              <p style={{ fontSize: 16, color: COLORS.onSurfaceVariant, lineHeight: 1.7, maxWidth: 500, marginBottom: 32 }}>
                Solusi digital resmi untuk melaporkan dan mencari barang hilang di seluruh area kampus IPB.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "fit-content" }}>
                <button onClick={() => onNav("login_mahasiswa")} style={{ background: COLORS.primary, color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, border: "none", cursor: "pointer", minWidth: 240, fontSize: 14 }}>Masuk sebagai Mahasiswa</button>
                <button onClick={() => onNav("admin_login")} style={{ background: "transparent", color: COLORS.primary, padding: "11px 24px", borderRadius: 8, fontWeight: 700, border: `2px solid ${COLORS.primary}`, cursor: "pointer", minWidth: 240, fontSize: 14 }}>Masuk sebagai Admin</button>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEixYKuV2c5YoKDj9dHdJt5S1Lt-RSNZ0_3GgZbEbylP9emf5D9KGekhNq9RImhInYYgfcyOsyFFbDOdugmWwN2nWqxA2tDtJux26STvOi6BVFBM43oClQX5rK3aeIzbhUm_thZRVsKYxFgFJXa4AoumNIp5eBy3nYfzqgBpHIX_afCiFGRzAz-E_g/s534/IPB%20University%20(Institut%20Pertanian%20Bogor)%20Logo.png"
                alt="IPB Campus" style={{ width: "90%", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", objectFit: "contain", background: "white" }} />
            </div>
          </div>
        </section>
        <section style={{ background: COLORS.surfaceContainerLow, padding: "40px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[
                { icon: "inventory_2", color: COLORS.primary, bg: COLORS.primaryFixed, value: "1,248+", label: "Total Barang Ditemukan" },
                { icon: "handshake", color: COLORS.tertiary, bg: COLORS.tertiaryFixed, value: "956", label: "Barang Kembali" },
                { icon: "sentiment_very_satisfied", color: COLORS.secondary, bg: "#d5e3ff", value: "98%", label: "Tingkat Kepuasan" },
              ].map((s, i) => (
                <div key={i} style={{ background: "white", borderRadius: 16, border: `1px solid ${COLORS.outlineVariant}`, padding: 24, display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ background: s.bg, borderRadius: 12, padding: 16 }}><Icon name={s.icon} color={s.color} size={28} /></div>
                  <div>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: "#737686", fontWeight: 600, textTransform: "uppercase", margin: 0 }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "40px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <div>
            <div style={{ fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>IPB University</div>
            <p style={{ color: "#64748b" }}>Kampus IPB Dramaga, Bogor, Jawa Barat 16680.</p>
          </div>
          <p style={{ color: "#64748b" }}>© 2024 IPB University Lost & Found.</p>
        </div>
      </footer>
    </div>
  );
}