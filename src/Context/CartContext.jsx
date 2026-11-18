import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

// Lit le panier d'une clé donnée (tableau vide si rien ou si la donnée est abîmée)
function lirePanier(cle) {
  try {
    const saved = localStorage.getItem(cle);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Le vrai panier : il travaille avec UNE clé de stockage (celle de l'utilisateur)
function CartContenu({ cle, children }) {
  const [panier, setPanier] = useState(() => lirePanier(cle));

  // Sauvegarder automatiquement, dans la clé de cet utilisateur
  useEffect(() => {
    localStorage.setItem(cle, JSON.stringify(panier));
  }, [panier, cle]);

  // Ajouter un produit
  const ajouterAuPanier = (produit) => {
    setPanier((prev) => {
      const existe = prev.find((item) => item.id === produit.id);
      if (existe) {
        // Si déjà présent → +1
        return prev.map((item) =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      }
      // Sinon on l'ajoute avec quantité 1
      return [...prev, { ...produit, quantite: 1 }];
    });
  };

  // Augmenter la quantité
  const augmenter = (id) => {
    setPanier((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantite: item.quantite + 1 } : item
      )
    );
  };

  // Diminuer la quantité
  const diminuer = (id) => {
    setPanier((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantite: item.quantite - 1 } : item
        )
        .filter((item) => item.quantite > 0) // supprime si quantité = 0
    );
  };

  // Supprimer un produit (avec confirmation)
  const supprimer = (id, nom) => {
    if (window.confirm(`Supprimer « ${nom} » du panier ?`)) {
      setPanier((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Vider tout le panier
  const viderPanier = () => {
    if (window.confirm("Vider complètement le panier ?")) {
      setPanier([]);
    }
  };

  // Calcul du total
  const total = panier.reduce(
    (sum, item) => sum + item.prix * item.quantite,
    0
  );

  const nombreArticles = panier.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <CartContext.Provider
      value={{
        panier,
        ajouterAuPanier,
        augmenter,
        diminuer,
        supprimer,
        viderPanier,
        total,
        nombreArticles,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Le Provider : choisit la clé selon l'utilisateur connecté
export function CartProvider({ children }) {
  const { utilisateur } = useAuth();

  // Un panier par compte : "panier:alice@exemple.fr", ou "panier:invite" si personne n'est connecté
  const cle = `panier:${utilisateur?.email ?? "invite"}`;

  // key={cle} : quand l'utilisateur change, React recrée CartContenu,
  // qui relit le panier de la nouvelle clé (et jamais celui de l'ancien compte)
  return (
    <CartContenu key={cle} cle={cle}>
      {children}
    </CartContenu>
  );
}

// Hook pratique
export function useCart() {
  return useContext(CartContext);
}