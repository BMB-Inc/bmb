import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: '../../.env' });

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
      }),
      replace({
        preventAssignment: true,
        values: {
          'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
        }
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
