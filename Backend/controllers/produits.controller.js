import { db } from "../db.js";

// Mêmes limites que côté React
const PRIX_MIN = 1;
const PRIX_MAX = 10000;
const QUANTITE_MIN = 1;
const QUANTITE_MAX = 1000;

// Renvoie un message d'erreur, ou null si tout est valide
function valider(nom, prix, quantite) {
  if (typeof nom !== "string" || nom.trim() === "") {
    return "Le titre du produit est obligatoire.";
  }
  if (nom.trim().length > 100) {
    return "Le titre est trop long (100 caractères maximum).";
  }
  if (!Number.isFinite(prix) || prix < PRIX_MIN || prix > PRIX_MAX) {
    return `Le prix doit être compris entre ${PRIX_MIN} et ${PRIX_MAX}.`;
  }
  if (!Number.isInteger(quantite) || quantite < QUANTITE_MIN || quantite > QUANTITE_MAX) {
    return `La quantité doit être un entier compris entre ${QUANTITE_MIN} et ${QUANTITE_MAX}.`;
  }
  return null;
}

// Lire tous les produits
export function listerProduits(req, res) {
  const produits = db.prepare("SELECT * FROM produits ORDER BY id").all();
  res.json(produits);
}

// Ajouter un produit
export function ajouterProduit(req, res) {
  const nom = req.body.nom;
  const prix = Number(req.body.prix);
  const quantite = Number(req.body.quantite);

  const erreur = valider(nom, prix, quantite);
  if (erreur) return res.status(400).json({ message: erreur });

  const resultat = db
    .prepare("INSERT INTO produits (nom, prix, quantite) VALUES (?, ?, ?)")
    .run(nom.trim(), prix, quantite);

  res.status(201).json({
    id: Number(resultat.lastInsertRowid),
    nom: nom.trim(),
    prix,
    quantite,
  });
}

// Modifier un produit
export function modifierProduit(req, res) {
  const id = Number(req.params.id);
  const nom = req.body.nom;
  const prix = Number(req.body.prix);
  const quantite = Number(req.body.quantite);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Identifiant invalide." });
  }

  const erreur = valider(nom, prix, quantite);
  if (erreur) return res.status(400).json({ message: erreur });

  const resultat = db
    .prepare("UPDATE produits SET nom = ?, prix = ?, quantite = ? WHERE id = ?")
    .run(nom.trim(), prix, quantite, id);

  if (resultat.changes === 0) {
    return res.status(404).json({ message: "Produit introuvable." });
  }

  res.json({ id, nom: nom.trim(), prix, quantite });
}

// Supprimer un produit
export function supprimerProduit(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Identifiant invalide." });
  }

  const resultat = db.prepare("DELETE FROM produits WHERE id = ?").run(id);

  if (resultat.changes === 0) {
    return res.status(404).json({ message: "Produit introuvable." });
  }

  res.json({ message: "Produit supprimé." });
}

