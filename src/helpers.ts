import fs from "fs";
import createMigrationContentType from "./createMigrationContentType";
import { RunMigrationsArgs } from "./types";

export const validateMigrationArgs = async (
  paths: string[],
  migrationParameters: RunMigrationsArgs
): Promise<string[]> => {
  if (!paths) throw new Error("Migration paths need to be provided");
  if (!paths.length) throw new Error("Migration paths cannot be empty.");
  if (!paths?.length)
    throw new Error("Did not find any components to migrate. Exiting...");

  checkForMissingArguments(migrationParameters);

  await createMigrationContentType(migrationParameters);

  return validateMigrationPaths(paths);
};

const validateMigrationPaths = (paths: string[]) =>
  paths.filter((p) => fs.existsSync(`${p}/migrations`));

export const checkForMissingArguments = (
  argsToCheck: string[] | { [key: string]: any }
) => {
  if (Array.isArray(argsToCheck)) {
    for (const env of argsToCheck)
      if (!process.env[env]) throw missingArgError(env);
  } else {
    for (const prop in argsToCheck)
      if (!argsToCheck[prop]) throw missingArgError(prop);
  }
};

export const missingArgError = (missingEnv: string) =>
  new Error(
    `${missingEnv} variable is missing. Make sure it's defined as Environment variable or provided as a function argument before running the script`
  );
