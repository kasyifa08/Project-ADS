export const Modal = ({ children, onClose }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{ background: "white", borderRadius: 20, padding: 0, maxWidth: 1200, width: "95%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
      {children}
    </div>
  </div>
);