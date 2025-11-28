import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ====== tus estados actuales ======
  const [servicios, setServicios] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [agenda, setAgenda] = useState([]);

  // ====== tus funciones originales ======
  const addCita = (nuevaCita) => setAgenda((prev) => [...prev, nuevaCita]);
  const removeCita = (id) =>
    setAgenda((prev) => prev.filter((c) => c.id !== id));

  // ====== contador global ======
  const [counter, setCounter] = useState(0);
  const add = () => setCounter((c) => c + 1);
  const reset = () => setCounter(0);

  // ====== AUTENTICACIÓN DE CLIENTE ======
  const [usuario, setUsuario] = useState(null);

  // al cargar la app, recuperar usuario logueado si existe
  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      setUsuario(JSON.parse(guardado));
    }
  }, []);

  // registrar nuevo cliente (solo cliente, no técnico/admin)
  const registerCliente = (nombre, email, password) => {
    const raw = localStorage.getItem("clientesAuth");
    const clientesGuardados = raw ? JSON.parse(raw) : [];

    const yaExiste = clientesGuardados.some((c) => c.email === email);
    if (yaExiste) {
      return { ok: false, error: "El correo ya está registrado." };
    }

    const nuevo = { nombre, email, password };
    const actualizados = [...clientesGuardados, nuevo];
    localStorage.setItem("clientesAuth", JSON.stringify(actualizados));

    return { ok: true };
  };

  // login de cliente usando los datos registrados
  const login = (email, password) => {
    // console.log("login called with:", email
    const raw = localStorage.getItem("clientesAuth");
    const clientesGuardados = raw ? JSON.parse(raw) : [];

    const encontrado = clientesGuardados.find(
      (c) => c.email === email && c.password === password
    );

    if (!encontrado) {
      return false;
    }

    const clienteSesion = {
      nombre: encontrado.nombre,
      email: encontrado.email,
      rol: "cliente",
    };

    setUsuario(clienteSesion);
    localStorage.setItem("usuario", JSON.stringify(clienteSesion));
    return true;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  // ====== value con todo lo que expones ======
  const value = useMemo(
    () => ({
      servicios,
      tecnicos,
      agenda,
      addCita,
      removeCita,
      counter,
      add,
      reset,
      // auth
      usuario,
      login,
      logout,
      registerCliente,
    }),
    [servicios, tecnicos, agenda, counter, usuario]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
