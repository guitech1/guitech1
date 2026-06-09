exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Método não permitido" }),
    };
  }

  try {
    const { nome, valor, descricao } = JSON.parse(event.body || "{}");

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
        expiration: 1800
      }),
    });

    const dados = await resposta.json();

    return {
      statusCode: resposta.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pix_copia_cola: dados.transaction?.pix_copia_cola || null,
        qr_code_base64: dados.transaction?.qr_code_base64 || null,
        status: dados.transaction?.status || dados.status,
        id: dados.transaction?.id || null,
        original: dados
      }),
    };
  } catch (erro) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: erro.message }),
    };
  }
};
