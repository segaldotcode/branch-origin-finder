import { defineConfig } from "tsup";

export default defineConfig({
  entry: { cli: "bin/branch-origin.ts" },
  format: "esm",
  target: "node18",
  outDir: "dist",
  clean: true,
  dts: false,
  splitting: false,
  sourcemap: false,
});
