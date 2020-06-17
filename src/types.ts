type SourceEnvironment = string;
type TargetEnvironment = string;
type SpaceId = string;
type ContentfulManagementApiKey = string;

export type CreateEnvironmentFromSourceArgs = {
  sourceEnvironment: SourceEnvironment;
  targetEnvironment: TargetEnvironment;
  spaceId: SpaceId;
  contentfulManagementApiKey: ContentfulManagementApiKey;
};

export type CreateMigrationContentTypeArgs = {
  contentfulManagementApiKey: ContentfulManagementApiKey;
  spaceId: SpaceId;
  targetEnvironment: TargetEnvironment;
};

export type RunMigrationsArgs = {
  contentfulManagementApiKey: ContentfulManagementApiKey;
  spaceId: SpaceId;
  targetEnvironment: TargetEnvironment;
};
