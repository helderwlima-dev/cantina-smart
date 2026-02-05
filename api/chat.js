import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  try {
    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ resposta: "Mensagem vazia" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
Você é um chatbot de cantina escolar.

Regras:
- Responda apenas em português
- NÃO mostre código, JSON ou backend
- NÃO invente data ou hora
- Apenas responda de forma simples

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

    return res.status(200).json({
      resposta
    });

  } catch (erro) {
    console.error("ERRO REAL:", erro);
    return res.status(500).json({
      resposta: "Erro ao processar mensagem"
    });
  }
}
