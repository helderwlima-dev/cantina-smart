import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  let mensagem = "";

  if (req.method === "POST") {
    mensagem = req.body?.mensagem;
  }

  if (req.method === "GET") {
    mensagem = req.query?.mensagem;
  }

  if (!mensagem) {
    return res.status(400).json({ resposta: "Mensagem não enviada" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Você é um chatbot de cantina escolar.
Responda apenas em português.
Não mostre código, JSON ou backend.

Produtos:
- salgado: R$ 7,50
- suco: R$ 5,00
- refrigerante: R$ 6,00
- lanche: R$ 12,00

Mensagem do usuário:
${mensagem}
`;

    const result = await model.generateContent(prompt);
    const resposta = result.response.text();

    return res.status(200).json({ resposta });

  } catch (erro) {
    console.error("Erro real:", erro);
    return res.status(500).json({ resposta: "Erro ao processar mensagem" });
  }
}
