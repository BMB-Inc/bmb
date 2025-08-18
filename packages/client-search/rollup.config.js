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
      },
      {
        file: "dist/index.js",
        format: "es",
      },
    ],
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'import.meta.env.VITE_SAGITTA_CLIENTS_URL': JSON.stringify(process.env.VITE_SAGITTA_CLIENTS_URL || 'http://localhost:3001/api'),
          'import.meta.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY || '')
        }
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
