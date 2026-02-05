export default function handler(req, res) {
  if (req.method === "POST") {
    return res.status(200).json({
      ok: true,
      mensagem: "POST recebido com sucesso",
      body: req.body
    });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      status: "API viva (GET)"
    });
  }

  return res.status(405).json({
    erro: "Método não permitido"
  });
}
