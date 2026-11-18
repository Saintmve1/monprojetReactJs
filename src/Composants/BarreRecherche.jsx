import styles from "./Content.module.css";

export default function BarreRecherche({ valeur, onChange, onEffacer, inputRef }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        ref={inputRef}
        type="search"
        className={styles.recherche}
        placeholder='Rechercher un produit... (touche "/")'
        aria-label="Rechercher un produit"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className={styles.btn}
        onClick={onEffacer}
        disabled={!valeur}
      >
        Effacer
      </button>
    </div>
  );
}