import { RunMigrationsArgs } from "./types";
export declare const validateMigrationArgs: (paths: string[], migrationParameters: RunMigrationsArgs) => Promise<string[]>;
export declare const checkForMissingArguments: (argsToCheck: string[] | {
    [key: string]: any;
}) => void;
export declare const missingArgError: (missingEnv: string) => Error;
