import './App.css'
import { Routes, Route } from "react-router";
import Layout from './Composants/layout'
import Accueil from './Composants/Accueil'
import Content from './Composants/Content'
import Connexion from './Composants/Connexion'
import Inscription2 from './Composants/Inscription2'
import Panier from './Composants/Panier'
import ProtectedRoute from './Composants/ProtectedRoute'
import AdminRoute from './Composants/AdminRoute'
import Dashboard from './Composants/Dashboard'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Routes publiques */}
        <Route path="/" element={<Accueil />} />
        <Route path="/contact" element={<h2>Contact</h2>} />
        <Route path="/inscription" element={<Inscription2 />} />
        <Route path="/connexion" element={<Connexion />} />

        {/* Routes protégées : le gardien est la route parente */}
        <Route element={<ProtectedRoute />}>
          <Route path="/produits" element={<Content titre="Nos produits" />} />
          <Route path="/panier" element={<Panier />} />
        </Route>
        {/* Routes réservées à l'admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>

        
      </Route>
    </Routes>
  )
}

export default App