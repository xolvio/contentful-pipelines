# Contentful Pipelines

## How to Install

```
npm -D install @xolvio/contentful-pipelines
```

## API

The `contentful pipelines` package exposes two commands which can be run either as a `package.json` script or executed in the code (runtime).

#### Migrations
Given directory structure:

```
your-project
├── README.md
├── src
│   └── components
│       ├── Title
│       │    └── migrations
│       │         └── title
│       │               └── 1513695986378-create-title-type.js
│       └── Sections
│            └── migrations
│                 └── sections
│                       └── 1513695986378-create-title-type.js
├── package.json

```

Running as `package.json` command:

```shell script
"migrations": "CONTENTFUL_MANAGEMENT_API=<contentful-management-api-key> CONTENTFUL_SPACE_ID=<contentful-space-id> CONTENTFUL_ENVIRONMENT_ID=<contentful-environment-id> xolvio-contentful-migrations src/components/Title src/components/Sections"
```

Running from code:

```typescript
async function runMigrations(migrationPaths, options);
```

| Parameter        | Type                                                                                                         | Default                                                                                                                                                                                     | Description                                                                                                                 |
| :--------------- | :----------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| `migrationPaths` | `string[]`                                                                                                   | []                                                                                                                                                                                          | **Required**. List of paths to the components containing migration scripts. Paths should be relative to the project's root. |
| `options`        | {<br>targetEnvironment: `string`,<br><br>spaceId: `string`,<br><br>contentfulManagementApiKey: `string`<br>} | `targetEnvironment = process.env.CONTENTFUL_ENVIRONMENT_ID` <br><br>`spaceId = process.env.CONTENTFUL_SPACE_ID`<br><br>`contentfulManagementApiKey = process.env.CONTENTFUL_MANAGEMENT_API` | Optional. Overwrites the `process.env` variables                                                                            |

```typescript
const { runMigrations } = require("@xolvio/contentful-pipelines");

await runMigrations(["src/components/Title", "src/components/Sections"]);
```

#### Creating the contentful environment
Running as `package.json` command:

```shell script
"createQaEnvironmentFromProd": "CONTENTFUL_MANAGEMENT_API=<contentful-management-api-key> CONTENTFUL_SPACE_ID=<contentful-space-id> CONTENTFUL_SOURCE_ENVIRONMENT=<contentful-prod-environment-id> CONTENTFUL_ENVIRONMENT_ID=<contentful-environment-id> xolvio-contentful-create-environment"
```

Running from code:

```typescript
async function createEnvironmentFromSource(options);
```

| Parameter | Type                                                                                                                                             | Default                                                                                                                                                                                                                                                          | Description                                      |
| :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------- |
| `options` | {<br>sourceEnvironment: `string`,<br><br>targetEnvironment: `string`,<br><br>spaceId: `string`,<br><br>contentfulManagementApiKey: `string`<br>} | `sourceEnvironment=process.env.CONTENTFUL_SOURCE_ENVIRONMENT`<br><br>`targetEnvironment = process.env.CONTENTFUL_ENVIRONMENT_ID` <br><br>`spaceId = process.env.CONTENTFUL_SPACE_ID`<br><br>`contentfulManagementApiKey = process.env.CONTENTFUL_MANAGEMENT_API` | Optional. Overwrites the `process.env` variables |

Example:

```typescript
await createEnvironmentFromSource();
```

## Writing migration scripts
For executing the migrations we're using [Contentful Migrate Tool](https://github.com/deluan/contentful-migrate) so the migrations are written using their syntax. Using their CLI tool you can quickly create the migration scripts based on the existing Contentful Content Types.

#### Useful scripts
Fetch existing entry data (used for initial data migration scripts)

```typescript
module.exports.up = async (migration, { makeRequest }) => {
  const existing = await makeRequest({
    method: "GET",
    url: `/entries/ENTRY_ID_TO_QUERY`,
  }).catch(console.log);

  console.log("existing: ", JSON.stringify(existing.fields));
};
```

Create contentful entry from within the contentful migration script:

```typescript
module.exports.up = async (migration, { makeRequest }) => {
  await makeRequest({
    method: "PUT",
    url: `/entries/NEW_ENTRY_ID`,
    data: EXISTING_FIELDS_FROM_SNIPPET_ABOVE,
    headers: {
      "X-Contentful-Content-Type": "CONTENT_TYPE_ID",
    },
  });
};
```
