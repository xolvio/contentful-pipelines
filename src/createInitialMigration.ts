import * as contentful from "contentful-management";
import dateformat from "dateformat";
// @ts-ignore
import bootstrapCtfContentType from "contentful-migrate/lib/bootstrap";

import fs from "fs/promises";

export const createInitialMigration = async ({
  spaceId,
  accessToken,
  sourceEnvironment,
  contentType,
  initialData,
}: {
  spaceId: string;
  accessToken: string;
  sourceEnvironment: string;
  contentType: string;
  initialData: boolean;
}) => {
  const client = contentful.createClient({
    accessToken,
  });
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(sourceEnvironment);

  await bootstrapCtfContentType(
    spaceId,
    sourceEnvironment,
    [contentType],
    accessToken,
    "migrations",
    false
  );

  let initialEntry = null;
  if (initialData)
    initialEntry = await environment.getEntries({
      include: 10,
      limit: 1,
      content_type: contentType,
      locale: "en-US",
    });

  console.log("Initial Content type migrations created.");

  if (!initialData) {
    console.log("Skipping creation of initial data migration.");
    return;
  }

  if (!initialEntry?.items?.length && initialData) {
    console.log(
      `No entry found for ${contentType}. Skipping creation of initial data migration.`
    );
    return;
  }

  const entryInitialData = initialEntry.items[0].fields;

  const r = await fs.readdir(`${process.cwd()}/migrations/${contentType}`);

  let [, , ...nameWithoutTimestamp] = r[0].split("-");
  const fileAppendix = nameWithoutTimestamp.join("-");

  await new Promise((res) => setTimeout(() => res(true), 100)); // Makes sure migration files timestamps are different

  const date = dateformat(new Date(), "UTC:yyyymmddHHMMss");
  await fs.writeFile(
    `${process.cwd()}/migrations/${contentType}/${date}-create-initial-data-${fileAppendix}`,
    `

    module.exports.description = "Create initial content for ${contentType}";

    module.exports.up = async (migration, { makeRequest }) => {

     await makeRequest({
        method: "PUT",
        url: '/entries/${contentType}_initialData',
        data: {"fields": ${JSON.stringify(entryInitialData)}},
        headers: {
          "X-Contentful-Content-Type": "${contentType}",
        },
     });

    }

    module.exports.down = async (migration, { makeRequest }) => {

      await makeRequest({
        method: "DELETE",
        url: '/entries/${contentType}_initialData',
        headers: {
          "X-Contentful-Version": "4",
        },
     });

    };

    `
  );
  console.log("Initial Content type migrations decorated with initial data.");
};
