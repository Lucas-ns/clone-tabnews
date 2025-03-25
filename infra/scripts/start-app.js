/* global Promise */
const { spawn } = require("child_process");

// Função para executar um comando de forma assíncrona
function spawnCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: "inherit", shell: true });
    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Erro: ${command} saiu com código ${code}`);
      }
    });
  });
}

// Função principal que vai orquestrar o processo de inicialização
async function startApp() {
  try {
    // Passo 1: Iniciar os serviços (containers)
    console.log("Iniciando os containers...");
    await spawnCommand("docker", [
      "compose",
      "-f",
      "infra/compose.yaml",
      "up",
      "-d",
    ]);

    console.log("Aguardando o banco de dados...");
    await spawnCommand("npm", ["run", "services:wait:database"]);

    console.log("Executando migrações...");
    await spawnCommand("npm", ["run", "migrations:up"]);

    console.log("Iniciando o Next.js...");
    spawn("next", ["dev"], {
      stdio: "inherit",
      shell: true,
    });

    process.on("SIGINT", async () => {
      console.log("\n\nRecebido Ctrl+C. Parando os containers Docker...");
      try {
        await spawnCommand("npm", ["run", "services:down"]);
        console.log("Containers Docker parados com sucesso!");
      } catch (error) {
        console.error("Erro ao parar os containers:", error);
      } finally {
        process.exit(0);
      }
    });
  } catch (error) {
    console.error("Erro ao inicializar a aplicação:", error);
    process.exit(1); // Finaliza com erro se algo falhar antes do `next dev`
  }
}

// Chama a função principal
startApp();
