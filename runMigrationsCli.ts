#!/usr/bin/env node
import runMigrations from "./src/runMigrations";

(async () => {
  const [, , ...paths] = process.argv;
  await runMigrations(paths);
})();
