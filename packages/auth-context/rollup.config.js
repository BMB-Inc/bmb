import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

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
      typescript({ 
        tsconfig: "./tsconfig.json",
        exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"]
      })
    ],
    external: [
      "react",
      "react-dom",
      "@mantine/core",
      "@mantine/hooks",
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
      "@mantine/hooks",
      "@bmb-inc/types"
    ],
  },
];
