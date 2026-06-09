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
      }),
    });

    const dados = await resposta.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pix_copia_cola:
          dados.pix_copia_cola ||
          dados.pixCopiaCola ||
          dados.copy_paste ||
          dados.pix_code ||
          dados.payload ||
          dados.data?.pix_copia_cola ||
          dados.data?.copy_paste ||
          dados.data?.pix_code ||
          null,

        qr_code_base64:
          dados.qr_code_base64 ||
          dados.qrCodeBase64 ||
          dados.qrcode_base64 ||
          dados.qr_code ||
          dados.qrcode ||
          dados.data?.qr_code_base64 ||
          dados.data?.qr_code ||
          dados.data?.qrcode ||
          null,

        resposta_original: dados
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
