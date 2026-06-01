import { useEffect, useState } from "react";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { COLORS } from "../../components/data";
import api from "../../api/axios";

export default function BuatPostingan({ onNav, setPostingan }) {
  const [ticketId, setTicketId] = useState("");
  const [found, setFound] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    item: "",
    location: "",
    desc: "",
    category: "",
    color: "",
    status: "menunggu",
    type: "hilang",
  });

  const [saved, setSaved] = useState(false);

  // ambil semua tiket dari backend
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets/all");
      setTickets(res.data || []);
    } catch (err) {
      console.error("Gagal ambil tickets:", err);
    }
  };

  // cari tiket dari backend
  const handleLookup = () => {
    const ticket = tickets.find(
      (t) => String(t.id) === String(ticketId.trim())
    );

    if (ticket) {
      setFound(ticket);
      setForm({
        item: ticket.nama_barang,
        location: ticket.lokasi,
        desc: ticket.deskripsi || "",
        category: ticket.kategori || "",
        color: "",
        status: "diproses",
        type: ticket.tipe,
      });
    } else {
      setFound(false);
    }
  };

  // publish → update backend + bikin post
  const handleSave = async () => {
    try {
      // 1. update status di backend
      await api.patch(`/tickets/${found.id}/status`, {
        status: form.status,
      });

      // 2. buat postingan di frontend state
      const newPost = {
        id: `POST-${Date.now()}`,
        item: form.item,
        location: form.location,
        desc: form.desc,
        category: form.category,
        color: form.color,
        type: form.type,
        status: form.status,
        time: "Baru saja",
        img:
          found?.foto_url ||
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        ticketId: found.id,
      };

      setPostingan((prev) => [newPost, ...prev]);
      setSaved(true);

      setTimeout(() => {
        onNav("admin_postingan");
      }, 1200);
    } catch (err) {
      console.error("Gagal publish:", err);
      alert(err.response?.data?.detail || "Gagal membuat postingan");
    }
  };

  return (
    <AppLayout
      activePage="admin_postingan"
      onNav={onNav}
      title="Buat Postingan"
      isAdmin={true}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* BACK BUTTON */}
        <button
          onClick={() => onNav("admin_postingan")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: COLORS.primary,
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          <Icon name="arrow_back" size={18} color={COLORS.primary} />
          Kembali
        </button>

        {/* SEARCH */}
        <div style={{ background: "white", padding: 24, borderRadius: 16 }}>
          <h2>Buat Postingan dari Tiket</h2>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <input
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="Masukkan ID tiket"
              style={{ flex: 1, padding: 12 }}
            />

            <button onClick={handleLookup}>Cari</button>
          </div>

          {found === false && <p>Tiket tidak ditemukan</p>}

          {found && (
            <div style={{ marginTop: 16 }}>
              <p>
                <b>{found.nama_barang}</b>
              </p>
              <p>{found.lokasi}</p>
            </div>
          )}
        </div>

        {/* FORM */}
        {found && (
          <div style={{ marginTop: 20, background: "white", padding: 24 }}>
            <input
              value={form.item}
              onChange={(e) =>
                setForm({ ...form, item: e.target.value })
              }
              placeholder="Nama barang"
            />

            <input
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              placeholder="Lokasi"
            />

            <textarea
              value={form.desc}
              onChange={(e) =>
                setForm({ ...form, desc: e.target.value })
              }
              placeholder="Deskripsi"
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="diproses">Diproses</option>
              <option value="dikonfirmasi">Dikonfirmasi</option>
              <option value="selesai">Selesai</option>
            </select>

            <button onClick={handleSave}>
              Publish Postingan
            </button>
          </div>
        )}

        {saved && (
          <p style={{ color: "green" }}>
            Postingan berhasil dibuat!
          </p>
        )}
      </div>
    </AppLayout>
  );
}