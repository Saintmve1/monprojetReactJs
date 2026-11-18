import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./Inscription.module.css";
// Les méthodes de validation sont dans src/Outils/validator.js
import { validerInscription, nettoyerNom } from "../Outils/validator";

function Inscription() {
  const navigate = useNavigate();

  // Les clés correspondent à celles attendues par validerInscription()
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmation: "",
    cgu: false,
  });

  // Erreurs par champ : { nom: "...", email: "..." } ; {} = aucune erreur
  const [erreurs, setErreurs] = useState({});
  // Erreur renvoyée par le serveur (email déjà utilisé, serveur éteint...)
  const [erreurServeur, setErreurServeur] = useState("");

  // useRef : une "référence" par champ. Chaque référence recevra l'élément HTML
  // réel du champ (dans ref.current) une fois le formulaire affiché.
  const nomRef = useRef(null);
  const prenomRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmationRef = useRef(null);
  const cguRef = useRef(null);

  // Associe le nom d'un champ à sa référence (les clés = celles de erreurs)
  const refs = {
    nom: nomRef,
    prenom: prenomRef,
    email: emailRef,
    password: passwordRef,
    confirmation: confirmationRef,
    cgu: cguRef,
  };

  // Un seul gestionnaire pour tous les champs (grâce à l'attribut name)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let nouvelleValeur = type === "checkbox" ? checked : value;

    // Nom et prénom : on retire chiffres et caractères spéciaux dès la frappe
    if (name === "nom" || name === "prenom") {
      nouvelleValeur = nettoyerNom(value);
    }

    setFormData((prev) => ({ ...prev, [name]: nouvelleValeur }));
  };

  const submitForm = async (e) => {
    e.preventDefault(); // empêche le rechargement de la page

    // Validation complète via validator.js
    const erreursTrouvees = validerInscription(formData);
    setErreurs(erreursTrouvees);
    setErreurServeur("");

    // Premier champ en erreur (les clés suivent l'ordre du formulaire)
    const premierChamp = Object.keys(erreursTrouvees)[0];
    if (premierChamp) {
      // .current = l'élément <input> réel ; .focus() y place le curseur
      refs[premierChamp].current.focus();
      return; // au moins une erreur : on n'envoie rien
    }

    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom.trim(),
          prenom: formData.prenom.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErreurServeur(data.message); // ex : "Cet email est déjà utilisé."
        // Si l'email est déjà pris, on remet le curseur dessus
        if (res.status === 409) {
          emailRef.current.focus();
        }
        return;
      }

      navigate("/connexion"); // inscription réussie : on va à la connexion
    } catch {
      setErreurServeur("Serveur injoignable. Vérifie que le backend est lancé.");
    }
  };

  return (
    <form className={styles.container} onSubmit={submitForm} noValidate>
      <h2 className={styles.title}>Inscription</h2>

      <label htmlFor="nom" className={styles.label}>Nom :</label>
      <input
        type="text"
        id="nom"
        name="nom"
        ref={nomRef}
        className={styles.input}
        maxLength={50}
        autoFocus
        value={formData.nom}
        onChange={handleChange}
      />
      {erreurs.nom && <p className={styles.erreur}>{erreurs.nom}</p>}

      <label htmlFor="prenom" className={styles.label}>Prénom :</label>
      <input
        type="text"
        id="prenom"
        name="prenom"
        ref={prenomRef}
        className={styles.input}
        maxLength={50}
        value={formData.prenom}
        onChange={handleChange}
      />
      {erreurs.prenom && <p className={styles.erreur}>{erreurs.prenom}</p>}

      <label htmlFor="email" className={styles.label}>Email :</label>
      <input
        type="email"
        id="email"
        name="email"
        ref={emailRef}
        className={styles.input}
        maxLength={254}
        placeholder="nom@exemple.fr"
        value={formData.email}
        onChange={handleChange}
      />
      {erreurs.email && <p className={styles.erreur}>{erreurs.email}</p>}

      <label htmlFor="password" className={styles.label}>Mot de passe :</label>
      <input
        type="password"
        id="password"
        name="password"
        ref={passwordRef}
        className={styles.input}
        maxLength={128}
        value={formData.password}
        onChange={handleChange}
      />
      {erreurs.password && <p className={styles.erreur}>{erreurs.password}</p>}

      <label htmlFor="confirmation" className={styles.label}>
        Confirmer le mot de passe :
      </label>
      <input
        type="password"
        id="confirmation"
        name="confirmation"
        ref={confirmationRef}
        className={styles.input}
        maxLength={128}
        value={formData.confirmation}
        onChange={handleChange}
      />
      {erreurs.confirmation && (
        <p className={styles.erreur}>{erreurs.confirmation}</p>
      )}

      <label htmlFor="cgu" className={styles.checkbox}>
        <input
          type="checkbox"
          id="cgu"
          name="cgu"
          ref={cguRef}
          checked={formData.cgu}
          onChange={handleChange}
        />
        J'accepte les conditions d'utilisation
      </label>
      {erreurs.cgu && <p className={styles.erreur}>{erreurs.cgu}</p>}

      {erreurServeur && <p className={styles.erreur}>{erreurServeur}</p>}

      <button type="submit" className={styles.btn}>
        Envoyer
      </button>

      <p className={styles.lien}>
        Déjà un compte ? <Link to="/connexion">Se connecter</Link>
      </p>
    </form>
  );
}

export default Inscription;