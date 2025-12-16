// tests/setupTests.js

import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Limpieza entre tests
afterEach(() => cleanup());

/* =========================
   MOCK GLOBAL DE AUTH
   ========================= */
vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1, nombre: "Usuario Test" },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

/* =========================
   POLYFILL crypto.randomUUID
   ========================= */
if (!global.crypto) {
  // @ts-ignore
  global.crypto = {};
}

if (!global.crypto.randomUUID) {
  // @ts-ignore
  global.crypto.randomUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
}
