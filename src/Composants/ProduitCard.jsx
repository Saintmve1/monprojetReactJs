import styles from "./ProduitCard.module.css";
import { useCart } from "../Context/CartContext"; // ← mets bien "context" en minuscule

function ProduitCard({
  nom,
  prix,
  quantite,
  admin = false,
  onModifier,
  onSupprimer,
  produit,
}) {
  const { ajouterAuPanier } = useCart();

  return (
    <div className={styles.carte}>
      <h3>{nom}</h3>
      <p className={styles.prix}>{prix} €</p>
      <p className={styles.quantite}>Quantité : {quantite}</p>

      {admin ? (
        <div className={styles.boutonsAdmin}>
          <button type="button" className={styles.btn} onClick={onModifier}>
            Modifier
          </button>
          <button type="button" className={styles.btn} onClick={onSupprimer}>
            Supprimer
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.btn}
          style={{ width: "100%", marginTop: "0.5rem" }}
          onClick={() => ajouterAuPanier(produit)}
        >
          Ajouter au panier
        </button>
      )}
    </div>
  );
}

export default ProduitCard;