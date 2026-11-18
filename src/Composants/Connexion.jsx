import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import styles from "./Connexion.module.css";
import { useAuth } from "../Context/AuthContext";

function Connexion() {
  const navigate = useNavigate();
  const { connecter, estConnecte, estAdmin } = useAuth(); // estAdmin ajouté ici

  const [form, setForm] = useState({ email: "", password: "" });
  const [erreur, setErreur] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      console.log("[connexion] réponse du serveur :", data);

      if (!res.ok) {
        setErreur(data.message);
        return;
      }

      setErreur("");
      const role = data.role ?? "client";
      connecter({ email: form.email, prenom: data.prenom, nom: data.nom, role });
      navigate(role === "admin" ? "/admin" : "/produits", { replace: true });
    } catch {
      setErreur("Serveur injoignable. Vérifie que le backend est lancé.");
    }
  };

  // Déjà connecté : inutile d'afficher le formulaire
  if (estConnecte) {
    return <Navigate to={estAdmin ? "/admin" : "/produits"} replace />;
  }

  return (
    <form className={styles.container} onSubmit={submitForm}>
      <h2>Connexion</h2>

      <label htmlFor="email" className={styles.label}>Email :</label>
      <input
        type="email"
        id="email"
        name="email"
        className={styles.input}
        maxLength={100}
        autoFocus
        required
        value={form.email}
        onChange={handleChange}
      />

      <label htmlFor="password" className={styles.label}>Mot de passe :</label>
      <input
        type="password"
        id="password"
        name="password"
        className={styles.input}
        maxLength={100}
        required
        value={form.password}
        onChange={handleChange}
      />

      {erreur && <p className={styles.erreur}>{erreur}</p>}

      <button type="submit" className={styles.btn}>
        Se connecter
      </button>

      <p className={styles.lien}>
        Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
      </p>
    </form>
  );
}

export default Connexion;