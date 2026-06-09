exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método não permitido" }),
    };
  }

  try {
    const { nome, valor, descricao } = JSON.parse(event.body || "{}");

    if (!nome || !valor) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Nome e valor são obrigatórios" }),
      };
    }

    const resposta = await fetch("https://jumpfy.io/api/pix/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.JUMPFY_API_KEY,
      },
      body: JSON.stringify({
        amount: Number(valor),
        description: descricao || `Pedido - ${nome}`,
        external_id: `pedido_${Date.now()}`,
        webhook_url: "https://guitech.netlify.app/.netlify/functions/webhook-jumpfy",
      }),
    });

    const dados = await resposta.json();

    return {
      statusCode: resposta.status,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    };
  } catch (erro) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: erro.message }),
    };
  }
}; // redeploy
