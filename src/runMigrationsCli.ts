#!/usr/bin/env node
import { runMigrations } from "./index";

(async () => {
  const [, , ...paths] = process.argv;
  await runMigrations(paths);
})();
