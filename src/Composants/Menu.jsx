import styles from "./Menu.module.css";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";

function Menu() {
  const { utilisateur, estConnecte, estAdmin, deconnecter } = useAuth();
  const navigate = useNavigate();

  // "Prénom Nom" si on les a, sinon l'email
  const nomAffiche =
    [utilisateur?.prenom, utilisateur?.nom].filter(Boolean).join(" ") ||
    utilisateur?.email;

  const handleDeconnexion = () => {
    deconnecter();
    navigate("/connexion", { replace: true });
  };

  // Style pour les liens actifs
  const style = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: isActive ? "underline" : "none",
  });

  return (
    <nav className={styles.menu}>
      <NavLink to="/" end style={style}>
        Accueil
      </NavLink>
      <NavLink to="/produits" style={style}>
        Produits
      </NavLink>
      <NavLink to="/panier" style={style}>
        Panier
      </NavLink>

      {/* Lien réservé à l'admin */}
      {estAdmin && (
        <NavLink to="/admin" style={style}>
          Dashboard
        </NavLink>
      )}

      {/* Inscription et Connexion seulement si l'utilisateur n'est PAS connecté */}
      {!estConnecte && (
        <>
          <NavLink to="/inscription" style={style}>
            Inscription
          </NavLink>
          <NavLink to="/connexion" style={style}>
            Connexion
          </NavLink>
        </>
      )}

      {/* Nom de l'utilisateur et déconnexion seulement s'il EST connecté */}
      {estConnecte && (
        <>
          <span className={styles.nomUtilisateur}>Bonjour {nomAffiche}</span>
          <button onClick={handleDeconnexion} className={styles.btnDeconnexion}>
            Se déconnecter
          </button>
        </>
      )}
    </nav>
  );
}

export default Menu;