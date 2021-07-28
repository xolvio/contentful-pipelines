import * as contentful from "contentful-management";
// @ts-ignore
import { initSpace } from "contentful-migrate/lib/store";
import { CreateMigrationContentTypeArgs } from "./types";

const createMigrationContentType = async ({
  contentfulManagementApiKey,
  spaceId,
  targetEnvironment,
}: CreateMigrationContentTypeArgs) => {
  const client = contentful.createClient({
    accessToken: contentfulManagementApiKey,
  });
  console.log("Got client");
  const space = await client.getSpace(spaceId);
  console.log("Got space");
  const environment = await space.getEnvironment(targetEnvironment);

  const migrationContentType = await environment
    .getContentType("migration")
    .catch(() => {});
  if (!migrationContentType) {
    console.log('"migration" content type missing, creating one...');
    await initSpace(contentfulManagementApiKey, spaceId, targetEnvironment);
  }
};

export default createMigrationContentType;
