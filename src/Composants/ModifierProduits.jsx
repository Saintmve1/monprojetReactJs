import { useState, useRef, useEffect } from "react";
import styles from "./Content.module.css";
import { PRIX_MIN, PRIX_MAX, QUANTITE_MIN, QUANTITE_MAX } from "../utils/limites";

export default function ModifierProduit({ produit, onEnregistrer, onAnnuler }) {
  // Les champs démarrent avec les valeurs actuelles du produit
  const [nom, setNom] = useState(produit.nom);
  const [prix, setPrix] = useState(String(produit.prix));
  const [quantite, setQuantite] = useState(String(produit.quantite));
  const [erreur, setErreur] = useState("");

  const nomRef = useRef(null);

  // Au premier affichage du formulaire : le curseur va dans le champ titre
  useEffect(() => {
    nomRef.current?.focus();
  }, []);

  const enregistrer = async (e) => {
    e.preventDefault();

    const prixNb = Number(prix);
    const quantiteNb = Number(quantite);

    if (nom.trim() === "") {
      setErreur("Le titre du produit est obligatoire.");
      return;
    }
    if (prix === "" || !Number.isFinite(prixNb) || prixNb < PRIX_MIN || prixNb > PRIX_MAX) {
      setErreur(`Le prix doit être compris entre ${PRIX_MIN} et ${PRIX_MAX}.`);
      return;
    }
    if (quantite === "" || !Number.isInteger(quantiteNb) || quantiteNb < QUANTITE_MIN || quantiteNb > QUANTITE_MAX) {
      setErreur(`La quantité doit être un entier compris entre ${QUANTITE_MIN} et ${QUANTITE_MAX}.`);
      return;
    }

    try {
      const res = await fetch(`/api/produits/${produit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: nom.trim(), prix: prixNb, quantite: quantiteNb }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErreur(data.message);
        return;
      }

      onEnregistrer(data); // le parent met la liste à jour
    } catch {
      setErreur("Serveur injoignable. Vérifie que le backend est lancé.");
    }
  };

  return (
    <form className={styles.formulaire} onSubmit={enregistrer} noValidate>
      <h3>Modifier le produit n°{produit.id}</h3>

      <label htmlFor="edit-nom" className={styles.label}>Titre :</label>
      <input
        type="text"
        id="edit-nom"
        ref={nomRef}
        className={styles.input}
        maxLength={100}
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />

      <label htmlFor="edit-prix" className={styles.label}>Prix (€)</label>
      <input
        type="number"
        id="edit-prix"
        className={styles.input}
        min={PRIX_MIN}
        max={PRIX_MAX}
        step="0.01"
        value={prix}
        onChange={(e) => setPrix(e.target.value)}
      />

      <label htmlFor="edit-quantite" className={styles.label}>Quantité</label>
      <input
        type="number"
        id="edit-quantite"
        className={styles.input}
        min={QUANTITE_MIN}
        max={QUANTITE_MAX}
        step="1"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
      />

      {erreur && <p className={styles.erreur}>{erreur}</p>}

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" className={styles.btn}>Enregistrer</button>
        <button type="button" className={styles.btn} onClick={onAnnuler}>Annuler</button>
      </div>
    </form>
  );
}