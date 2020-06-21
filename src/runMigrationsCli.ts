#!/usr/bin/env node
import runMigrations from "./runMigrations";

(async () => {
  const [, , ...paths] = process.argv;
  await runMigrations(paths);
})();
