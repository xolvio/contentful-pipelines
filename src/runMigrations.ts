import { spawn } from "child_process";
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
  migrationPath: string[],
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
  const paths = await validateMigrationArgs(migrationPath, {
    contentfulManagementApiKey,
    spaceId,
    targetEnvironment,
  });
  console.log("Running migrations for:", migrationPath);

  const mergedPath = await mergeMigrations(paths);

  await new Promise((resolve) => {
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
      resolve(isSuccess);
    });
  });

  await removeMergeMigrationsTmpDir(mergedPath);
}
