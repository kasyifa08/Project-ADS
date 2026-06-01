import { useState } from "react";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { Modal } from "../../components/Modal";
import { TypeBadge, StatusBadge } from "../../components/Badges";
import { COLORS } from "../../components/data";

export default function KelolaPostingan({ onNav, postingan, setPostingan }) {
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({ ...item });
  };
  const saveEdit = () => {
    setPostingan(prev => prev.map(p => p.id === editForm.id ? editForm : p));
    setEditItem(null);
  };
  const confirmDelete = () => {
    setPostingan(prev => prev.filter(p => p.id !== deleteItem.id));
    setDeleteItem(null);
  };

  return (
    <AppLayout activePage="admin_postingan" onNav={onNav} title="Manajemen Postingan" isAdmin={true}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <p style={{ fontSize: 14, color: COLORS.onSurfaceVariant }}>Kelola semua postingan barang hilang dan temuan di portal.</p>
          <button onClick={() => onNav("admin_buat_postingan")} style={{ padding: "10px 22px", background: COLORS.primary, color: "white", borderRadius: 8, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", display: "flex", gap: 8, alignItems: "center" }}>
            <Icon name="add" color="white" size={18} /> Tambah Postingan
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {postingan.map(item => (
            <div key={item.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
              <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                <img src={item.img} alt={item.item} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 8, left: 8 }}><TypeBadge type={item.type} /></div>
                <div style={{ position: "absolute", top: 8, right: 8 }}><StatusBadge status={item.status} /></div>
              </div>
              <div style={{ padding: 16 }}>
                <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.item}</h4>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>📍 {item.location}</p>
                <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>🕐 {item.time}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(item)} style={{ flex: 1, padding: "8px", background: COLORS.primaryFixed, color: COLORS.primary, borderRadius: 6, fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <Icon name="edit" size={13} color={COLORS.primary} /> Edit
                  </button>
                  <button onClick={() => setDeleteItem(item)} style={{ flex: 1, padding: "8px", background: COLORS.errorContainer, color: COLORS.error, borderRadius: 6, fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <Icon name="delete" size={13} color={COLORS.error} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <Modal onClose={() => setEditItem(null)}>
          <div style={{ padding: 0 }}>
            <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
              <img src={editForm.img} alt={editForm.item} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
              <div style={{ position: "absolute", bottom: 16, left: 20, display: "flex", gap: 8 }}>
                <TypeBadge type={editForm.type} />
                <StatusBadge status={editForm.status} />
              </div>
              <button onClick={() => setEditItem(null)} style={{ position: "absolute", top: 14, right: 14, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="close" size={18} color="#374151" />
              </button>
            </div>

            <div style={{ padding: 28 }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Edit Postingan</h2>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, fontFamily: "monospace" }}>{editForm.id} · Tiket: {editForm.ticketId}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Kategori", value: editForm.category },
                  { label: "Warna", value: editForm.color },
                ].map(f => (
                  <div key={f.label} style={{ background: COLORS.surfaceContainerLow, borderRadius: 10, padding: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: COLORS.onSurfaceVariant, textTransform: "uppercase", marginBottom: 4 }}>{f.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{f.value}</p>
                  </div>
                ))}
              </div>

              {[
                { key: "item", label: "Nama Barang" },
                { key: "location", label: "Lokasi" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input value={editForm[f.key] || ""} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid #e2e8f0`, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Deskripsi</label>
                <textarea value={editForm.desc || ""} onChange={e => setEditForm({ ...editForm, desc: e.target.value })} rows={4}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid #e2e8f0`, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Status</label>
                <select value={editForm.status || "menunggu"} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid #e2e8f0`, fontSize: 14, outline: "none", background: "white" }}>
                  {["menunggu", "diproses", "selesai"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={saveEdit} style={{ flex: 1, padding: 14, background: COLORS.primary, color: "white", borderRadius: 10, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
                  Simpan Perubahan
                </button>
                <button onClick={() => setEditItem(null)} style={{ padding: 14, background: COLORS.surfaceContainerLow, color: COLORS.onSurface, borderRadius: 10, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <Modal onClose={() => setDeleteItem(null)}>
          <div style={{ padding: 32, textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon name="check_circle" color={COLORS.success} size={42} />
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
              Barang Sudah Ditemukan?
            </h2>
            <p style={{ fontSize: 15, color: COLORS.onSurfaceVariant, lineHeight: 1.6, marginBottom: 12 }}>
              Anda akan menghapus postingan:
            </p>
            <div style={{ background: COLORS.surfaceContainerLow, borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                  <img src={deleteItem.img} alt={deleteItem.item} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 2px" }}>{deleteItem.item}</p>
                  <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>📍 {deleteItem.location}</p>
                </div>
              </div>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 16, marginBottom: 28, border: "1px solid #bbf7d0" }}>
              <p style={{ fontSize: 14, color: "#166534", fontWeight: 500, margin: 0 }}>
                ✓ Keterangan: Barang ini sudah ditemukan / dikembalikan kepada pemiliknya. Postingan akan dihapus dari portal.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={confirmDelete} style={{ flex: 1, padding: 14, background: COLORS.success, color: "white", borderRadius: 10, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
                Ya, Hapus Postingan
              </button>
              <button onClick={() => setDeleteItem(null)} style={{ flex: 1, padding: 14, background: COLORS.surfaceContainerLow, color: COLORS.onSurface, borderRadius: 10, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
                Batal
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}