#!/usr/bin/env node
// vim: set ft=javascript:

import { createEnvironmentFromSource } from "../createEnvironmentFromSource";

exports.command = "create-environment";

exports.desc =
  "Creates new contentful environment from provided source environment";

exports.builder = (yargs: any) => {
  yargs
    .option("access-token", {
      alias: "t",
      describe: "Contentful Management API access token",
      demandOption: true,
      default: process.env.CONTENTFUL_MANAGEMENT_API,
      defaultDescription: "environment var CONTENTFUL_MANAGEMENT_ACCESS_TOKEN",
    })
    .option("space-id", {
      alias: "s",
      describe: "space id to use",
      type: "string",
      requiresArg: true,
      demandOption: true,
      default: process.env.CONTENTFUL_SPACE_ID,
      defaultDescription: "environment var CONTENTFUL_SPACE_ID",
    })
    .option("source-environment", {
      describe: "id of the existing contentful environment",
      type: "string",
      requiresArg: true,
      default: process.env.CONTENTFUL_ENVIRONMENT_ID || "master",
      defaultDescription:
        "environment var CONTENTFUL_ENV_ID if exists, otherwise master",
    })
    .option("force-recreate", {
      alias: "f",
      describe: "Recreates the targetEnvironment if it already exists",
      type: "boolean",
      requiresArg: false,
      default: false,
    })
    .option("target-environment", {
      describe: "id of the new environment to be created",
      type: "string",
      requiresArg: true,
    })
    .check((argv: any, options: any) => {
      if (argv.targetEnvironment === argv.sourceEnvironment)
        throw new Error("Target and Source environment cannot be the same.");

      return true;
    });
};

exports.handler = async ({
  accessToken,
  spaceId,
  sourceEnvironment,
  targetEnvironment,
  forceRecreate,
}: any) => {
  return createEnvironmentFromSource({
    sourceEnvironment,
    targetEnvironment,
    spaceId,
    contentfulManagementApiKey: accessToken,
    forceRecreate
  });
};
