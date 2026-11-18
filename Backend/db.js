import Database from "better-sqlite3";

export const db = new Database("boutique.db"); // créé automatiquement

//db.pragma("journal_mode = WAL");   // meilleures performances en lecture

db.pragma("foreign_keys = ON");    // active les clés étrangères

//initialisation de la BD
db.exec(`
  CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mot_de_passe TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client',
    cree_le TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prix REAL NOT NULL,
    quantite INTEGER NOT NULL DEFAULT 1
  );
`);

// Mise à jour d'une base déjà existante : CREATE TABLE IF NOT EXISTS ne modifie
// pas une table créée avant, donc on ajoute la colonne "quantite" si elle manque.
const colonnes = db.prepare("PRAGMA table_info(produits)").all();
if (!colonnes.some((c) => c.name === "quantite")) {
  db.exec("ALTER TABLE produits ADD COLUMN quantite INTEGER NOT NULL DEFAULT 1");
}

// Même principe : on ajoute la colonne "role" si la table existait déjà sans elle
const colonnesUtilisateurs = db.prepare("PRAGMA table_info(utilisateurs)").all();
if (!colonnesUtilisateurs.some((c) => c.name === "role")) {
  db.exec("ALTER TABLE utilisateurs ADD COLUMN role TEXT NOT NULL DEFAULT 'client'");
}

// Données de départ si la table est vide
const { total } = db.prepare("SELECT COUNT(*) AS total FROM produits").get();
if (total === 0) {
  const ajouter = db.prepare("INSERT INTO produits (nom, prix, quantite) VALUES (?, ?, ?)");
  ajouter.run("Clavier", 49, 10);
  ajouter.run("Souris", 25, 10);
}