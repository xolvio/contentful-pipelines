import fsPromise from "fs/promises";
import fsExtra from "fs-extra";
import fs from "fs";
import child_process from "child_process";
import getComponentsForMigration from "../runMigrations";
import * as cmct from "../createMigrationContentType";
import { missingArgError } from "../helpers";
import { RunMigrationsArgs } from "../types";

const existsSync = jest.spyOn(fs, "existsSync");
const copy = jest.spyOn(fsExtra, "copy");
const remove = jest.spyOn(fsExtra, "remove");
const mkdtemp = jest.spyOn(fsPromise, "mkdtemp");
const spawn = jest.spyOn(child_process, "spawn");
const createMigrationContentType = jest.spyOn(cmct, "default");

const migrationsPathGlob = "src/__tests__/TestComponent";

beforeEach(() => {
  copy.mockImplementation(() => {});
  remove.mockImplementation(async () => {});
  mkdtemp.mockImplementation(async () => migrationsPathGlob);
  existsSync.mockImplementation((path: string) => path.includes("__tests__"));
  spawn.mockReturnValue({
    // @ts-ignore
    stdout: {
      on: jest.fn(),
    },
    // @ts-ignore
    stderr: {
      on: jest.fn(),
    },
    // @ts-ignore
    on: jest.fn((e, cb) => e !== "error" && setTimeout(() => cb(0), 100)),
  });

  createMigrationContentType.mockResolvedValue(Promise.resolve());
});

afterEach(() => {
  spawn.mockReset();
  createMigrationContentType.mockReset();
});

afterAll(() => {
  spawn.mockRestore();
  createMigrationContentType.mockRestore();
});

test("Throws error if did not provide migration paths as function argument", () => {
  //@ts-expect-error
  return getComponentsForMigration().catch((e) => {
    expect(e).toEqual(new Error("Migration path glob must be provided"));
  });
});

test("Runs migrations only for the paths which contain migration scripts", async () => {
  await getComponentsForMigration(migrationsPathGlob, {
    targetEnvironment: "environment-id",
    spaceId: "space-id",
    contentfulManagementApiKey: "contentful-api-key",
  });

  expect(spawn.mock.calls[0][2].cwd).toMatch(migrationsPathGlob);

  expect(spawn.mock.calls.length).toEqual(1);
});

test("Checks if spawn was called with proper arguments", async () => {
  await getComponentsForMigration(migrationsPathGlob, {
    targetEnvironment: "environment-id",
    spaceId: "space-id",
    contentfulManagementApiKey: "contentful-api-key",
  });

  const migrationPathSplit = migrationsPathGlob.split("/");
  const contentTypeName = migrationPathSplit[migrationPathSplit.length - 1];
  expect(spawn.mock.calls[0][0]).toMatch("/node_modules/.bin/ctf-migrate");
  expect(spawn.mock.calls[0][1]).toEqual([
    "up",
    "-a",
    "-t",
    "contentful-api-key",
    "-s",
    "space-id",
    "-e",
    "environment-id",
  ]);
  expect(spawn.mock.calls[0][2].cwd).toMatch(migrationsPathGlob);
});
test.each(
  Object.keys({
    targetEnvironment: "1",
    contentfulManagementApiKey: "3",
    spaceId: "2",
  } as RunMigrationsArgs).sort()
)(
  "Throws error if %s environment and migrationParameter variable not defined",
  (testEnv) => {
    expect.assertions(1);
    const params: RunMigrationsArgs & { [key: string]: string } = {
      targetEnvironment: "1",
      spaceId: "2",
      contentfulManagementApiKey: "3",
    };
    delete params[testEnv];
    return getComponentsForMigration(migrationsPathGlob, params).catch((e) => {
      expect(e).toEqual(missingArgError(testEnv));
    });
  }
);
