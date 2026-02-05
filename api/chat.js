// pages/api/chat.js (ou seu arquivo)
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("🔑 GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "OK" : "❌ VAZIA");

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ erro: "Chave Gemini não configurada" });
      }

      const { mensagem } = req.body;
      
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Prompt completo da cantina (baseado nas suas specs: salgado R$6-10, bolo R$12, limites R$15/dia R$300/mês, alertas pais)
      const prompt = `Você é o assistente da Cantina Centro (Osasco-SP). Produtos: 
- Salgado assado pequeno R$6 | grande R$10
- Bolo de pote R$12
Funcionalidades:
- "João salgado grande" → debita R$10 saldo João, confirma
- Saldo: "saldo João" → mostra saldo atual
- Recarga: "recarga João R$20" → +R$20
- Limites: R$15/dia, R$300/mês. Alerta pai se exceder
- PIN pai: consulta via "saldo PIN1234"
Responda CURTO como WhatsApp. Sempre confirme venda com opções [Pix][Dinheiro][Fiado].`;

      const result = await model.generateContent(`${prompt}\n\nNova mensagem: ${mensagem}`);
      const response = await result.response.text();

      return res.status(200).json({
        ok: true,
        resposta: response,
        body: req.body
      });
    } catch (error) {
      console.error("Erro Gemini:", error);
      return res.status(500).json({ erro: "Erro no processamento: " + error.message });
    }
  }

  if (req.method === "GET") {
    return res.status(200).json({ status: "Chatbot cantina vivo!" });
  }

  return res.status(405).json({ erro: "Método não permitido" });
}
