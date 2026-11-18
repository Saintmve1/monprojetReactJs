import { Router } from "express";
import { listerProduits, ajouterProduit } from "../controllers/produits.controller.js";

import {
  modifierProduit,
  supprimerProduit,
} from "../controllers/produits.controller.js";

const router = Router();

router.get("/", listerProduits);
router.post("/", ajouterProduit);
router.put("/:id", modifierProduit);
router.delete("/:id", supprimerProduit);

export default router;