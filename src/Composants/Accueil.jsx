import styles from "./Accueil.module.css";

function Accueil() {
  return (
    <div className={styles.container}>
      <h1 className={styles.titre}>Accueil</h1>
      <p className={styles.texte}>Bienvenue sur notre site !</p>
    </div>
  );
}

export default Accueil;