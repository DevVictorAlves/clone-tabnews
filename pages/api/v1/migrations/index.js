import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method))
    return response.status(405).end();

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      migrationsTable: "pgmigrations",
      verbose: true,
      dir: join("infra", "migrations"),
      direction: "up",
    };

    if (request.method === "GET") {
      const peddingMigrations = await migrationRunner(defaultMigrationOptions);
      return response.status(200).json(peddingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    await dbClient.end();
  }
}
