import Content from "./Content";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div>
      <h1 className={styles.titre}>Tableau de bord administrateur</h1>
      <Content admin />
    </div>
  );
}