import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import replace from "@rollup/plugin-replace";
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import path from 'node:path';
import dotenv from 'dotenv';

// Load environment variables from .env if present
dotenv.config();

// List of external dependencies that should not be bundled
const externalDeps = [
  "react",
  "react-dom",
  "react-router-dom",
  "@mantine/core",
  "@mantine/hooks",
  "@tabler/icons-react",
  "@tanstack/react-query",
  "@bmb-inc/types",
  "nuqs",
  "zod"
];

// Regex pattern for matching imports
const externalPattern = new RegExp(`^(${externalDeps.join('|')})($|/)`);

export default [
  // Main bundle
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: "dist/index.js",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      alias({
        entries: [
          { find: '@api', replacement: path.resolve(process.cwd(), 'src/api') },
          { find: '@hooks', replacement: path.resolve(process.cwd(), 'src/hooks') },
          { find: '@components', replacement: path.resolve(process.cwd(), 'src/components') },
          { find: '@modules', replacement: path.resolve(process.cwd(), 'src/modules') },
        ]
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: /node_modules/,
      }),
      postcss({
        extract: 'styles.css',
        modules: {
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
        config: {
          path: path.resolve(process.cwd(), 'postcss.config.cjs'),
        },
        minimize: false,
      }),
      replace({
        preventAssignment: true,
        values: (() => {
          // Add any VITE_* keys your package needs here
          const envKeys = [
            'VITE_IMAGERIGHT_API_URL',
          ];
          const values = {};
          for (const key of envKeys) {
            const val = process.env[key] ?? '';
            // Support both import.meta.env.KEY and (import.meta as any).env.KEY forms
            values[`import.meta.env.${key}`] = JSON.stringify(val);
            values[`(import.meta as any).env.${key}`] = JSON.stringify(val);
          }
          return values;
        })()
      }),
      typescript({ 
        tsconfig: "tsconfig.json",
        declaration: false,
        exclude: ["**/*.test.*", "**/*.spec.*", "**/*.stories.*"]
      })
    ],
    external: (id) => externalPattern.test(id)
  },
  // Type definitions
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
    external: (id) => externalPattern.test(id)
  },
];


