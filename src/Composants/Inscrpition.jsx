//import { useState } from "react";
//import styles from "./Inscription.module.css";

//const LONGUEUR_MIN_NOM = 5;

//unction verifierNom(valeur) {
  //if (valeur.trim().length < LONGUEUR_MIN_NOM) {
    //return `Le nom doit contenir au moins ${LONGUEUR_MIN_NOM} caractères.`;
  //}
  //return "";
//}

//function verifierEmail(valeur) {
  //if (!valeur.includes("@")) {
    //return "L'email doit contenir un symbole @.";
  //}
  //return "";
//}

//function verifierMotDePasse(valeur) {
  //if (valeur.length < 12) {
    //return "Le mot de passe doit contenir au moins 12 caractères.";
  //}
  //return "";
  //}

//function Inscription() {
  //const [name, setName] = useState("");
  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  //const erreurNom = verifierNom(name);
  //const erreurEmail = verifierEmail(email);
  

  //const submitForm = (e) => {
    //e.preventDefault();//empecher le rechargement de la page lors de l'envoi du formulaire
    //if (erreurNom) {
      //alert(erreurNom);
      //return;
    //}
    //if (erreurEmail) {
      //alert(erreurEmail);
      //return;
    //}

    //if (verifierMotDePasse(password)) {
      //alert(verifierMotDePasse(password));
      //return;
    //}

    // on vide le formulaire après l'envoi
    //setName("");
    //setEmail("");
    //setPassword("");
  //};

  //return (
    //<form className={styles.container} onSubmit={submitForm}>
      //<h2>Inscription</h2>

      //<label htmlFor="name" className={styles.label}>Nom :</label>
      //<input
        //type="text"
        //id="name"
        //className={styles.input}
        //maxLength={30}
        //autoFocus
        //required
        //value={name}
        ///onChange={(e) => setName(e.target.value)}
      //>
      //<p className="aperçu">Saisie : {name}</p>
      //{erreurNom && <p className="erreur">{erreurNom}</p>}

      //<label htmlFor="email" className={styles.label}>Email :</label>
      //<input
        //type="email"
        //id="email"
        //className={styles.input}
        //maxLength={100}
        //required
        //value={email}
        //onChange={(e) => setEmail(e.target.value)}
      //>
      //{erreurEmail && <p className="erreur">{erreurEmail}</p>}

      

      //<label htmlFor="password" className={styles.label}>Mot de passe :</label>
      //<input
        //type="password"
        //id="password"
        //className={styles.input}
       // maxLength={100}
       // required
        //value={password}
        //onChange={(e) => setPassword(e.target.value)}
      //>
      //{verifierMotDePasse(password) && (
        //<p className="erreur">{verifierMotDePasse(password)}</p>
      //)}

      //<button type="submit" className={styles.btn}>
       // Envoyer
      //</button>
    //</form>
  //);
//}

//export default Inscription;