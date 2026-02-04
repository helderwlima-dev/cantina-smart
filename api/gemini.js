export async function interpretarMensagem(mensagem) {
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `
Retorne APENAS um JSON válido.
Não escreva texto fora do JSON.

Formato:
{
  "acao": "registrar_venda | adicionar_credito | consultar_saldo",
  "aluno": string | null,
  "produto": string | null,
  "valor": number | null
}

Mensagem:
"${mensagem}"
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  const data = await response.json();

  if (!data.candidates || !data.candidates[0]) {
    throw new Error("Resposta vazia do Gemini");
  }

  const texto = data.candidates[0].content.parts[0].text;

  return JSON.parse(texto);
}
