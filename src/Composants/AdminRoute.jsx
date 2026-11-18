import { Navigate, Outlet } from "react-router";
import { useAuth } from "../Context/AuthContext";

export default function AdminRoute() {
  const { estConnecte, estAdmin, chargement } = useAuth();

  console.log("[AdminRoute]", { estConnecte, estAdmin, chargement });

  if (chargement) return <p>Chargement…</p>;
  if (!estConnecte) return <Navigate to="/connexion" replace />;
  if (!estAdmin) return <Navigate to="/produits" replace />;

  return <Outlet />;
}