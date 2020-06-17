"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const contentful = __importStar(require("contentful-management"));
const child_process_1 = require("child_process");
const createMigrationContentType = ({ contentfulManagementApiKey, spaceId, targetEnvironment, }) => __awaiter(void 0, void 0, void 0, function* () {
    const client = contentful.createClient({
        accessToken: contentfulManagementApiKey,
    });
    console.log("Got client");
    const space = yield client.getSpace(spaceId);
    console.log("Got space");
    const environment = yield space.getEnvironment(targetEnvironment);
    const migrationContentType = yield environment
        .getContentType("migration")
        .catch(() => { });
    if (!migrationContentType) {
        console.log('"migration" content type missing, creating one...');
        yield new Promise((resolve) => {
            const migrate = child_process_1.spawn(`${process.cwd()}/node_modules/.bin/ctf-migrate`, [
                "init",
                "-t",
                contentfulManagementApiKey,
                "-s",
                spaceId,
                "-e",
                targetEnvironment,
            ], {
                cwd: process.cwd(),
                env: process.env,
            });
            migrate.stdout.on("data", (stdout) => {
                console.log(stdout.toString());
            });
            migrate.stderr.on("data", (stderr) => {
                console.log(stderr.toString());
            });
            migrate.on("error", (err) => {
                console.log(`CWD: ${process.cwd()}`);
                throw err;
            });
            migrate.on("close", (code) => {
                console.log(`content-migration migration type creation exited with: ${code}`);
                resolve(code === 0);
            });
        });
    }
});
exports.default = createMigrationContentType;
//# sourceMappingURL=createMigrationContentType.js.map