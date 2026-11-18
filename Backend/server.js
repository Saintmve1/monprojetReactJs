import express from "express";
import "./db.js"; // crée les tables et les produits de départ
import authRoutes from "./routes/auth.routes.js";
import produitsRoutes from "./routes/produits.routes.js";

const PORT = 3000;
const app = express();

app.use(express.json());

app.use("/api", authRoutes);               // /api/inscription et /api/connexion
app.use("/api/produits", produitsRoutes);  // /api/produits

// Garde une référence au serveur : sans elle, une erreur de démarrage
// (port occupé...) passe inaperçue et le programme se termine.
const serveur = app.listen(PORT, () => {
  console.log(`Backend sur http://localhost:${PORT}`);
});

// Affiche l'erreur réelle si le serveur ne peut pas démarrer
serveur.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Le port ${PORT} est déjà utilisé. Ferme l'autre serveur ou change de port.`);
  } else {
    console.error("Erreur du serveur :", err.message);
  }
  process.exit(1);
});