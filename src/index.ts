export { default as runMigrations } from "./runMigrations";
export { createEnvironmentFromSource } from "./createEnvironmentFromSource";

process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});
