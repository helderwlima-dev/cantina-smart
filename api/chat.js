const comando = await interpretarMensagem(mensagem);


const produtos = {
  salgado: 5,
  suco: 4,
  refrigerante: 6
};

const alunos = {
  João: { saldo: 10 },
  Maria: { saldo: 0 }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  try {
    const { mensagem } = req.body;

const comando = await interpretarMensagem(mensagem);


    const { acao, aluno, produto, valor } = comando;

    if (!aluno || !alunos[aluno]) {
      return res.json({ resposta: "❌ Aluno não encontrado." });
    }

    if (acao === "registrar_venda") {
      if (!produtos[produto]) {
        return res.json({ resposta: "❌ Produto não encontrado." });
      }

      alunos[aluno].saldo -= produtos[produto];

      return res.json({
        resposta: `🧾 ${aluno} comprou ${produto} por R$ ${produtos[produto].toFixed(2)}`
      });
    }

    if (acao === "adicionar_credito") {
      alunos[aluno].saldo += valor;

      return res.json({
        resposta: `✅ Crédito adicionado! ${aluno} recebeu R$ ${valor.toFixed(2)}`
      });
    }

    if (acao === "consultar_saldo") {
      return res.json({
        resposta: `💰 Saldo de ${aluno}: R$ ${alunos[aluno].saldo.toFixed(2)}`
      });
    }

    return res.json({ resposta: "❌ Comando não reconhecido." });

  } catch (err) {
    return res.status(500).json({
      resposta: "❌ Erro ao processar a mensagem."
    });
  }
}
