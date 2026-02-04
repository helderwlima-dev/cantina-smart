import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function interpretarMensagem(mensagem) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const prompt = `
Você é um interpretador de comandos de uma cantina escolar.

REGRAS:
- Responda SOMENTE JSON
- NÃO escreva texto humano
- NÃO escreva data
- NÃO escreva hora
- NÃO explique nada

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
  const resposta = result.response.text();

  return JSON.parse(resposta);
}
