const API_BASE_URL = "http://10.0.2.2:3000"; // Ajuste conforme seu IP de backend

export const api = {
  getProdutos: async () => {
    const res = await fetch(`${API_BASE_URL}/produtos`);
    if (!res.ok) throw new Error("Erro ao buscar produtos");
    return res.json();
  },

  getCategorias: async () => {
    const res = await fetch(`${API_BASE_URL}/categorias`);
    if (!res.ok) throw new Error("Erro ao buscar categorias");
    return res.json();
  },

  criarPedido: async (dadosPedido) => {
    const res = await fetch(`${API_BASE_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosPedido),
    });
    if (!res.ok) throw new Error("Erro ao enviar pedido");
    return res.json();
  },
};
