import { useState } from "react";
import api from "../api/axios";
import { Icon } from "./Icon";
import { COLORS } from "./data";

export default function LoginMahasiswa({ onNav }) {
  const [showPass, setShowPass] = useState(false);

  // STATE EMAIL & PASSWORD
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOADING
  const [loading, setLoading] = useState(false);

  // HANDLE LOGIN
  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
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

      // AMBIL TOKEN
      const token = response.data.access_token;

      // SIMPAN TOKEN
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.role);

      // AMBIL DATA USER LOGIN
      const userResponse = await api.get(
        "/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // SIMPAN DATA USER
      localStorage.setItem(
        "user",
        JSON.stringify(userResponse.data)
      );

      console.log(userResponse.data);

      alert("Login berhasil!");

      onNav("dashboard");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Login gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        background: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #f1f5f9",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon
              name="search_check"
              color={COLORS.primary}
              size={24}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#2563eb",
              }}
            >
              IPB Lost & Found
            </span>
          </div>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 440,
            background: "white",
            borderRadius: 16,
            border: `1px solid ${COLORS.outlineVariant}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: "center",
              borderBottom: `1px solid ${COLORS.surfaceContainerLow}`,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                background: COLORS.primaryFixed,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Icon
                name="school"
                color={COLORS.primary}
                size={32}
              />
            </div>

            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 22,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Masuk Mahasiswa
            </h1>

            <p
              style={{
                fontSize: 14,
                color: COLORS.onSurfaceVariant,
              }}
            >
              Silakan masuk menggunakan akun IPB Anda
            </p>
          </div>

          <div style={{ padding: 24 }}>

            {/* EMAIL */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.onSurfaceVariant,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Alamat Email
              </label>

              <div style={{ position: "relative" }}>
                <Icon
                  name="mail"
                  size={18}
                  color="#94a3b8"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />

                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: 40,
                    paddingRight: 16,
                    paddingTop: 12,
                    paddingBottom: 12,
                    borderRadius: 8,
                    border: `1px solid ${COLORS.outlineVariant}`,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.onSurfaceVariant,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Kata Sandi
              </label>

              <div style={{ position: "relative" }}>
                <Icon
                  name="lock"
                  size={18}
                  color="#94a3b8"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: 40,
                    paddingRight: 40,
                    paddingTop: 12,
                    paddingBottom: 12,
                    borderRadius: 8,
                    border: `1px solid ${COLORS.outlineVariant}`,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />

                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <Icon
                    name={showPass ? "visibility_off" : "visibility"}
                    size={18}
                    color="#94a3b8"
                  />
                </button>
              </div>
            </div>

            {/* BUTTON LOGIN */}
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: COLORS.primaryContainer,
                color: "white",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Loading..." : "Masuk Sekarang"}
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}