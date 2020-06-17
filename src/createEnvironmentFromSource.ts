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
  }: CreateEnvironmentFromSourceArgs = {
    contentfulManagementApiKey: process.env.CONTENTFUL_MANAGEMENT_API,
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    targetEnvironment: process.env.CONTENTFUL_ENVIRONMENT_ID,
    sourceEnvironment: process.env.CONTENTFUL_SOURCE_ENVIRONMENT,
  }
) => {
  checkForMissingArguments({
    sourceEnvironment,
    targetEnvironment,
    spaceId,
    contentfulManagementApiKey,
  });
  console.log("##### Deleting QA Contentful environment #####");
  const client = contentful.createClient({
    accessToken: contentfulManagementApiKey,
  });
  console.log("Got client");
  const space = await client.getSpace(spaceId);
  console.log("Got space");
  const environment = await space
    .getEnvironment(targetEnvironment)
    .catch(console.log);
  if (environment) {
    console.log("Got environment");
    await environment.delete();
    console.log("Deleted the old environment");
  }

  const sourceEnv = sourceEnvironment || "master";
  console.log(
    `##### Creating QA Contentful environment from ${sourceEnv} env snapshot #####`
  );
  const newEnv = await space
    .createEnvironmentWithId(
      targetEnvironment,
      { name: "QA environment" },
      sourceEnv
    )
    .catch(console.log);
  if (newEnv) console.log(`Created the ${targetEnvironment} environment`);
};
