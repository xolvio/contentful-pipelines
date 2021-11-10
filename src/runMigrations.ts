import { spawn } from "child_process";
import glob from "glob";
import {
  mergeMigrations,
  removeMergeMigrationsTmpDir,
  validateMigrationArgs,
} from "./helpers";
import { RunMigrationsArgs } from "./types";

const defaultParamValues = {
  contentfulManagementApiKey: process.env.CONTENTFUL_MANAGEMENT_API,
  spaceId: process.env.CONTENTFUL_SPACE_ID,
  targetEnvironment: process.env.CONTENTFUL_ENVIRONMENT_ID,
};

export default async function runMigrations(
  migrationPathGlob: string,
  {
    targetEnvironment = defaultParamValues.targetEnvironment,
    spaceId = defaultParamValues.spaceId,
    contentfulManagementApiKey = defaultParamValues.contentfulManagementApiKey,
  }: RunMigrationsArgs = {
    contentfulManagementApiKey: process.env.CONTENTFUL_MANAGEMENT_API,
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    targetEnvironment: process.env.CONTENTFUL_ENVIRONMENT_ID,
  }
) {
  if (!migrationPathGlob)
    throw new Error("Migration path glob must be provided");

  const migrationPaths = await new Promise<string[]>((res, rej) => {
    glob(`${process.cwd()}/${migrationPathGlob}`, (e, files) => {
      if (e) {
        console.log("Error during search for migration paths", e);
        res([]);
      }
      res(files);
    });
  });

  const paths = await validateMigrationArgs(migrationPaths, {
    contentfulManagementApiKey,
    spaceId,
    targetEnvironment,
  });
  console.log("Running migrations for:", paths);

  const mergedPath = await mergeMigrations(paths);

  try {
    await new Promise((resolve, reject) => {
      const migrate = spawn(
        `${process.cwd()}/node_modules/.bin/ctf-migrate`,
        [
          "up",
          "-a",
          "-t",
          contentfulManagementApiKey,
          "-s",
          spaceId,
          "-e",
          targetEnvironment,
        ],
        {
          cwd: mergedPath,
          env: process.env,
        }
      );

      migrate.stdout.on("data", (stdout: string) => {
        console.log(stdout.toString());
      });
      migrate.stderr.on("data", (stderr: string) => {
        console.log(stderr.toString());
      });
      migrate.on("error", (err: any) => {
        console.log(
          `######### Failed to run migrations from: ${mergedPath} ######### `
        );
        resolve(false);
      });
      migrate.on("close", (code: number) => {
        const isSuccess = code === 0;
        if (isSuccess)
          console.log(
            `######### FINISHED migrations from: ${mergedPath} ######### `
          );
        else
          console.log(
            `content-migration: child process exited with code ${code}`
          );
        if (isSuccess) {
          resolve(isSuccess);
        } else {
          reject(isSuccess)
        }
      });
    });
  } catch (e) {
    console.log("Error", e)
    throw new Error(e);
  } finally {
    await removeMergeMigrationsTmpDir(mergedPath);
  }
}
