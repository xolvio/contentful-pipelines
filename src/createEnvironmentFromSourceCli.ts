#!/usr/bin/env node
import { createEnvironmentFromSource } from "./createEnvironmentFromSource";

(async () => {
  await createEnvironmentFromSource();
})();
