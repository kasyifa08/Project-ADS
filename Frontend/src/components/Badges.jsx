import { COLORS } from "./data";

export const StatusBadge = ({ status }) => {
  const map = {
    menunggu: { bg: "#fef3c7", color: "#b45309", label: "Menunggu" },
    diproses: { bg: "#dbeafe", color: "#1d4ed8", label: "Diproses" },
    diterima: { bg: "#dcfce7", color: "#15803d", label: "Diterima" },
    selesai:  { bg: "#dcfce7", color: "#15803d", label: "Selesai" },
    ditolak:  { bg: "#ffdad6", color: "#ba1a1a", label: "Ditolak" },
  };
  const s = map[status] || map.menunggu;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {s.label}
    </span>
  );
};

export const TypeBadge = ({ type }) => {
  // 1. Force lowercase so string comparison works regardless of API casing
  const normalizedType = (type || "").toLowerCase().trim();

  // 2. Set explicit configurations so there is no fallback confusion
  const isHilang = normalizedType === "hilang" || normalizedType === "kehilangan";

  return (
    <span style={{
      background: isHilang ? COLORS.errorContainer : COLORS.secondaryContainer,
      color: isHilang ? COLORS.error : COLORS.secondary,
      fontSize: 10, 
      fontWeight: 700, 
      padding: "3px 10px", 
      borderRadius: 99, 
      textTransform: "uppercase", 
      letterSpacing: "0.05em",
      display: "inline-block"
    }}>
      {/* FIX: Force text output to read consistently */}
      {isHilang ? "HILANG" : "TEMUAN"}
    </span>
  );
};