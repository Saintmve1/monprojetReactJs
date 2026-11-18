import { useCart } from "../Context/CartContext";
import styles from "./Panier.module.css";

export default function Panier() {
  const { panier, augmenter, diminuer, supprimer, viderPanier, total } = useCart();

  if (panier.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.vide}>
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits pour commencer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titre}>Votre panier</h2>

      <ul className={styles.liste}>
        {panier.map((item) => (
          <li key={item.id} className={styles.article}>
            {/* Infos produit */}
            <div className={styles.infos}>
              <h3 className={styles.nom}>{item.nom}</h3>
              <p className={styles.prix}>{item.prix.toFixed(2)} €</p>
            </div>

            {/* Quantité */}
            <div className={styles.quantite}>
              <button
                type="button"
                className={styles.btnQuantite}
                onClick={() => diminuer(item.id)}
              >
                −
              </button>
              <span className={styles.valeurQuantite}>{item.quantite}</span>
              <button
                type="button"
                className={styles.btnQuantite}
                onClick={() => augmenter(item.id)}
              >
                +
              </button>
            </div>

            {/* Sous-total */}
            <p className={styles.prix}>
              {(item.prix * item.quantite).toFixed(2)} €
            </p>

            {/* Bouton supprimer */}
            <button
              type="button"
              className={styles.supprimer}
              onClick={() => supprimer(item.id, item.nom)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      {/* Résumé + Total */}
      <div className={styles.resume}>
        <p className={styles.total}>
          Total : {total.toFixed(2)} €
        </p>

        <button
          type="button"
          className={styles.btn}
          onClick={viderPanier}
        >
          Vider le panier
        </button>
      </div>
    </div>
  );
}