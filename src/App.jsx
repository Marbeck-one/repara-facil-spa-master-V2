// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Componentes de Layout
import AppNavbar from "./components/AppNavbar.jsx";
import Footer from "./components/Footer.jsx";

// Páginas
import Home from "./pages/Home.jsx";
import Servicios from "./pages/Servicios.jsx";
import Agenda from "./pages/Agenda.jsx";
import Garantias from "./pages/Garantias.jsx";
import Tecnicos from "./pages/Tecnicos.jsx";
import Contact from "./pages/Contact.jsx";
import Clientes from "./pages/Clientes.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Contextos
import { AppProvider } from "./context/AppContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // <--- IMPORTANTE
import { CartProvider } from "./context/CartContext.jsx";

// Rutas Protegidas
import PrivateRoute from "./routes/PrivateRoute.jsx";

export default function App() {
  return (
    // 1. AuthProvider debe envolver a TODO para que AppNavbar tenga acceso
    <AuthProvider>
      <AppProvider>
        <CartProvider>
          <BrowserRouter>
            {/* Navbar tiene acceso a useAuth() porque está dentro de AuthProvider */}
            <AppNavbar />

            <main className="main-content" style={{ minHeight: "80vh" }}>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/contacto" element={<Contact />} />
                
                {/* Rutas que podrían ser públicas o privadas según tu lógica */}
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/tecnicos" element={<Tecnicos />} />
                <Route path="/garantias" element={<Garantias />} />

                {/* Rutas Privadas (Requieren Login) */}
                <Route
                  path="/agenda"
                  element={
                    <PrivateRoute>
                      <Agenda />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/clientes"
                  element={
                    <PrivateRoute>
                      <Clientes />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </BrowserRouter>
        </CartProvider>
      </AppProvider>
    </AuthProvider>
  );
}