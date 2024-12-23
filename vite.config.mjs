import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import autoprefixer from 'autoprefixer';

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // Adiciona opções se necessário
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      include: [
        '@fullcalendar/react',
        '@fullcalendar/core',
        '@fullcalendar/daygrid',
        '@fullcalendar/timegrid',
        '@fullcalendar/interaction',
      ],
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        // Configuração para redirecionamento de API, se necessário
      },
    },
  };
});
