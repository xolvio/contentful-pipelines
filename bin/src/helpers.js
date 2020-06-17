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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingArgError = exports.checkForMissingArguments = exports.validateMigrationArgs = void 0;
const fs_1 = __importDefault(require("fs"));
const createMigrationContentType_1 = __importDefault(require("./createMigrationContentType"));
exports.validateMigrationArgs = (paths, migrationParameters) => __awaiter(void 0, void 0, void 0, function* () {
    if (!paths)
        throw new Error("Migration paths need to be provided");
    if (!paths.length)
        throw new Error("Migration paths cannot be empty.");
    if (!(paths === null || paths === void 0 ? void 0 : paths.length))
        throw new Error("Did not find any components to migrate. Exiting...");
    exports.checkForMissingArguments(migrationParameters);
    yield createMigrationContentType_1.default(migrationParameters);
    return validateMigrationPaths(paths);
});
const validateMigrationPaths = (paths) => paths.filter((p) => fs_1.default.existsSync(`${p}/migrations`));
exports.checkForMissingArguments = (argsToCheck) => {
    if (Array.isArray(argsToCheck)) {
        for (const env of argsToCheck)
            if (!process.env[env])
                throw exports.missingArgError(env);
    }
    else {
        for (const prop in argsToCheck)
            if (!argsToCheck[prop])
                throw exports.missingArgError(prop);
    }
};
exports.missingArgError = (missingEnv) => new Error(`${missingEnv} variable is missing. Make sure it's defined as Environment variable or provided as a function argument before running the script`);
//# sourceMappingURL=helpers.js.map