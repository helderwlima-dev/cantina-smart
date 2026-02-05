export default async function handler(req, res) {
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
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Você é um chatbot de cantina escolar.
Responda apenas em português.
Não mostre código nem backend.

Produtos:
- salgado: R$ 7,50
- suco: R$ 5,00
- refrigerante: R$ 6,00
- lanche: R$ 12,00

Mensagem do usuário:
${mensagem}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

   let resposta = "Não consegui entender a mensagem.";

if (
  data.candidates &&
  data.candidates[0] &&
  data.candidates[0].content &&
  data.candidates[0].content.parts &&
  data.candidates[0].content.parts[0] &&
  data.candidates[0].content.parts[0].text
) {
  resposta = data.candidates[0].content.parts[0].text;
}


    return res.status(200).json({ resposta });

  } catch (erro) {
    console.error("Erro Gemini REST:", erro);
    return res.status(500).json({
      resposta: "Erro ao processar mensagem"
    });
  }
}
