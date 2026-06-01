import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("TOKEN:", token);
  console.log("ROLE:", role);

  if (!token) {
    return <Navigate to="/login-admin" />;
  }

  if (role !== "admin") {
    return <Navigate to="/login-admin" />;
  }

  return children;
}