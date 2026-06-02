import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { INIT_TICKETS_HILANG, INIT_TICKETS_TEMUAN } from "./components/data";
import api from "./api/axios";

import LandingPage from "./components/LandingPage";
import LoginAdmin from "./components/LoginAdmin";
import LoginMahasiswa from "./components/LoginMahasiswa";
import AdminRoute from "./routes/AdminRoutes";
import AdminDashboard from "./pages/admin/DashboardAdmin";

import BuatPostinganAdmin from "./pages/admin/BuatPostingan";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DetailTiketAdmin from "./pages/admin/DetailTiketAdmin";
import KelolaTiketHilang from "./pages/admin/KelolaTiketHilang";
import KelolaTiketTemuan from "./pages/admin/KelolaTiketTemuan";
import KeolalaPostingan from "./pages/admin/KeolalaPostingan";
import VerifikasiLaporan from "./pages/admin/VerifikasiLaporan";

import BuatPostinganMahasiswa from "./pages/mahasiswa/BuatPostingan";
import DashboardMahasiswa from "./pages/mahasiswa/DashboardMahasiswa";
import CariBarang from "./pages/mahasiswa/CariBarang";
import StatusTiket from "./pages/mahasiswa/StatusTiket";
import DetailTiket from "./pages/mahasiswa/DetailTiket";
import DetailPostingan from "./pages/mahasiswa/DetailPostingan";
import Notifikasi from "./pages/mahasiswa/Notifikasi";

