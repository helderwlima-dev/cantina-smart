export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ resposta: "Mensagem vazia" });
  }

  // RESPOSTA SIMPLES POR ENQUANTO (TESTE)
  if (mensagem.toLowerCase().includes("salgado")) {
    return res.status(200).json({
      resposta: "🧾 João comprou um salgado por R$ 5,00"
    });
  }

  return res.status(200).json({
    resposta: "Mensagem recebida com sucesso 👍"
  });
}
