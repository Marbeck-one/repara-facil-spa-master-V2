import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import AppRoutes from "./app/routes";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppNavbar />
        <main className="flex-grow container mx-auto px-4 py-6">
          <AppRoutes />
        </main>
        <footer className="bg-blue-600 text-white text-center py-3 mt-6">
          <p>© 2025 ReparaFácil SPA - Todos los derechos reservados</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
