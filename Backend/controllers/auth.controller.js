import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { db } from "../db.js";

function hacher(motDePasse) {
  const sel = randomBytes(16).toString("hex");
  const hash = scryptSync(motDePasse, sel, 64).toString("hex");
  return `${sel}:${hash}`;
}

function verifier(motDePasse, stocke) {
  if (!motDePasse || !stocke || typeof stocke !== "string" || !stocke.includes(":")) {
    return false;
  }

  const [sel, hash] = stocke.split(":");
  if (!sel || !hash) return false;

  try {
    const test = scryptSync(motDePasse, sel, 64);
    const hashBuffer = Buffer.from(hash, "hex");

    // timingSafeEqual exige la même longueur
    if (test.length !== hashBuffer.length) return false;

    return timingSafeEqual(test, hashBuffer);
  } catch {
    return false;
  }
}

export function inscription(req, res) {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires." });
  }

  try {
    db.prepare(
      "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe) VALUES (?, ?, ?, ?)"
    ).run(nom, prenom, email, hacher(password));

    res.status(201).json({ message: "Inscription réussie." });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }
    res.status(500).json({ message: "Erreur serveur." });
  }
}

export function connexion(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe obligatoires." });
  }

  const utilisateur = db
    .prepare("SELECT * FROM utilisateurs WHERE email = ?")
    .get(email);

  if (!utilisateur || !verifier(password, utilisateur.mot_de_passe)) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect." });
  }

  res.json({
  message: "Connexion réussie.",
  nom: utilisateur.nom,
  role: utilisateur.role,
});
}