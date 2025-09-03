import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import replace from "@rollup/plugin-replace";

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
