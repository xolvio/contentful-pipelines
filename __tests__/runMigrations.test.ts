import getComponentsForMigration from "../src/runMigrations";

import { spawn } from "child_process";
import createMigrationContentType from "../src/createMigrationContentType";
import { missingArgError } from "../src/helpers";
import { RunMigrationsArgs } from "../src/types";

jest.mock("child_process");
jest.mock("../src/createMigrationContentType");

const listOfMigrations = ["__tests__/TestComponent"];

beforeEach(() => {
  spawn.mockReturnValue({
    stdout: {
      on: jest.fn(),
    },
    stderr: {
      on: jest.fn(),
    },
    on: jest.fn((e, cb) => setTimeout(() => cb(0), 100)),
  });

  createMigrationContentType.mockResolvedValue(true);
});

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test("Throws error if provided empty list of migration paths", () => {
  return getComponentsForMigration([]).catch((e) => {
    expect(e).toEqual(new Error("Migration paths cannot be empty."));
  });
});

test("Throws error if did not provide migration paths as function argument", () => {
  return getComponentsForMigration().catch((e) => {
    expect(e).toEqual(new Error("Migration paths need to be provided"));
  });
});

test("Runs migrations only for the paths which contain migration scripts", async () => {
  const oneGoodOneBad = [...listOfMigrations, "this/path/doesnot/exist"];
  await getComponentsForMigration(oneGoodOneBad, {
    targetEnvironment: "environment-id",
    spaceId: "space-id",
    contentfulManagementApiKey: "contentful-api-key",
  });

  listOfMigrations.forEach((migration, i) => {
    expect(spawn.mock.calls[i][2].cwd).toMatch(migration);
  });

  expect(spawn.mock.calls.length).toEqual(1);
});

test("Checks if spawn was called with proper arguments", async () => {
  await getComponentsForMigration(listOfMigrations, {
    targetEnvironment: "environment-id",
    spaceId: "space-id",
    contentfulManagementApiKey: "contentful-api-key",
  });

  listOfMigrations.forEach((migration, i) => {
    const migrationPathSplit = migration.split("/");
    const contentTypeName = migrationPathSplit[migrationPathSplit.length - 1];
    expect(spawn.mock.calls[i][0]).toMatch("/node_modules/.bin/ctf-migrate");
    expect(spawn.mock.calls[i][1]).toEqual([
      "up",
      "-a",
      "-t",
      "contentful-api-key",
      "-s",
      "space-id",
      "-e",
      "environment-id",
    ]);
    expect(spawn.mock.calls[i][2].cwd).toMatch(migration);
  });

  expect(spawn.mock.calls.length).toEqual(listOfMigrations.length);
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
    const params: RunMigrationsArgs = {
      targetEnvironment: "1",
      spaceId: "2",
      contentfulManagementApiKey: "3",
    };
    delete params[testEnv];
    return getComponentsForMigration(listOfMigrations, params).catch((e) => {
      expect(e).toEqual(missingArgError(testEnv));
    });
  }
);
