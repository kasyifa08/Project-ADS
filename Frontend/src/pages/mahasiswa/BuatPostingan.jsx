import { useState, useRef } from "react";
import api from "../../api/axios";
import { AppLayout } from "../../components/Layout";
import { Icon } from "../../components/Icon";
import { COLORS } from "../../components/data";
import { uploadImage } from "../../services/uploadService";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  primary: COLORS.primary,
  primaryContainer: COLORS.primaryContainer,
  primaryFixed: COLORS.primaryFixed,
  secondary: COLORS.secondary,
  secondaryContainer: COLORS.secondaryContainer,
  error: COLORS.error,
  errorContainer: COLORS.errorContainer,
  surface: COLORS.surface,
  surfaceContainerLow: COLORS.surfaceContainerLow,
  surfaceContainerLowest: COLORS.surfaceContainerLowest,
  onSurface: COLORS.onSurface,
  onSurfaceVariant: COLORS.onSurfaceVariant,
  outlineVariant: COLORS.outlineVariant,
  outline: COLORS.outline,
  success: COLORS.success,
  successContainer: COLORS.successContainer,
  navDark: COLORS.navDark,
};

// ─── STEP INDICATOR ────────────────────────────────────────────────────────
const STEPS = ["Tipe Laporan", "Detail Barang", "Unggah Foto"];

const StepIndicator = ({ step, total }) => (
  <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.outlineVariant}` }}>
    {/* Step labels with circles */}
    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
      {STEPS.map((label, i) => {
        const done = step > i + 1;
        const current = step === i + 1;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: done ? C.success : current ? C.primary : C.surfaceContainerLow,
                border: done ? "none" : current ? "none" : `2px solid ${C.outlineVariant}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
              }}>
                {done
                  ? <Icon name="check" size={18} color="white" />
                  : <span style={{ fontSize: 13, fontWeight: 700, color: current ? "white" : C.outline }}>{i + 1}</span>
                }
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: done ? C.success : current ? C.primary : "#94a3b8", whiteSpace: "nowrap" }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 3, margin: "0 8px", marginBottom: 18, background: done ? C.success : C.outlineVariant, borderRadius: 99, transition: "background 0.4s" }} />
            )}
          </div>
        );
      })}
    </div>
    {/* Progress bar */}
    <div style={{ height: 6, background: C.primaryFixed, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", background: C.primary, width: `${(step / total) * 100}%`, borderRadius: 99, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
    <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginTop: 8 }}>Langkah {step} dari {total}</p>
  </div>
);

// ─── STEP 1: TIPE LAPORAN ─────────────────────────────────────────────────
const Step1Type = ({ type, setType }) => {
  const options = [
    { val: "hilang", icon: "search_off", title: "Kehilangan", desc: "Saya kehilangan sesuatu dan ingin melaporkannya", color: C.error, bg: C.errorContainer, accent: "#7f1d1d" },
    { val: "temuan", icon: "inventory_2", title: "Temuan Barang", desc: "Saya menemukan barang milik orang lain", color: C.primary, bg: C.primaryFixed, accent: "#003ea8" },
  ];
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 36, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.outlineVariant}` }}>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6, color: C.onSurface }}>Pilih Tipe Laporan</h2>
      <p style={{ fontSize: 14, color: C.onSurfaceVariant, marginBottom: 32 }}>Apa yang ingin Anda laporkan hari ini?</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {options.map(t => {
          const selected = type === t.val;
          return (
            <button
              key={t.val}
              onClick={() => setType(t.val)}
              style={{
                padding: 28, borderRadius: 16,
                border: `2px solid ${selected ? t.color : C.outlineVariant}`,
                background: selected ? `${t.bg}50` : "white",
                cursor: "pointer", textAlign: "center",
                transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: selected ? `0 4px 16px ${t.color}22` : "none",
                transform: selected ? "translateY(-2px)" : "none",
              }}
              onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = t.color; }}
              onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = C.outlineVariant; }}
            >
              <div style={{ width: 72, height: 72, borderRadius: 20, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: selected ? `0 4px 12px ${t.color}33` : "none", transition: "box-shadow 0.2s" }}>
                <Icon name={t.icon} color={t.color} size={34} />
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8, color: selected ? t.accent : C.onSurface }}>{t.title}</h3>
              <p style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.5 }}>{t.desc}</p>
              {selected && (
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: t.color }}>
                  <Icon name="check_circle" size={16} color={t.color} />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Dipilih</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info banner berdasarkan tipe */}
      <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: type === "hilang" ? "#fff7ed" : "#eff6ff", border: `1px solid ${type === "hilang" ? "#fed7aa" : "#bfdbfe"}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon name="info" size={18} color={type === "hilang" ? "#ea580c" : C.primaryContainer} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 13, color: type === "hilang" ? "#9a3412" : "#1e40af", lineHeight: 1.6, margin: 0 }}>
          {type === "hilang"
            ? "Laporan kehilangan akan segera ditindaklanjuti oleh tim keamanan kampus. Pastikan informasi yang Anda isi seakurat mungkin."
            : "Terima kasih sudah melaporkan temuan barang! Barang akan segera disimpan di Pos Keamanan dan pemilik akan dihubungi."}
        </p>
      </div>
    </div>
  );
};

