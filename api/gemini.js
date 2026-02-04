import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extrairJSON(texto) {
  const inicio = texto.indexOf("{");
  const fim = texto.lastIndexOf("}");

  if (inicio === -1 || fim === -1) {
    throw new Error("JSON não encontrado");
  }

  return JSON.parse(texto.substring(inicio, fim + 1));
}

export async function interpretarMensagem(mensagem) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const prompt = `
Você é um interpretador de comandos de uma cantina escolar.

REGRAS OBRIGATÓRIAS:
- Responda SOMENTE com JSON
- NÃO escreva texto fora do JSON
- NÃO escreva data
- NÃO escreva hora
- NÃO use markdown

Formato:
{
  "acao": "registrar_venda | adicionar_credito | consultar_saldo",
  "aluno": "string ou null",
  "produto": "string ou null",
  "valor": number ou null
}

Mensagem:
"${mensagem}"
`;

  const result = await model.generateContent(prompt);
  const texto = result.response.text();

  return extrairJSON(texto);
}
