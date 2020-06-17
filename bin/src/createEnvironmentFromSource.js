#!/usr/bin/env node
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
exports.createEnvironmentFromSource = void 0;
// Deletes old (if exists) and creates new environment from provided source
const contentful = __importStar(require("contentful-management"));
const helpers_1 = require("./helpers");
exports.createEnvironmentFromSource = ({ sourceEnvironment, targetEnvironment, spaceId, contentfulManagementApiKey, } = {
    contentfulManagementApiKey: process.env.CONTENTFUL_MANAGEMENT_API,
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    targetEnvironment: process.env.CONTENTFUL_ENVIRONMENT_ID,
    sourceEnvironment: process.env.CONTENTFUL_SOURCE_ENVIRONMENT,
}) => __awaiter(void 0, void 0, void 0, function* () {
    helpers_1.checkForMissingArguments({
        sourceEnvironment,
        targetEnvironment,
        spaceId,
        contentfulManagementApiKey,
    });
    console.log("##### Deleting QA Contentful environment #####");
    const client = contentful.createClient({
        accessToken: contentfulManagementApiKey,
    });
    console.log("Got client");
    const space = yield client.getSpace(spaceId);
    console.log("Got space");
    const environment = yield space
        .getEnvironment(targetEnvironment)
        .catch(console.log);
    if (environment) {
        console.log("Got environment");
        yield environment.delete();
        console.log("Deleted the old environment");
    }
    const sourceEnv = sourceEnvironment || "master";
    console.log(`##### Creating QA Contentful environment from ${sourceEnv} env snapshot #####`);
    const newEnv = yield space
        .createEnvironmentWithId(targetEnvironment, { name: "QA environment" }, sourceEnv)
        .catch(console.log);
    if (newEnv)
        console.log(`Created the ${targetEnvironment} environment`);
});
//# sourceMappingURL=createEnvironmentFromSource.js.map