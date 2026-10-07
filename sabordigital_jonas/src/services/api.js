let API_BASE_URL = "http://10.0.2.2:3000";
let userToken = null;

export const setBaseUrl = (url) => {
  if (!url) return;
  API_BASE_URL = url.replace(/\/$/, "");
};

export const getBaseUrl = () => API_BASE_URL;

export const setAuthToken = (token) => {
  userToken = token;
};

export const getAuthToken = () => userToken;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/300?text=Sabor+Digital";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${cleanPath}`;
};

const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  if (userToken) {
    headers["Authorization"] = `Bearer ${userToken}`;
  }
  return headers;
};

export const api = {
  // Autenticação
  registrar: async (dados) => {
    const res = await fetch(`${API_BASE_URL}/auth/registrar`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dados),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || "Erro ao registrar usuário");
    return json;
  },

  login: async (email, senha) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, senha }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || "Erro ao realizar login");
    if (json.token) setAuthToken(json.token);
    return json;
  },

  // Produtos
  getProdutos: async () => {
    const res = await fetch(`${API_BASE_URL}/produtos`);
    if (!res.ok) throw new Error("Erro ao buscar produtos");
    const json = await res.json();
    return json.dados || json || [];
  },

  getProdutoById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/produtos/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar detalhes do produto");
    const json = await res.json();
    return json.dados || json;
  },

  createProduto: async (formDataOrObject) => {
    const isFormData = typeof FormData !== "undefined" && formDataOrObject instanceof FormData;
    const res = await fetch(`${API_BASE_URL}/produtos`, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? formDataOrObject : JSON.stringify(formDataOrObject),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || "Erro ao cadastrar produto");
    return json;
  },

  updateProduto: async (id, formDataOrObject) => {
    const isFormData = typeof FormData !== "undefined" && formDataOrObject instanceof FormData;
    const res = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: "PUT",
      headers: getHeaders(isFormData),
      body: isFormData ? formDataOrObject : JSON.stringify(formDataOrObject),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || "Erro ao atualizar produto");
    return json;
  },

  deleteProduto: async (id) => {
    const res = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || "Erro ao deletar produto");
    return json;
  },

  // Cardápios
  getCardapios: async () => {
    const res = await fetch(`${API_BASE_URL}/cardapios`);
    if (!res.ok) throw new Error("Erro ao buscar cardápios");
    const json = await res.json();
    return json.dados || json || [];
  },

  getCardapioById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/cardapios/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar detalhes do cardápio");
    const json = await res.json();
    return json.dados || json;
  },

  createCardapio: async (dadosCardapio) => {
    const res = await fetch(`${API_BASE_URL}/cardapios`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dadosCardapio),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || "Erro ao criar cardápio");
    return json;
  },

  deleteCardapio: async (id) => {
    const res = await fetch(`${API_BASE_URL}/cardapios/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || "Erro ao remover cardápio");
    return json;
  },

  // Pedidos
  createPedido: async (dadosPedido) => {
    const res = await fetch(`${API_BASE_URL}/pedidos`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dadosPedido),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || json.erro || "Erro ao enviar pedido");
    return json;
  },

  getPedidos: async () => {
    const res = await fetch(`${API_BASE_URL}/pedidos`);
    if (!res.ok) throw new Error("Erro ao carregar lista de pedidos");
    return res.json(); // Pedidos retornam objeto direto / array
  },

  getPedidoById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/pedidos/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar pedido por ID");
    return res.json();
  },

  updatePedidoStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/pedidos/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || "Erro ao atualizar status do pedido");
    return json;
  },

  deletePedido: async (id) => {
    const res = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || "Erro ao deletar pedido");
    return json;
  },
};
