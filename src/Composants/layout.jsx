import { useState } from "react";
import { Outlet } from "react-router";
import Banner from "./Banner";
import Footer from "./Footer";
import SidebarGauche from "./sidebargauche";
import SidebarDroit from "./sidebardroit";
import styles from "./layout.module.css";

export default function Layout() {
  const [categories, setCategories] = useState([]);

  return (
    <div className={styles.layout}>
      <Banner />
      <SidebarGauche
        categories={categories}
        onCategoriesChange={setCategories}
      />

      <main className={styles.content}>
        <Outlet context={{ categories }} />
      </main>

      <SidebarDroit />
      <Footer />
    </div>
  );
}