#!/usr/bin/env node
// vim: set ft=javascript:

import { createInitialMigration } from "../createInitialMigration";

exports.command = "initial-migration";

exports.desc =
  "Creates initial migrations for the already existing content type.";

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
      alias: "e",
      describe: "id of the environment within the space",
      type: "string",
      requiresArg: true,
      default: process.env.CONTENTFUL_ENVIRONMENT_ID || "master",
      defaultDescription:
        "environment var CONTENTFUL_ENV_ID if exists, otherwise master",
    })
    .option("content-type", {
      alias: "c",
      describe: "name of the content type for the migrations to create",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("initial-data", {
      alias: "i",
      describe: "should it also create initial data migration",
      type: "boolean",
      default: false,
      demandOption: false,
      requiresArg: false,
    });
};

exports.handler = async ({
  accessToken,
  spaceId,
  sourceEnvironment,
  contentType,
  initialData,
}: any) => {
  return createInitialMigration({
    accessToken,
    spaceId,
    contentType,
    sourceEnvironment,
    initialData
  });
};
