#!/usr/bin/env node
// Deletes old (if exists) and creates new environment from provided source
import * as contentful from "contentful-management";
import { checkForMissingArguments } from "./helpers";
import { CreateEnvironmentFromSourceArgs } from "./types";

export const createEnvironmentFromSource = async (
  {
    sourceEnvironment,
    targetEnvironment,
    spaceId,
    contentfulManagementApiKey,
    forceRecreate,
  }: CreateEnvironmentFromSourceArgs = {
    contentfulManagementApiKey: process.env.CONTENTFUL_MANAGEMENT_API,
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    targetEnvironment: process.env.CONTENTFUL_ENVIRONMENT_ID,
    sourceEnvironment: process.env.CONTENTFUL_SOURCE_ENVIRONMENT,
    forceRecreate: false,
  }
) => {
  checkForMissingArguments({
    sourceEnvironment,
    targetEnvironment,
    spaceId,
    contentfulManagementApiKey,
  });
  const client = contentful.createClient({
    accessToken: contentfulManagementApiKey,
  });
  console.log("Got client");
  const space = await client.getSpace(spaceId);
  console.log("Got space");

  console.log(`Checking if "${targetEnvironment}" already exist`);

  const environment = await space
    .getEnvironment(targetEnvironment)
    .catch(console.log);

  if (environment && !forceRecreate)
    throw new Error(
      `Cannot create new "${targetEnvironment}" environment because one with the same name already exists. Run the command with "-f" option to force recreate the environment.`
    );

  if (environment && forceRecreate) {
    console.log("Deleting existing environment");
    await environment.delete();
  }

  const sourceEnv = sourceEnvironment || "master";
  console.log(
    `##### Creating "${targetEnvironment}" Contentful environment from "${sourceEnv}" env snapshot #####`
  );
  const newEnv = await space
    .createEnvironmentWithId(
      targetEnvironment,
      { name: `${targetEnvironment} environment` },
      sourceEnv
    )
    .catch(console.log);
  if (newEnv) console.log(`Created the ${targetEnvironment} environment`);
};
