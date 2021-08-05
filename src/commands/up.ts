#!/usr/bin/env node
// vim: set ft=javascript:

import runMigrations from "../runMigrations";

exports.command = "up";

exports.desc =
  "Prepares contentful space for the migrations and runs the migrations for specified components.";

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
    .option("environment-id", {
      alias: "e",
      describe: "id of the environment within the space",
      type: "string",
      requiresArg: true,
      default: process.env.CONTENTFUL_ENVIRONMENT_ID || "master",
      defaultDescription:
        "environment var CONTENTFUL_ENV_ID if exists, otherwise master",
    })
    .option("component-path", {
      alias: "c",
      describe:
        "paths to components you want to run the migrations for",
      type: "array",
      demandOption: true,
      requiresArg: true,
    });
};

exports.handler = async ({
  accessToken,
  spaceId,
  environmentId,
  componentPath,
}: any) => {
  return runMigrations(componentPath, {
    contentfulManagementApiKey: accessToken,
    spaceId,
    targetEnvironment: environmentId,
  });
};
