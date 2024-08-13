import database from "infra/database.js";

export default async function status(request, response) {
  const dataBaseVersionResult = await database.query("SHOW server_version;");
  const dataBaseVersionValue = dataBaseVersionResult.rows[0].server_version;

  const dataBaseMaxConnectionResult = await database.query(
    "show max_connections",
  );

  const dataBaseMaxConnectionValue =
    dataBaseMaxConnectionResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectResult = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });

  const databaseOpenedConnectValue =
    await databaseOpenedConnectResult.rows[0].count;

  const updateAt = new Date().toISOString();
  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: dataBaseVersionValue,
        max_connections: parseInt(dataBaseMaxConnectionValue),
        opened_connections: databaseOpenedConnectValue,
      },
    },
  });
}
