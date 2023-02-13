import typescript from "@rollup/plugin-typescript";


const outputDefaults = {
  sourcemap: true,
};

export default {
  input: "./src/index.ts",

  output: [
    {
      file: "./dist/index.cjs.js",
      format: "cjs",
      exports: "default",
      ...outputDefaults,
    },
    {
      file: "./dist/index.esm.js",
      format: "esm",
      ...outputDefaults,
    },
    {
        file: "./dist/index.umd.js",
        format: "umd",
        name: 'ReportSDK',
        ...outputDefaults,
    },
  ],

  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),

  ],

  external: [],
};
