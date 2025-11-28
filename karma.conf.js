// karma.conf.js (ESM + Vite 5)
import vitePlugin from 'karma-vite';

export default function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      { pattern: 'setupTests.js', type: 'module', watched: false },
      { pattern: 'tests/**/*.{test,spec}.{js,jsx,ts,tsx}', type: 'module', watched: true },
      { pattern: 'src/**/*.{test,spec}.{js,jsx,ts,tsx}', type: 'module', watched: true }
    ],

    preprocessors: {
      'tests/**/*.{test,spec}.{js,jsx,ts,tsx}': ['vite'],
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}': ['vite']
    },

    // 🔧 Aquí registramos el plugin Vite manualmente
    plugins: [
      vitePlugin,
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage'
    ],

    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },

    browsers: ['ChromeHeadless'],
    singleRun: true,
    autoWatch: false,

    client: { jasmine: { random: false } },

    vite: {
      // Deja que Vite use su propia config del proyecto
      appType: 'custom'
    }
  });
}
