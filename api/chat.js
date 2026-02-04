export default async function handler(req, res) {
  console.log("🔥 CHAT API FOI CHAMADA");

  return res.status(200).json({
    resposta: "API viva"
  });
}
