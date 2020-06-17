"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const helpers_1 = require("./helpers");
const defaultParamValues = {
    contentfulManagementApiKey: process.env.CONTENTFUL_MANAGEMENT_API,
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    targetEnvironment: process.env.CONTENTFUL_ENVIRONMENT_ID,
};
function runMigrations(migrationPaths, { targetEnvironment = defaultParamValues.targetEnvironment, spaceId = defaultParamValues.spaceId, contentfulManagementApiKey = defaultParamValues.contentfulManagementApiKey, } = {
    contentfulManagementApiKey: process.env.CONTENTFUL_MANAGEMENT_API,
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    targetEnvironment: process.env.CONTENTFUL_ENVIRONMENT_ID,
}) {
    return __awaiter(this, void 0, void 0, function* () {
        const paths = yield helpers_1.validateMigrationArgs(migrationPaths, {
            contentfulManagementApiKey,
            spaceId,
            targetEnvironment,
        });
        console.log("Running migrations for:", paths.join(", "));
        for (let migrationIndex = 0; migrationIndex < paths.length; migrationIndex++) {
            const migration = paths[migrationIndex];
            yield new Promise((resolve) => {
                const migrate = child_process_1.spawn(`${process.cwd()}/node_modules/.bin/ctf-migrate`, [
                    "up",
                    "-a",
                    "-t",
                    contentfulManagementApiKey,
                    "-s",
                    spaceId,
                    "-e",
                    targetEnvironment,
                ], {
                    cwd: `${process.cwd()}/${migration}`,
                    env: process.env,
                });
                migrate.stdout.on("data", (stdout) => {
                    console.log(stdout.toString());
                });
                migrate.stderr.on("data", (stderr) => {
                    console.log(stderr.toString());
                });
                migrate.on("error", (err) => {
                    console.log(err);
                    resolve(false);
                });
                migrate.on("close", (code) => {
                    console.log(`content-migration: child process exited with code ${code}`);
                    resolve(code === 0);
                });
            });
        }
    });
}
exports.default = runMigrations;
//# sourceMappingURL=runMigrations.js.map