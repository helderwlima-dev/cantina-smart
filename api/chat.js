// app/api/gemini/route.ts (ou seu nome)
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  // LOGS PRIMEIRO - SEMPRE APARECEM
  console.log("🚀 Iniciando API...");
  console.log("🔑 GEMINI_API_KEY existe?", !!process.env.GEMINI_API_KEY);
  console.log("🔑 Primeiros chars:", process.env.GEMINI_API_KEY?.slice(0,20) || "❌ VAZIA");
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ API KEY NÃO ENCONTRADA!");
      return new Response(JSON.stringify({ error: "API Key não configurada" }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log("✅ Criando Gemini...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log("✅ Gerando conteúdo...");
    const mensagem = await req.text();
    console.log("Mensagem recebida:", mensagem);
    
    const result = await model.generateContent(mensagem);
    const resposta = result.response.text();
    
    console.log("✅ Sucesso:", resposta.slice(0,50));
    return Response.json({ resposta });
    
  } catch (error: any) {
    console.error("💥 ERRO:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
