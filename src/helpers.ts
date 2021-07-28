import fsPromise from "fs/promises";
import fsExtra from "fs-extra";
import fs from "fs";
import path from "path";
import os from "os";
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

  const validatedPaths = validateMigrationPaths(paths);
  if (!validatedPaths.length)
    throw new Error(
      `None of the provided paths have migrations: ${paths.join(", ")}`
    );
  return validatedPaths;
};

const validateMigrationPaths = (paths: string[]) => {
  return paths.filter((p) => {
    const pathToCheck = `${process.cwd()}/${p}/migrations`;
    const pathExists: boolean = fs.existsSync(pathToCheck);
    if (!pathExists) console.log(`No migrations found at: `, pathToCheck);
    return pathExists;
  });
};

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

export const mergeMigrations = async (paths: string[]): Promise<string> => {
  let tmpDirPath;
  try {
    console.log("Creating the tmp migrations dir");
    tmpDirPath = await fsPromise.mkdtemp(
      path.join(os.tmpdir(), "xolvio-ctf-migrations")
    );

    for (let i = 0; i < paths.length; i++) {
      await fsExtra.copy(
        `${process.cwd()}/${paths[i]}/migrations`,
        `${tmpDirPath}/migrations`
      );
    }
  } catch (e) {
    console.error(`Failed during mergeMigrations step`, e);
    if (tmpDirPath) await removeMergeMigrationsTmpDir(tmpDirPath);
  }

  return tmpDirPath;
};

export const removeMergeMigrationsTmpDir = async (dirPath: string) => {
  console.log("Deleting the tmp migrations dir");
  try {
    if (dirPath) await fsExtra.remove(dirPath);
  } catch (e) {
    console.error(`Failed to clean up tmp folder at: ${dirPath}`);
  }
};
