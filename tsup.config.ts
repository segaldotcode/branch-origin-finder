import { defineConfig } from "tsup";

export default defineConfig({
  entry: { cli: "bin/branch-origin.ts" },
  // cjs, not esm: simple-git's transitive deps (e.g. @kwsites/file-exists)
  // use dynamic `require()` of Node built-ins, which esbuild cannot convert
  // to a static ESM import. Bundled CJS output keeps native `require` calls
  // working as-is.
  format: "cjs",
  target: "node18",
  outDir: "dist",
  clean: true,
  dts: false,
  splitting: false,
  sourcemap: false,
  // Bundle the CLI's own runtime deps (commander, simple-git) so dist/cli.js
  // has zero npm dependencies of its own. The root package.json lists the
  // Next.js web app's dependencies too, which a consumer installing the
  // published CLI package has no use for; a fully self-contained bundle
  // means the published package (see scripts/prepare-npm-package.mjs) can
  // ship with no "dependencies" field at all.
  noExternal: ["commander", "simple-git"],
});
