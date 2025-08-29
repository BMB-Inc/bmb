import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import replace from "@rollup/plugin-replace";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        exports: "named",
        // Prevent file locking issues by ensuring files are closed properly
        compact: true,
        sourcemap: false,
      },
      {
        file: "dist/index.js",
        format: "es",
        // Prevent file locking issues by ensuring files are closed properly
        compact: true,
        sourcemap: false,
      },
    ],
    plugins: [
      // No environment variable replacements needed
      replace({
        preventAssignment: true,
        values: {}
      }),
      typescript({ 
        tsconfig: "./tsconfig.json",
        exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"]
      })
    ],
    external: [
      "react",
      "react-dom",
      "@mantine/core",
      "@mantine/form",
      "@mantine/hooks",
      "@tabler/icons-react",
      "@tanstack/react-query",
      "@bmb-inc/types"
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
      // Minimize chance of file locking
      compact: true,
      sourcemap: false,
    },
    plugins: [dts()],
    external: [
      "react",
      "react-dom", 
      "@mantine/core",
      "@mantine/form",
      "@mantine/hooks",
      "@tabler/icons-react",
      "@tanstack/react-query",
      "@bmb-inc/types"
    ],
  },
];
