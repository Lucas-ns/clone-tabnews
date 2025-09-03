import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send email", async () => {
    await orchestrator.deleteAllEmail();

    await email.send({
      from: "LucasN <contato@google.com.br>",
      to: "contato@teste.com.br",
      subject: "Teste de assunto",
      text: "Teste de corpo.",
    });

    await email.send({
      from: "LucasN <contato@google.com.br>",
      to: "contato@teste.com.br",
      subject: "Ultimo email enviado",
      text: "Corpo do último email.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@google.com.br>");
    expect(lastEmail.recipients[0]).toBe("<contato@teste.com.br>");
    expect(lastEmail.subject).toBe("Ultimo email enviado");
    expect(lastEmail.text).toBe("Corpo do último email.\r\n");
  });
});
