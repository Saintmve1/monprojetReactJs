import styles from "./sidebargauche.module.css";

const CATEGORIES = [
  { valeur: "claviers", label: "Claviers" },
  { valeur: "souris", label: "Souris" },
  { valeur: "ecrans", label: "Écrans" },
];

function SidebarGauche({ categories = [], onCategoriesChange = () => {} }) {
  // Coche ou décoche une catégorie
  const toggleCategorie = (valeur) => {
    if (categories.includes(valeur)) {
      onCategoriesChange(categories.filter((c) => c !== valeur));
    } else {
      onCategoriesChange([...categories, valeur]);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.titre}>Filtres</h3>

      <div className={styles.groupe}>
        <h4>Catégorie</h4>
        {CATEGORIES.map((c) => (
          <label key={c.valeur} className={styles.option}>
            <input
              type="checkbox"
              name="categorie"
              value={c.valeur}
              checked={categories.includes(c.valeur)}
              onChange={() => toggleCategorie(c.valeur)}
            />
            {c.label}
          </label>
        ))}
      </div>

      <div className={styles.groupe}>
        <h4>Prix</h4>
        <label className={styles.option}>
          <input type="radio" name="prix" value="tous" defaultChecked />
          Tous les prix
        </label>
        <label className={styles.option}>
          <input type="radio" name="prix" value="0-25" />
          Moins de 25 €
        </label>
        <label className={styles.option}>
          <input type="radio" name="prix" value="25-50" />
          25 € à 50 €
        </label>
        <label className={styles.option}>
          <input type="radio" name="prix" value="50+" />
          Plus de 50 €
        </label>
      </div>

      <button
        type="button"
        className={styles.btn}
        onClick={() => onCategoriesChange([])}
      >
        Réinitialiser
      </button>
    </aside>
  );
}

export default SidebarGauche;