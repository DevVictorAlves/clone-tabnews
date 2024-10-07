const { exec } = require("node:child_process");

function checkPostgres() {
  const commandExec = "docker exec postgres-dev pg_isready --host localhost";
  exec(commandExec, handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n\n😊 Postgres esta pronto e aceitando conexões\n");
  }
}

process.stdout.write("\n\n👌 Aguardando o Postgres aceitar conexões");

checkPostgres();