function AppRoutes() {
  const navigate = useNavigate();

  const [ticketsHilang, setTicketsHilang] = useState(INIT_TICKETS_HILANG);
  const [ticketsTemuan, setTicketsTemuan] = useState(INIT_TICKETS_TEMUAN);
  const [postingan, setPostingan] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tickets from backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        // Only fetch if user is logged in as admin
        if (token && role === "admin") {
          const response = await api.get("/tickets/all");
          if (response.data) {
            const tickets = Array.isArray(response.data) ? response.data : [];

            // Separate into hilang and temuan
            const hilang = tickets.filter(t => t.tipe === "hilang");
            const temuan = tickets.filter(t => t.tipe === "temuan");

            if (hilang.length > 0) setTicketsHilang(hilang);
            if (temuan.length > 0) setTicketsTemuan(temuan);
          }
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        // Keep using mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts/");

        const formatted = response.data.map((item) => {
          // Normalize the reporting type
          const itemType = (item.tipe || item.type || item.ticket_type || "temuan").toLowerCase();

          return {
            id: item.id,
            item: item.judul || item.nama_barang,
            img: item.foto_url?.startsWith("http")
              ? item.foto_url
              : `project-ads-production-9aeb.up.railway.app${item.foto_url}`,
            location: item.lokasi_ditemukan || item.lokasi,
            time: item.waktu_ditemukan || item.waktu_kejadian
              ? new Date(item.waktu_ditemukan || item.waktu_kejadian).toLocaleString("id-ID")
              : "-",
            type: itemType,
            deskripsi: item.deskripsi || item.desc,
            status: item.status || "MENUNGGU",
            
            // 🌟 THE MISSING LINKS: Map these directly from backend database columns
            kategori: item.kategori || item.category || "Lainnya",
            warna: item.warna || item.color || "-",
            ciri_barang: item.ciri_barang || item.characteristics || "-"
          };
        });

        setPostingan(formatted);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Helper function to map old state-based navigation keys to React Router paths
  const handleNav = (key) => {
    switch (key) {
      case "landing": navigate("/"); break;
      case "login_mahasiswa": navigate("/login-mahasiswa"); break;
      case "admin_login": navigate("/login-admin"); break;

      case "dashboard": navigate("/mahasiswa/dashboard"); break;
      case "cari": navigate("/mahasiswa/cari-barang"); break;
      case "tiket": navigate("/mahasiswa/tiket"); break;
      case "lapor": navigate("/mahasiswa/lapor"); break;
      case "notifikasi": navigate("/mahasiswa/notifikasi"); break;
      case "detail_tiket": navigate("/mahasiswa/detail-tiket"); break;
      case "detail_postingan": navigate("/mahasiswa/detail-postingan"); break;

      case "admin_dashboard": navigate("/admin/dashboard"); break;
      case "admin_tiket_hilang": navigate("/admin/tiket-hilang"); break;
      case "admin_tiket_temuan": navigate("/admin/tiket-temuan"); break;
      case "admin_verifikasi": navigate("/admin/verifikasi"); break;
      case "admin_postingan": navigate("/admin/postingan"); break;
      case "admin_buat_postingan": navigate("/admin/buat-postingan"); break;
      case "admin_detail_tiket": navigate("/admin/detail-tiket"); break;

      default:
        console.warn(`No route configured for key: ${key}`);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNav={handleNav} />} />
      <Route path="/login" element={<Navigate to="/login-admin" />} />

      <Route path="/login-admin" element={<LoginAdmin onNav={handleNav} />} />
      <Route path="/login-mahasiswa" element={<LoginMahasiswa onNav={handleNav} />} />
      <Route path="/mahasiswa/dashboard" element={<DashboardMahasiswa onNav={handleNav} postingan={postingan} setSelectedItem={setSelectedItem} />} />
      <Route path="/mahasiswa/cari-barang" element={<CariBarang onNav={handleNav} postingan={postingan} setSelectedItem={setSelectedItem} />} />
      <Route path="/mahasiswa/tiket" element={<StatusTiket onNav={handleNav} ticketsHilang={ticketsHilang} setTicketsHilang={setTicketsHilang} ticketsTemuan={ticketsTemuan} setTicketsTemuan={setTicketsTemuan} setSelectedTicket={setSelectedTicket} />} />
      <Route path="/mahasiswa/lapor" element={<BuatPostinganMahasiswa onNav={handleNav} ticketsHilang={ticketsHilang} ticketsTemuan={ticketsTemuan} setPostingan={setPostingan} />} />
      <Route path="/mahasiswa/detail-tiket" element={<DetailTiket onNav={handleNav} selectedTicket={selectedTicket} ticketsHilang={ticketsHilang} ticketsTemuan={ticketsTemuan} setTicketsHilang={setTicketsHilang} setTicketsTemuan={setTicketsTemuan} />} />
      <Route path="/mahasiswa/detail-postingan" element={<DetailPostingan onNav={handleNav} selectedItem={selectedItem} />} />
      <Route path="/mahasiswa/notifikasi" element={<Notifikasi onNav={handleNav} />} />
      <Route path="/admin/dashboard" element={<AdminRoute><DashboardAdmin onNav={handleNav} ticketsHilang={ticketsHilang} ticketsTemuan={ticketsTemuan} loading={loading} /></AdminRoute>} />

      <Route path="/admin/tiket-hilang" element={<AdminRoute><KelolaTiketHilang onNav={handleNav} ticketsHilang={ticketsHilang} setTicketsHilang={setTicketsHilang} setSelectedTicket={setSelectedTicket} /></AdminRoute>} />
      <Route path="/admin/tiket-temuan" element={<AdminRoute><KelolaTiketTemuan onNav={handleNav} ticketsTemuan={ticketsTemuan} setTicketsTemuan={setTicketsTemuan} setPostingan={setPostingan} setSelectedTicket={setSelectedTicket} /></AdminRoute>} />
      <Route path="/admin/verifikasi" element={<AdminRoute><VerifikasiLaporan onNav={handleNav} ticketsHilang={ticketsHilang} ticketsTemuan={ticketsTemuan} /></AdminRoute>} />
      <Route path="/admin/postingan" element={<AdminRoute><KeolalaPostingan onNav={handleNav} postingan={postingan} setPostingan={setPostingan} /></AdminRoute>} />
      <Route path="/admin/buat-postingan" element={<AdminRoute><BuatPostinganAdmin onNav={handleNav} ticketsHilang={ticketsHilang} ticketsTemuan={ticketsTemuan} setPostingan={setPostingan} /></AdminRoute>} />
      <Route path="/admin/detail-tiket" element={<AdminRoute><DetailTiketAdmin onNav={handleNav} selectedTicket={selectedTicket} ticketsHilang={ticketsHilang} setTicketsHilang={setTicketsHilang} ticketsTemuan={ticketsTemuan} setTicketsTemuan={setTicketsTemuan} setPostingan={setPostingan} /></AdminRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;