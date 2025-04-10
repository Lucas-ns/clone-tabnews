import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-br");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    databaseStatusInformation = (
      <ul>
        <li>
          Última atualização:{" "}
          {new Date(data.updated_at).toLocaleString("pt-br")}
        </li>
        <li>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </li>
        <li>
          Máximo de conexões: {data.dependencies.database.max_connections}
        </li>
        <li>Versão do banco de dados: {data.dependencies.database.version}</li>
      </ul>
    );
  }

  return (
    <>
      <h2>Database</h2>
      {databaseStatusInformation}
    </>
  );
}
