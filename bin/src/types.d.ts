declare type SourceEnvironment = string;
declare type TargetEnvironment = string;
declare type SpaceId = string;
declare type ContentfulManagementApiKey = string;
export declare type CreateEnvironmentFromSourceArgs = {
    sourceEnvironment: SourceEnvironment;
    targetEnvironment: TargetEnvironment;
    spaceId: SpaceId;
    contentfulManagementApiKey: ContentfulManagementApiKey;
};
export declare type CreateMigrationContentTypeArgs = {
    contentfulManagementApiKey: ContentfulManagementApiKey;
    spaceId: SpaceId;
    targetEnvironment: TargetEnvironment;
};
export declare type RunMigrationsArgs = {
    contentfulManagementApiKey: ContentfulManagementApiKey;
    spaceId: SpaceId;
    targetEnvironment: TargetEnvironment;
};
export {};
