import { Navigate, Outlet, useOutletContext } from "react-router";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute() {
  const { estConnecte, chargement } = useAuth();
  // Contexte envoyé par Layout (categories)
  const ctx = useOutletContext();

  console.log("[ProtectedRoute]", { estConnecte, chargement });

  if (chargement) {
    return <p>Chargement…</p>;
  }

  if (!estConnecte) {
    return <Navigate to="/connexion" replace />;
  }

  // On retransmet le contexte aux routes enfants (Content, Panier...)
  return <Outlet context={ctx} />;
}