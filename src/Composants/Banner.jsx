import styles from "./Banner.module.css";
import Menu from "./Menu";
import { Routes, Route, Link} from "react-router";

function Banner() 
 {
  return (
   <header className={styles.banner}>
       <h1> Ma boutique</h1>
     <Menu />
     </header>

    
  );
  }
  export default Banner;