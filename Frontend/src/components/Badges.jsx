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

export const TypeBadge = ({ type }) => (
  <span style={{
    background: type === "hilang" ? COLORS.errorContainer : COLORS.secondaryContainer,
    color: type === "hilang" ? COLORS.error : COLORS.secondary,
    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em"
  }}>{type}</span>
);