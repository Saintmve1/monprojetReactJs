import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  // Au démarrage : on restaure la session sauvegardée (survit au F5)
  useEffect(() => {
    try {
      const sauvegarde = localStorage.getItem("utilisateur");
      if (sauvegarde) {
        console.log("[useEffect] session restaurée");
        setUtilisateur(JSON.parse(sauvegarde));
      }
    } catch {
      localStorage.removeItem("utilisateur"); // donnée corrompue : on l'efface
    }
    setChargement(false);
  }, []);

  // Appelée par la page Connexion APRÈS que le serveur a accepté le login
  const connecter = useCallback((session) => {
    setUtilisateur(session);
    localStorage.setItem("utilisateur", JSON.stringify(session));
  }, []);

  const deconnecter = useCallback(() => {
    setUtilisateur(null);
    localStorage.removeItem("utilisateur");
  }, []);

  const value = useMemo(() => {
    console.log("[useMemo] value du contexte recalculée");
    return {
      utilisateur,
      estConnecte: utilisateur !== null,
      estAdmin: utilisateur?.role === "admin",
      chargement,
      connecter,
      deconnecter,
    };
  }, [utilisateur, chargement, connecter, deconnecter]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  }
  return ctx;
}