import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// tabela simples de produtos (você pode mudar depois)
const PRODUTOS = {
  salgado: 7.5,
  suco: 5,
  refrigerante: 6,
  lanche: 12
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  try {

    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ resposta: "Mensagem não enviada" });
    }

    // hora automática do servidor
    const agora = new Date().toLocaleString("pt-BR");

    // prompt do sistema (regra do chatbot)
    const systemPrompt = `
Você é um chatbot de cantina escolar chamado Cantina Smart.

REGRAS IMPORTANTES:
- NUNCA mostre JSON, backend, código ou estrutura interna
- NUNCA gere data ou hora manualmente
- Apenas responda em português
- Seja claro e educado
- Use valores reais dos produtos

PRODUTOS DISPONÍVEIS:
${Object.entries(PRODUTOS)
  .map(([nome, valor]) => `- ${nome}: R$ ${valor.toFixed(2)}`)
  .join("\n")}

EXEMPLOS:
Usuário: João comprou um salgado
Resposta: João comprou 1 salgado no valor de R$ 7,50.

Usuário: Maria comprou um suco
Resposta: Maria comprou 1 suco no valor de R$ 5,00.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

   const result = await model.generateContent({
  contents: [
    {
      role: "user",
      parts: [
        {
          text: `${systemPrompt}\n\nMensagem do usuário: ${mensagem}`
        }
      ]
    }
  ]
});

    const respostaIA = result.response.text();

    return res.status(200).json({
      resposta: respostaIA,
      horaServidor: agora
    });

  } catch (erro) {
    console.error("Erro Gemini:", erro);
    return res.status(500).json({
      resposta: "❌ Erro ao processar a mensagem."
    });
  }
}
