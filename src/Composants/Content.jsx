import { useState, useEffect, useRef, useMemo } from "react";
import { useOutletContext } from "react-router";
import styles from "./Content.module.css";
import ProduitCard from "./ProduitCard";
import BarreRecherche from "./BarreRecherche";
import ModifierProduit from "./ModifierProduits";
import { normaliser } from "../utils/texte";
import { useDebounce } from "../hooks/UseDebounce";
import { PRIX_MIN, PRIX_MAX, QUANTITE_MIN, QUANTITE_MAX } from "../utils/limites";

// Mot recherché dans le nom du produit pour chaque catégorie
const MOTS_CATEGORIES = {
  claviers: "clavier",
  souris: "souris",
  ecrans: "ecran",
};

// admin = true : formulaire d'ajout + boutons Modifier / Supprimer (dashboard)
function Content({ admin = false }) {
  // Catégories cochées, fournies par Layout via <Outlet context>
  // En admin, on ignore le filtre
  const ctx = useOutletContext() ?? {};
  const categories = admin ? [] : ctx.categories ?? [];

  const [produits, setProduits] = useState([]);
  const [nom, setNom] = useState("");
  const [erreur, setErreur] = useState("");
  const [erreurListe, setErreurListe] = useState("");
  // null = rien, "ajout" = formulaire d'ajout, objet produit = modification
  const [enEdition, setEnEdition] = useState(null);

  const [saisie, setSaisie] = useState("");
  const terme = useDebounce(saisie, 300);

  const nomRef = useRef(null);
  const prixRef = useRef(null);
  const quantiteRef = useRef(null);
  const rechercheRef = useRef(null);

  // Chargement des produits au premier affichage
  useEffect(() => {
    async function charger() {
      try {
        const res = await fetch("/api/produits");
        const data = await res.json();
        setProduits(data);
      } catch {
        setErreurListe("Impossible de charger les produits.");
      }
    }
    charger();
  }, []);

  // Raccourci clavier : "/" donne le focus à la recherche
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        rechercheRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Filtrage par recherche ET par catégories
  const cleCategories = categories.join(",");
  const produitsFiltres = useMemo(() => {
    const t = normaliser(terme);
    const cats = cleCategories ? cleCategories.split(",") : [];

    return produits.filter((p) => {
      const nomNormalise = normaliser(p.nom);
      const okRecherche = nomNormalise.includes(t);
      const okCategorie =
        cats.length === 0 ||
        cats.some((c) => nomNormalise.includes(normaliser(MOTS_CATEGORIES[c])));
      return okRecherche && okCategorie;
    });
  }, [produits, terme, cleCategories]);

  const effacerRecherche = () => {
    setSaisie("");
    rechercheRef.current?.focus();
  };

  // ---------- AJOUTER ----------
  const ajouterProduit = async (e) => {
    e.preventDefault();

    if (nom.trim() === "") {
      setErreur("Le titre du produit est obligatoire.");
      nomRef.current.focus();
      return;
    }

    const prixSaisi = prixRef.current.value;
    const prix = Number(prixSaisi);

    if (prixSaisi === "" || !Number.isFinite(prix)) {
      setErreur("Le prix doit être un chiffre ou un nombre.");
      prixRef.current.focus();
      return;
    }
    if (prix < PRIX_MIN || prix > PRIX_MAX) {
      setErreur(`Le prix doit être compris entre ${PRIX_MIN} et ${PRIX_MAX}.`);
      prixRef.current.focus();
      return;
    }

    const quantiteSaisie = quantiteRef.current.value;
    const quantite = Number(quantiteSaisie);

    if (quantiteSaisie === "" || !Number.isInteger(quantite)) {
      setErreur("La quantité doit être un nombre entier.");
      quantiteRef.current.focus();
      return;
    }
    if (quantite < QUANTITE_MIN || quantite > QUANTITE_MAX) {
      setErreur(`La quantité doit être comprise entre ${QUANTITE_MIN} et ${QUANTITE_MAX}.`);
      quantiteRef.current.focus();
      return;
    }

    try {
      const res = await fetch("/api/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: nom.trim(), prix, quantite }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErreur(data.message);
        return;
      }

      setProduits((prev) => [...prev, data]);
      setNom("");
      prixRef.current.value = "";
      quantiteRef.current.value = "";
      setErreur("");
      nomRef.current.focus();
    } catch {
      setErreur("Serveur injoignable. Vérifie que le backend est lancé.");
    }
  };

  // ---------- MODIFIER ----------
  const produitModifie = (maj) => {
    setProduits((prev) => prev.map((p) => (p.id === maj.id ? maj : p)));
    setEnEdition(null);
  };

  // ---------- SUPPRIMER ----------
  const supprimerProduit = async (produit) => {
    if (!window.confirm(`Supprimer « ${produit.nom} » ?`)) return;

    try {
      const res = await fetch(`/api/produits/${produit.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setErreurListe(data.message);
        return;
      }

      setProduits((prev) => prev.filter((p) => p.id !== produit.id));
      setEnEdition((courant) => (courant && courant.id === produit.id ? null : courant));
      setErreurListe("");
    } catch {
      setErreurListe("Serveur injoignable. Vérifie que le backend est lancé.");
    }
  };

  const enModification = admin && enEdition && enEdition !== "ajout";

  return (
    <div className={styles.content}>
      <h2 className={styles.titre}>
        {admin ? "Gestion des produits" : "Produits"}
      </h2>

      {enModification ? (
        <ModifierProduit
          key={enEdition.id}
          produit={enEdition}
          onEnregistrer={produitModifie}
          onAnnuler={() => setEnEdition(null)}
        />
      ) : (
        <>
          {admin && enEdition !== "ajout" && (
            <button
              type="button"
              className={styles.btn}
              style={{ marginBottom: "1.5rem" }}
              onClick={() => setEnEdition("ajout")}
            >
              + Ajouter un produit
            </button>
          )}

          {admin && enEdition === "ajout" && (
            <form className={styles.formulaire} onSubmit={ajouterProduit} noValidate>
              <h3>Ajouter un produit</h3>

              <label htmlFor="nom" className={styles.label}>Titre :</label>
              <input
                type="text"
                id="nom"
                name="nom"
                ref={nomRef}
                className={styles.input}
                maxLength={100}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />

              <label htmlFor="prix" className={styles.label}>Prix (€)</label>
              <input
                type="number"
                id="prix"
                name="prix"
                ref={prixRef}
                className={styles.input}
                min={PRIX_MIN}
                max={PRIX_MAX}
                step="0.01"
              />

              <label htmlFor="quantite" className={styles.label}>Quantité</label>
              <input
                type="number"
                id="quantite"
                name="quantite"
                ref={quantiteRef}
                className={styles.input}
                min={QUANTITE_MIN}
                max={QUANTITE_MAX}
                step="1"
              />

              {erreur && <p className={styles.erreur}>{erreur}</p>}

              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" className={styles.btn}>Ajouter</button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => setEnEdition(null)}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {enEdition !== "ajout" && (
            <>
              <BarreRecherche
                valeur={saisie}
                onChange={setSaisie}
                onEffacer={effacerRecherche}
                inputRef={rechercheRef}
              />

              <p>
                {produitsFiltres.length} résultat(s)
                {saisie !== terme && <small> – recherche en cours…</small>}
              </p>

              {erreurListe && <p className={styles.erreur}>{erreurListe}</p>}

              {produits.length === 0 ? (
                <p className={styles.vide}>Aucun produit pour le moment.</p>
              ) : produitsFiltres.length === 0 ? (
                <p className={styles.vide}>
                  {terme
                    ? `Aucun produit ne correspond à « ${terme} ».`
                    : "Aucun produit dans ces catégories."}
                </p>
              ) : (
                <div className={styles.grille}>
                  {produitsFiltres.map((p) => (
                    <ProduitCard
                      key={p.id}
                      nom={p.nom}
                      prix={p.prix}
                      quantite={p.quantite}
                      admin={admin}
                      produit={p}
                      onModifier={() => setEnEdition(p)}
                      onSupprimer={() => supprimerProduit(p)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Content;