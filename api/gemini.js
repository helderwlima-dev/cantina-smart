import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function interpretarMensagem(mensagem) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

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

  const result = await model.generateContent(prompt);
  const texto = result.response.text();

  try {
    return JSON.parse(texto);
  } catch {
    throw new Error("Gemini não retornou JSON válido");
  }
}
