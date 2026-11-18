// Met en minuscules et retire les accents : "Écran" devient "ecran"
export function normaliser(texte) {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}