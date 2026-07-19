import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.dirname(scriptsDir);
const distDir = path.join(rootDir, "dist");

const rootPkg = JSON.parse(readFileSync(path.join(rootDir, "package.json"), "utf8"));

// dist/cli.mjs is fully self-contained (see tsup.config.ts noExternal), so
// this package needs no "dependencies" at all. The root package.json's
// dependencies belong to the Next.js web app, not to CLI consumers.
const distPkg = {
  name: "branch-origin",
  version: rootPkg.version,
  description: rootPkg.description,
  keywords: rootPkg.keywords,
  license: rootPkg.license,
  author: rootPkg.author,
  repository: rootPkg.repository,
  homepage: rootPkg.homepage,
  bugs: rootPkg.bugs,
  engines: rootPkg.engines,
  bin: { "branch-origin": "./cli.js" },
};

writeFileSync(path.join(distDir, "package.json"), `${JSON.stringify(distPkg, null, 2)}\n`);
copyFileSync(path.join(rootDir, "LICENSE"), path.join(distDir, "LICENSE"));
copyFileSync(path.join(rootDir, "README.md"), path.join(distDir, "README.md"));

console.log("Prepared dist/package.json for npm publish (run `npm publish --access public` from dist/)");
