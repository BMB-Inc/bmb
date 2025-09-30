import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import replace from "@rollup/plugin-replace";
import alias from '@rollup/plugin-alias';
import path from 'node:path';

// Custom plugin to handle CSS modules - exports empty object since styles will be handled by consuming app
const cssModulePlugin = () => ({
  name: 'css-module',
  resolveId(source) {
    if (source.endsWith('.module.css') || source.endsWith('.css')) {
      return { id: source, external: false };
    }
    return null;
  },
  load(id) {
    if (id.endsWith('.module.css') || id.endsWith('.css')) {
      return 'export default {};';
    }
    return null;
  }
});

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
      cssModulePlugin(),
      replace({
        preventAssignment: true,
        values: {}
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


