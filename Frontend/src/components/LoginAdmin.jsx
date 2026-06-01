import { useState } from "react";
import { Icon } from "./Icon";
import { COLORS } from "./data";
import api from "../api/axios";

export default function AdminLogin({ onNav }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email dan kata sandi wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(
        "/auth/admin/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log("ROLE:", res.data.role);
      alert("Login admin berhasil!");
      onNav("admin_dashboard");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.detail ||
        "Login admin gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: COLORS.surface, display: "flex", flexDirection: "column" }}>
      <header style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.outlineVariant}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="shield" color={COLORS.primary} size={24} />
            <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.primary }}>IPB Lost & Found</span>
          </div>
          <span style={{ fontSize: 14, color: COLORS.onSurfaceVariant }}>Admin Portal</span>
        </div>
      </header>
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 72, height: 72, background: COLORS.primaryFixed, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Icon name="admin_panel_settings" color={COLORS.primary} size={36} />
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 700, color: COLORS.onSurface, marginBottom: 8 }}>Masuk sebagai Admin</h1>
            <p style={{ fontSize: 14, color: COLORS.onSurfaceVariant }}>Akses panel administrasi IPB Lost & Found</p>
          </div>
          <div style={{ background: "white", borderRadius: 16, border: `1px solid ${COLORS.outlineVariant}`, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.onSurfaceVariant, display: "block", marginBottom: 8 }}>Email Admin</label>
              <div style={{ position: "relative" }}>
                <Icon name="mail" size={18} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="email"
                  placeholder="admin@ipb.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 8, border: `1px solid ${COLORS.outlineVariant}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.onSurfaceVariant, display: "block", marginBottom: 8 }}>Kata Sandi</label>
              <div style={{ position: "relative" }}>
                <Icon name="lock" size={18} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 8, border: `1px solid ${COLORS.outlineVariant}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ width: "100%", padding: 14, background: COLORS.primary, color: "white", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Loading..." : "Masuk Admin"}
            </button>
            <div style={{ marginTop: 16, padding: 12, background: "#fef3c7", borderRadius: 8, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Icon name="warning" color="#b45309" size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: "#92400e", margin: 0, lineHeight: 1.5 }}>Halaman ini hanya untuk petugas yang berwenang.</p>
            </div>
          </div>
          <button onClick={() => onNav("landing")} style={{ display: "block", margin: "20px auto 0", background: "none", border: "none", color: COLORS.primary, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>← Kembali ke Beranda</button>
        </div>
      </main>
    </div>
  );
}