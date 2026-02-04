import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  export async function POST(req: Request) {
  console.log("🔍 GEMINI_API_KEY existe?", !!process.env.GEMINI_API_KEY);
  console.log("🔍 Primeiros 10 chars:", process.env.GEMINI_API_KEY?.slice(0,10) || "Vazia/undefined");
  
  // resto do seu código...
}

  try {
    console.log("1️⃣ API chamada");

    if (req.method !== "POST") {
      return res.status(405).json({ resposta: "Método não permitido" });
    }

    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ resposta: "Mensagem não enviada" });
    }

    console.log("2️⃣ Mensagem recebida:", mensagem);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("3️⃣ Chamando Gemini");

    const result = await model.generateContent(mensagem);
    const resposta = result.response.text();

    console.log("4️⃣ Gemini respondeu");

    return res.status(200).json({ resposta });

  } catch (erro) {
    console.error("❌ ERRO:", erro);
    return res.status(500).json({
      resposta: "❌ Erro ao processar a mensagem."
    });
  }
}