// ─── STEP 2: DETAIL BARANG ────────────────────────────────────────────────
const CATEGORIES = ["Elektronik", "Aksesori", "Dompet & Tas", "Kunci", "Dokumen", "Pakaian", "Lainnya"];

const InputField = ({ label, required, children }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8, color: C.onSurface }}>
      {label} {required && <span style={{ color: C.error }}>*</span>}
    </label>
    {children}
  </div>
);

const textInputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: `1.5px solid ${C.outlineVariant}`, fontSize: 14, outline: "none",
  boxSizing: "border-box", color: C.onSurface, background: "white",
  transition: "border-color 0.2s",
  fontFamily: "Inter, sans-serif",
};

const Step2Detail = ({ form, setForm, type }) => {
  const handleFocus = e => { e.target.style.borderColor = C.primary; };
  const handleBlur = e => { e.target.style.borderColor = C.outlineVariant; };

  return (
    <div style={{ background: "white", borderRadius: 16, padding: 36, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.outlineVariant}` }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: type === "hilang" ? C.errorContainer : C.primaryFixed, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={type === "hilang" ? "search_off" : "inventory_2"} size={20} color={type === "hilang" ? C.error : C.primary} />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: C.onSurface }}>Detail Barang</h2>
          <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: type === "hilang" ? C.errorContainer : C.primaryFixed, color: type === "hilang" ? C.error : C.primary }}>
            {type === "hilang" ? "Laporan Kehilangan" : "Laporan Temuan"}
          </span>
        </div>
      </div>
      <p style={{ fontSize: 14, color: C.onSurfaceVariant, marginBottom: 28 }}>Isi informasi barang sedetail mungkin untuk membantu proses pencarian.</p>

      {/* 2-col grid for first fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
        <InputField label="Nama Barang" required>
          <input
            value={form.nama_barang}

            onChange={e =>
              setForm({
                ...form,
                nama_barang: e.target.value
              })
            }
            onFocus={handleFocus} onBlur={handleBlur}
            style={textInputStyle}
          />
        </InputField>
        <InputField label="Kategori" required>
          <select
            value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}
            onFocus={handleFocus} onBlur={handleBlur}
            style={{ ...textInputStyle, background: "white", cursor: "pointer" }}
          >
            <option value="">Pilih Kategori</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </InputField>
        <InputField label={type === "hilang" ? "Lokasi Terakhir Dilihat" : "Lokasi Ditemukan"} required>
          <div style={{ position: "relative" }}>
            <Icon name="location_on" size={18} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text" value={form.lokasi} placeholder="Gedung GWW, Lantai 2..."
              onChange={e => setForm({ ...form, lokasi: e.target.value })}
              onFocus={handleFocus} onBlur={handleBlur}
              style={{ ...textInputStyle, paddingLeft: 38 }}
            />
          </div>
        </InputField>
        <InputField label="Tanggal Kejadian" required>
          <div style={{ position: "relative" }}>
            <Icon name="calendar_today" size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="date" value={form.waktu_kejadian}
              onChange={e => setForm({ ...form, waktu_kejadian: e.target.value })}
              onFocus={handleFocus} onBlur={handleBlur}
              style={{ ...textInputStyle, paddingLeft: 38 }}
            />
          </div>
        </InputField>
        <InputField label="Warna Dominan">
          <div style={{ position: "relative" }}>
            <Icon name="palette" size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text" value={form.warna} placeholder="Hitam, Biru, Silver..."
              onChange={e => setForm({ ...form, warna: e.target.value })}
              onFocus={handleFocus} onBlur={handleBlur}
              style={{ ...textInputStyle, paddingLeft: 38 }}
            />
          </div>
        </InputField>
        <InputField label="Ciri Khas / Merek">
          <div style={{ position: "relative" }}>
            <Icon name="label" size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text" value={form.ciri_barang || ""} placeholder="Samsung, Jansport, Adidas..."
              onChange={e => setForm({ ...form, ciri_barang: e.target.value })}
              onFocus={handleFocus} onBlur={handleBlur}
              style={{ ...textInputStyle, paddingLeft: 38 }}
            />
          </div>
        </InputField>
      </div>

      {/* Description - full width */}
      <InputField label="Deskripsi Lengkap" required>
        <textarea
          value={form.deskripsi} rows={5}
          placeholder="Jelaskan ciri-ciri khusus barang, isi yang ada di dalamnya, kondisi terakhir, dll..."
          onChange={e => setForm({ ...form, deskripsi: e.target.value })}
          onFocus={handleFocus} onBlur={handleBlur}
          style={{ ...textInputStyle, resize: "vertical", lineHeight: 1.6, minHeight: 120 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>Semakin detail, semakin mudah ditemukan.</p>
          <p style={{ fontSize: 12, color: form.deskripsi.length > 180 ? C.error : "#94a3b8" }}>{form.deskripsi.length}/200</p>
        </div>
      </InputField>

      {/* Contact info */}
      <div style={{ padding: 20, background: C.surfaceContainerLow, borderRadius: 12, border: `1px solid ${C.outlineVariant}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.onSurface, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="contact_phone" size={16} color={C.primary} /> Kontak yang Bisa Dihubungi
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <InputField label="Nomor WhatsApp">
            <div style={{ position: "relative" }}>
              <Icon name="phone" size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="tel" value={form.phone || ""} placeholder="0812-xxxx-xxxx"
                onChange={e => setForm({ ...form, phone: e.target.value })}
                onFocus={handleFocus} onBlur={handleBlur}
                style={{ ...textInputStyle, paddingLeft: 38 }}
              />
            </div>
          </InputField>
          <InputField label="Email">
            <div style={{ position: "relative" }}>
              <Icon name="mail" size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email" value={form.email || ""} placeholder="nama@email.com"
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={handleFocus} onBlur={handleBlur}
                style={{ ...textInputStyle, paddingLeft: 38 }}
              />
            </div>
          </InputField>
        </div>
      </div>
    </div>
  );
};

// ─── STEP 3: UNGGAH FOTO ──────────────────────────────────────────────────
const Step3Upload = ({ form, type, files, setFiles }) => {
  const [dragging, setDragging] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileRef = useRef();

  const handleFiles = (selectedFiles) => {

    const arr = Array.from(selectedFiles);

    setFiles(arr);

    arr.forEach(file => {
      const reader = new FileReader();

      reader.onload = e =>
        setPreviews(prev => [
          ...prev,
          {
            url: e.target.result,
            name: file.name
          }
        ]);

      reader.readAsDataURL(file);
    });
  };

  const removePreview = (idx) => {
    setPreviews(prev => prev.filter((_, i) => i !== idx));
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };
  // Summary of what was filled
  const summary = [
    { icon: "inventory_2", label: "Barang", value: form.nama_barang || "—" },
    { icon: "category", label: "Kategori", value: form.kategori || "—" },
    { icon: "location_on", label: "Lokasi", value: form.lokasi || "—" },
    { icon: "calendar_today", label: "Tanggal", value: form.waktu_kejadian || "—" },
  ];

  const isReady = form.nama_barang && form.lokasi && form.waktu_kejadian && form.kategori;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Photo upload card */}
      <div style={{ background: "white", borderRadius: 16, padding: 36, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.outlineVariant}` }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6, color: C.onSurface }}>Unggah Foto Barang</h2>
        <p style={{ fontSize: 14, color: C.onSurfaceVariant, marginBottom: 24 }}>Foto membantu proses identifikasi barang lebih cepat. Tambahkan hingga 4 foto. (Opsional)</p>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          style={{
            border: `2px dashed ${dragging ? C.primary : C.outlineVariant}`,
            borderRadius: 14, padding: "48px 24px", textAlign: "center", cursor: "pointer",
            background: dragging ? `${C.primaryFixed}40` : C.surfaceContainerLow,
            transition: "all 0.2s",
          }}
        >
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: dragging ? C.primaryFixed : "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: `1px solid ${C.outlineVariant}`, transition: "all 0.2s" }}>
            <Icon name="cloud_upload" color={dragging ? C.primary : "#94a3b8"} size={36} />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: dragging ? C.primary : C.onSurface }}>
            {dragging ? "Lepaskan untuk mengunggah" : "Klik atau seret foto ke sini"}
          </h3>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>PNG, JPG, WEBP · Maks. 5MB per file · Hingga 4 foto</p>
        </div>

        {/* Preview grid */}
        {previews.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
            {previews.map((p, i) => (
              <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.outlineVariant}`, aspectRatio: "1" }}>
                <img src={p.url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  onClick={() => removePreview(i)}
                  style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Icon name="close" size={14} color="white" />
                </button>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", padding: "4px 6px" }}>
                  <p style={{ fontSize: 10, color: "white", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                </div>
              </div>
            ))}
            {previews.length < 4 && (
              <div onClick={() => fileRef.current?.click()} style={{ borderRadius: 10, border: `2px dashed ${C.outlineVariant}`, aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: C.surfaceContainerLow }}>
                <Icon name="add_photo_alternate" size={28} color="#94a3b8" />
                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Tambah</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ringkasan laporan */}
      <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.outlineVariant}` }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 600, color: C.onSurface, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="summarize" size={20} color={C.primary} /> Ringkasan Laporan
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {summary.map((s, i) => (
            <div key={i} style={{ background: C.surfaceContainerLow, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name={s.icon} size={18} color={C.primary} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{s.label}</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: C.onSurface, margin: 0 }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
        {form.deskripsi && (
          <div style={{ background: C.surfaceContainerLow, borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Deskripsi</p>
            <p style={{ fontSize: 14, color: C.onSurface, lineHeight: 1.6, margin: 0 }}>{form.deskripsi}</p>
          </div>
        )}

        {/* Ready / not ready banner */}
        {isReady ? (
          <div style={{ padding: 16, background: "#f0fdf4", borderRadius: 12, display: "flex", gap: 12, alignItems: "center", border: "1px solid #bbf7d0" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="check_circle" color={C.success} size={22} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#166534", margin: 0 }}>Laporan siap dikirim!</p>
              <p style={{ fontSize: 13, color: C.success, margin: 0 }}>Semua informasi wajib sudah terisi. Klik "Kirim Laporan" untuk melanjutkan.</p>
            </div>
          </div>
        ) : (
          <div style={{ padding: 16, background: "#fff7ed", borderRadius: 12, display: "flex", gap: 12, alignItems: "center", border: "1px solid #fed7aa" }}>
            <Icon name="warning" color="#ea580c" size={22} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "#9a3412", margin: 0 }}>Masih ada field wajib yang belum diisi. Kembali ke langkah sebelumnya untuk melengkapi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────
const SuccessScreen = ({ type, ticketId, onNav }) => (
  <div style={{ background: "white", borderRadius: 20, padding: 48, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: `1px solid ${C.outlineVariant}` }}>
    <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
      <Icon name="check_circle" size={52} color={C.success} />
    </div>
    <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 700, color: C.onSurface, marginBottom: 8 }}>
      Laporan Berhasil Dikirim!
    </h2>
    <p style={{ fontSize: 15, color: C.onSurfaceVariant, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
      {type === "hilang"
        ? "Laporan kehilangan Anda telah diterima. Tim keamanan kampus akan segera menindaklanjuti."
        : "Terima kasih telah melaporkan temuan barang! Barang akan segera diamankan di Pos Keamanan."}
    </p>
    <div style={{ background: C.surfaceContainerLow, borderRadius: 12, padding: "14px 24px", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32, border: `1px solid ${C.outlineVariant}` }}>
      <Icon name="confirmation_number" size={20} color={C.primary} />
      <span style={{ fontSize: 14, fontWeight: 600, color: C.onSurface }}>ID Tiket: </span>
      <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "monospace", color: C.primary }}>{ticketId}</span>
    </div>
    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
      <button onClick={() => onNav?.("tiket")} style={{ padding: "12px 28px", background: C.primary, color: "white", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="confirmation_number" size={18} color="white" /> Lihat Tiket Saya
      </button>
      <button onClick={() => onNav?.("dashboard")} style={{ padding: "12px 28px", background: C.surfaceContainerLow, color: C.onSurface, borderRadius: 10, fontWeight: 600, fontSize: 14, border: `1px solid ${C.outlineVariant}`, cursor: "pointer" }}>
        Kembali ke Beranda
      </button>
    </div>
  </div>
);


// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
const LaporBarang = ({ onNav, ticketsHilang, ticketsTemuan, setPostingan }) => {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [formData, setFormData] = useState({
    tipe: "hilang",
    kategori: "",
    nama_barang: "",
    deskripsi: "",
    ciri_barang: "",
    lokasi: "",
    waktu_kejadian: "",
    foto_url: "",
    warna: "",
    phone: "",
    email: "",
  });

  const [success, setSuccess] = useState(false);
  const TOTAL = 3;

  const handleSubmitTicket = async () => {
    try {
      setLoading(true);
      let foto_url = null;

      if (files.length > 0) {
        foto_url = await uploadImage(files[0]);
      }

      // Dynamic payload building to match backend column configurations
      const payload = {
        tipe: formData.tipe,
        nama_barang: formData.nama_barang,
        deskripsi: formData.deskripsi,
        ciri_barang: formData.ciri_barang,
        warna: formData.warna,
        foto_url: foto_url || null,
        lokasi_ditemukan: formData.lokasi,
        waktu_ditemukan: formData.waktu_kejadian,
        lokasi: formData.lokasi,
        waktu_kejadian: formData.waktu_kejadian,
        status: "MENUNGGU",
        kategori: formData.kategori, 
        category: formData.kategori  
      };

      const response = await api.post("/tickets/", payload);

      const newTicketId = response.data.ticket_id;
      setTicketId(newTicketId);
      setSuccess(true); // Only set success true once the backend safely responds!
      alert("Laporan berhasil dikirim!");
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert(error.response?.data?.detail || "Gagal mengirim laporan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // FIX: Remove the rogue else branch that mocks a fake success screen
  const handleNext = () => {
    if (step < TOTAL) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else onNav?.("dashboard");
  };

  const canNext =
    step === 1 ? true :
      step === 2
        ? (
          !!formData.nama_barang &&
          !!formData.lokasi &&
          !!formData.waktu_kejadian &&
          !!formData.kategori
        )
        :
        true;

  return (
    <AppLayout activePage="lapor" onNav={onNav} title={success ? "Laporan Terkirim" : "Lapor Barang"}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        .material-symbols-outlined { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; display:inline-block; }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:${C.surface}; font-family:Inter,sans-serif; }
        input::placeholder, textarea::placeholder { color:#94a3b8; }
        input:focus, textarea:focus, select:focus { border-color:${C.primary} !important; }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {!success ? (
          <>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13, color: C.onSurfaceVariant }}>
              <button onClick={() => onNav?.("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontWeight: 600, fontSize: 13 }}>Beranda</button>
              <Icon name="chevron_right" size={16} color="#94a3b8" />
              <span style={{ fontWeight: 600, color: C.onSurface }}>Lapor Barang</span>
            </div>

            {/* Step indicator */}
            <StepIndicator step={step} total={TOTAL} />

            {/* Step content */}
            {step === 1 && (
              <Step1Type
                type={formData.tipe}
                setType={(value) =>
                  setFormData({
                    ...formData,
                    tipe: value,
                  })
                }
              />
            )}
            {step === 2 && (
              <Step2Detail
                form={formData}
                setForm={setFormData}
                type={formData.tipe}
              />
            )}
            {step === 3 && (
              <Step3Upload
                form={formData}
                type={formData.tipe}
                files={files}
                setFiles={setFiles}
              />
            )}

            {/* Navigation buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 12 }}>
              <button
                onClick={handleBack}
                style={{ padding: "13px 28px", borderRadius: 10, border: `1.5px solid ${C.outlineVariant}`, cursor: "pointer", fontSize: 14, fontWeight: 600, background: "white", color: C.onSurfaceVariant, display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surfaceContainerLow; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
              >
                <Icon name="arrow_back" size={18} color={C.onSurfaceVariant} />
                {step > 1 ? "Kembali" : "Batalkan"}
              </button>
              <button
                onClick={
                  step < TOTAL
                    ? handleNext
                    : handleSubmitTicket
                }
                disabled={!canNext}
                style={{ padding: "13px 32px", borderRadius: 10, border: "none", cursor: canNext ? "pointer" : "default", fontSize: 14, fontWeight: 700, background: canNext ? C.primary : "#94a3b8", color: "white", display: "flex", alignItems: "center", gap: 8, boxShadow: canNext ? "0 4px 12px rgba(0,74,198,0.3)" : "none", transition: "all 0.2s" }}
              >
                {step < TOTAL
                  ? <><span>Lanjut</span><Icon name="arrow_forward" size={18} color="white" /></>
                  : <><Icon name="send" size={18} color="white" /><span>Kirim Laporan</span></>
                }
              </button>
            </div>
          </>
        ) : (
          <SuccessScreen type={formData.tipe} ticketId={ticketId} onNav={onNav} />
        )}
      </div>
    </AppLayout>
  );
};

export default LaporBarang;
