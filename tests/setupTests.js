// tests/setupTests.js

// Limpieza entre tests (opcional pero sano)
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => cleanup());

// jest-dom para Vitest (¡esta variante!)
import "@testing-library/jest-dom/vitest";

// Polyfill para crypto.randomUUID (jsdom)
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

