import { useEffect, useState } from "react";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { StatusBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";
import api from "../../api/axios";

export default function DashboardAdmin({
  onNav,
  ticketsHilang = [],
  ticketsTemuan = [],
  loading = false,
}) {
  const [tickets, setTickets] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setDashboardLoading(true);
      try {
        const res = await api.get("/tickets/all");

        if (res.data && Array.isArray(res.data)) {
          console.log("Backend tickets:", res.data); // DEBUG
          setTickets(res.data);
        } else {
          console.log("No data from backend, using props"); // DEBUG
          // Fallback to passed props if backend doesn't return data
          setTickets([...ticketsHilang, ...ticketsTemuan]);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        // Fallback to passed props on error
        setTickets([...ticketsHilang, ...ticketsTemuan]);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchData();
  }, [ticketsHilang, ticketsTemuan]);

  // Filter tiket - use backend data if available, otherwise use props
  const displayTicketsHilang =
    tickets.filter((t) => t.tipe === "hilang").length > 0
      ? tickets.filter((t) => t.tipe === "hilang")
      : ticketsHilang || [];

  const displayTicketsTemuan =
    tickets.filter((t) => t.tipe === "temuan").length > 0
      ? tickets.filter((t) => t.tipe === "temuan")
      : ticketsTemuan || [];

  const allTickets = [
    ...displayTicketsHilang,
    ...displayTicketsTemuan,
  ].filter(Boolean); // Remove any null/undefined items

  console.log(
    "Status tiket:",
    allTickets.map((t) => t.status)
  );

  // Statistik - handle different status formats from backend
  const totalMenunggu = allTickets.filter((t) => {
    const status = (t.status || "").toLowerCase().trim();

    return (
      status === "menunggu" ||
      status === "pending"
    );
  }).length;

  const totalDiproses = allTickets.filter((t) => {
    const status = (t.status || "").toLowerCase().trim();

    return (
      status === "diproses" ||
      status === "processing"
    );
  }).length;

  const totalDikonfirmasi = allTickets.filter((t) => {
    const status = (t.status || "").toLowerCase().trim();

    return (
      status === "dikonfirmasi" ||
      status === "confirmed"
    );
  }).length;

  const totalSelesai = allTickets.filter((t) => {
    const status = (t.status || "").toLowerCase().trim();

    return (
      status === "selesai" ||
      status === "completed"
    );
  }).length;

  const totalDitolak = allTickets.filter((t) => {
    const status = (t.status || "").toLowerCase().trim();

    return (
      status === "ditolak" ||
      status === "rejected"
    );
  }).length;

  // DEBUG: Log status counts
  useEffect(() => {
    console.log("Status counts:", {
      total: allTickets.length,
      menunggu: totalMenunggu,
      diproses: totalDiproses,
      selesai: totalSelesai,
      ditolak: totalDitolak,
    });
  }, [totalMenunggu, totalDiproses, totalSelesai, totalDitolak]);

  const stats = [
    {
      label: "Total Tiket",
      value: allTickets.length,
      color: COLORS.primary,
      icon: "confirmation_number",
    },
    {
      label: "Menunggu Verifikasi",
      value: totalMenunggu,
      color: "#d97706",
      icon: "pending",
    },
    {
      label: "Sedang Diproses",
      value: totalDiproses,
      color: "#0284c7",
      icon: "sync",
    },
    {
      label: "Selesai",
      value: totalSelesai,
      color: "#16a34a",
      icon: "check_circle",
    },
    {
      label: "Ditolak",
      value: totalDitolak,
      color: "#dc2626",
      icon: "cancel",
    },
  ];

  return (
    <AppLayout
      activePage="admin_dashboard"
      onNav={onNav}
      title="Dashboard Admin"
      isAdmin={true}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Statistik */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                border: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#64748b",
                  }}
                >
                  {s.label}
                </p>

                <Icon
                  name={s.icon}
                  color={s.color}
                  size={22}
                />
              </div>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: s.color,
                  margin: 0,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 24,
          }}
        >

          {/* Tiket Kehilangan */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                Tiket Kehilangan Terbaru
              </h2>

              <button
                onClick={() => onNav("admin_tiket_hilang")}
                style={{
                  padding: "6px 14px",
                  background: COLORS.primaryFixed,
                  color: COLORS.primary,
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 12,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Lihat Semua
              </button>
            </div>

            {displayTicketsHilang.length === 0 ? (
              <p
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                Belum ada tiket kehilangan
              </p>
            ) : (
              displayTicketsHilang.slice(0, 3).map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom:
                      i < 2
                        ? "1px solid #f1f5f9"
                        : "none",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        margin: "0 0 2px",
                      }}
                    >
                      {t.nama_barang || t.item}
                    </p>

                    <p
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        margin: 0,
                      }}
                    >
                      {t.lokasi || t.location}
                    </p>
                  </div>

                  <StatusBadge status={t.status} />
                </div>
              ))
            )}
          </div>

          {/* Tiket Temuan */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                Tiket Temuan Terbaru
              </h2>

              <button
                onClick={() => onNav("admin_tiket_temuan")}
                style={{
                  padding: "6px 14px",
                  background: COLORS.primaryFixed,
                  color: COLORS.primary,
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 12,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Lihat Semua
              </button>
            </div>

            {displayTicketsTemuan.length === 0 ? (
              <p
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                Belum ada tiket temuan
              </p>
            ) : (
              displayTicketsTemuan.slice(0, 3).map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom:
                      i < 2
                        ? "1px solid #f1f5f9"
                        : "none",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        margin: "0 0 2px",
                      }}
                    >
                      {t.nama_barang || t.item}
                    </p>

                    <p
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        margin: 0,
                      }}
                    >
                      {t.lokasi || t.location}
                    </p>
                  </div>

                  <StatusBadge status={t.status} />
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </AppLayout>
  );
}