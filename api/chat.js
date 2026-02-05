export default async function handler(req, res) {

  // 🔹 CORS (obrigatório)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔹 OPTIONS (pré-requisição do navegador)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🔹 GET
  if (req.method === "GET") {
    const { mensagem } = req.query;

    if (!mensagem) {
      return res.status(400).json({ error: "Mensagem não informada" });
    }

    return res.status(200).json({
      resposta: `Mensagem recebida: ${mensagem}`
    });
  }

  // 🔹 POST
  if (req.method === "POST") {
    const { mensagem } = req.body || {};

    if (!mensagem) {
      return res.status(400).json({ error: "Mensagem não informada" });
    }

    return res.status(200).json({
      resposta: `Mensagem recebida: ${mensagem}`
    });
  }

  // 🔹 Qualquer outro método
  return res.status(405).json({ error: "Método não permitido" });
}
