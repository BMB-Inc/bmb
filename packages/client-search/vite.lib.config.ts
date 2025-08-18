import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react/dist/index.js';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ClientSearch',
      fileName: (format) => `client-search.${format}.js`,
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled into the library
      external: [
        'react', 
        'react-dom', 
        'react/jsx-runtime',
        '@mantine/core',
        '@mantine/form',
        '@mantine/hooks',
        '@tanstack/react-query',
        '@tabler/icons-react',
      ],
      output: {
        // Global variables to use in UMD build for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@mantine/core': 'MantineCore',
          '@mantine/form': 'MantineForm',
          '@mantine/hooks': 'MantineHooks',
          '@tanstack/react-query': 'ReactQuery',
        },
      },
    },
  },
});
