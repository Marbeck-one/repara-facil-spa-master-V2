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

// Dashboards por rol
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import DashboardTecnico from "./pages/DashboardTecnico.jsx";
import DashboardCliente from "./pages/DashboardCliente.jsx";

// Contextos
import { AppProvider } from "./context/AppContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

// Rutas Protegidas
import PrivateRoute from "./routes/PrivateRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <CartProvider>
          <BrowserRouter>
            <AppNavbar />

            <main className="main-content" style={{ minHeight: "80vh" }}>
              <Routes>
                {/* ========== RUTAS PÚBLICAS ========== */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/tecnicos" element={<Tecnicos />} />

                {/* ========== DASHBOARDS POR ROL ========== */}
                
                {/* Dashboard ADMIN - Solo accesible por administradores */}
                <Route
                  path="/dashboard/admin"
                  element={
                    <RoleRoute allowedRoles={["ADMIN"]}>
                      <DashboardAdmin />
                    </RoleRoute>
                  }
                />

                {/* Dashboard TECNICO - Solo accesible por técnicos */}
                <Route
                  path="/dashboard/tecnico"
                  element={
                    <RoleRoute allowedRoles={["TECNICO"]}>
                      <DashboardTecnico />
                    </RoleRoute>
                  }
                />

                {/* Dashboard CLIENTE - Solo accesible por clientes */}
                <Route
                  path="/dashboard/cliente"
                  element={
                    <RoleRoute allowedRoles={["CLIENTE"]}>
                      <DashboardCliente />
                    </RoleRoute>
                  }
                />

                {/* ========== RUTAS PROTEGIDAS POR ROL ========== */}

                {/* CLIENTES - Solo ADMIN puede ver la gestión de clientes */}
                <Route
                  path="/clientes"
                  element={
                    <RoleRoute allowedRoles={["ADMIN"]}>
                      <Clientes />
                    </RoleRoute>
                  }
                />

                {/* AGENDA - ADMIN y TECNICO pueden ver agenda */}
                <Route
                  path="/agenda"
                  element={
                    <RoleRoute allowedRoles={["ADMIN", "TECNICO"]}>
                      <Agenda />
                    </RoleRoute>
                  }
                />

                {/* GARANTÍAS - Todos los autenticados pueden ver */}
                <Route
                  path="/garantias"
                  element={
                    <PrivateRoute>
                      <Garantias />
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