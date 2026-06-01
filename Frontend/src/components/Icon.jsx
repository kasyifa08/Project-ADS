export const Icon = ({ name, size = 22, color, style = {} }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, color, verticalAlign: "middle", lineHeight: 1, ...style }}>
    {name}
  </span>
);