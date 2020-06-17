import { RunMigrationsArgs } from "./types";
export default function runMigrations(migrationPaths: string[], { targetEnvironment, spaceId, contentfulManagementApiKey, }?: RunMigrationsArgs): Promise<void>;
