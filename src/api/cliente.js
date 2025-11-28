// src/api/cliente.js

const api = {
  post: async (url, body) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Error en la petición");
    }

    const data = await response.json();
    return { data };
  },
};

export default api;
