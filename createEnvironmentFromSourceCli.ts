#!/usr/bin/env node
import { createEnvironmentFromSource } from "./src/createEnvironmentFromSource";

(async () => {
  await createEnvironmentFromSource();
})();
