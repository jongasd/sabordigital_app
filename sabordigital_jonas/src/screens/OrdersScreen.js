import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CartItem from "../components/CartItem";
import { api } from "../services/api";

export default function OrdersScreen({
  cart,
  onUpdateQuantity,
  onClearCart,
  onGoToHome,
  currentUser,
}) {
  const [activeTab, setActiveTab] = useState("carrinho"); // "carrinho" | "historico"
  const [clienteNome, setClienteNome] = useState(currentUser?.nome || "");
  const [submitting, setSubmitting] = useState(false);

  // Historico de pedidos
  const [pedidosHistorico, setPedidosHistorico] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  useEffect(() => {
    if (currentUser?.nome) {
      setClienteNome(currentUser.nome);
    }
  }, [currentUser]);

  const loadHistorico = async () => {
    setLoadingHistorico(true);
    try {
      const data = await api.getPedidos();
      setPedidosHistorico(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistorico(false);
    }
  };

  useEffect(() => {
    if (activeTab === "historico") {
      loadHistorico();
    }
  }, [activeTab]);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.preco || item.price || 0) * item.quantity,
    0
  );

  const handleSendOrder = async () => {
    if (cart.length === 0) return;
    if (!clienteNome.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do cliente.");
      return;
    }

    const payloadItens = cart.map((item) => ({
      produto_id: item.id,
      quantidade: item.quantity,
    }));

    setSubmitting(true);
    try {
      await api.createPedido({
        cliente: clienteNome,
        itens: payloadItens,
      });

      Alert.alert(
        "Sucesso! 🎉",
        "Seu pedido foi enviado para a cozinha com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              onClearCart();
              setActiveTab("historico");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível enviar seu pedido."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Alterar Status (Admin)
  const handleChangeStatus = (pedidoId, currentStatus) => {
    const statusOptions = [
      { label: "Pendente", value: "pendente" },
      { label: "Em Preparo", value: "preparo" },
      { label: "Pronto", value: "pronto" },
      { label: "Entregue", value: "entregue" },
    ];

    Alert.alert(
      "Atualizar Status do Pedido",
      `Selecione o novo status para o Pedido #${pedidoId}:`,
      statusOptions.map((opt) => ({
        text: opt.label,
        onPress: async () => {
          try {
            await api.updatePedidoStatus(pedidoId, opt.value);
            Alert.alert("Status Atualizado", `Pedido #${pedidoId} agora é ${opt.label}`);
            loadHistorico();
          } catch (err) {
            Alert.alert("Erro", err.message || "Falha ao alterar status.");
          }
        },
      }))
    );
  };

  // Deletar Pedido (Admin)
  const handleDeletePedido = (pedidoId) => {
    Alert.alert(
      "Cancelar/Excluir Pedido",
      `Deseja realmente apagar o Pedido #${pedidoId}?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deletePedido(pedidoId);
              Alert.alert("Sucesso", "Pedido excluído.");
              loadHistorico();
            } catch (err) {
              Alert.alert("Erro", err.message || "Não foi possível excluir pedido.");
            }
          },
        },
      ]
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "preparo":
        return { label: "Em Preparo", bg: "#EBF8FF", color: "#3182CE" };
      case "pronto":
        return { label: "Pronto", bg: "#C6F6D5", color: "#22543D" };
      case "entregue":
        return { label: "Entregue", bg: "#E9D8FD", color: "#553C9A" };
      default:
        return { label: "Pendente", bg: "#FEEBC8", color: "#C05621" };
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER SWITCH */}
      <View style={styles.headerTabContainer}>
        <TouchableOpacity
          style={[styles.headerTab, activeTab === "carrinho" && styles.headerTabActive]}
          onPress={() => setActiveTab("carrinho")}
        >
          <Ionicons
            name="cart-outline"
            size={18}
            color={activeTab === "carrinho" ? "#FF5722" : "#718096"}
          />
          <Text
            style={[
              styles.headerTabText,
              activeTab === "carrinho" && styles.headerTabTextActive,
            ]}
          >
            Meu Carrinho ({cart.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.headerTab, activeTab === "historico" && styles.headerTabActive]}
          onPress={() => setActiveTab("historico")}
        >
          <Ionicons
            name="time-outline"
            size={18}
            color={activeTab === "historico" ? "#FF5722" : "#718096"}
          />
          <Text
            style={[
              styles.headerTabText,
              activeTab === "historico" && styles.headerTabTextActive,
            ]}
          >
            Histórico (API)
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO */}
      {activeTab === "carrinho" ? (
        cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="#CBD5E0" />
            <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
            <Text style={styles.emptySub}>
              Adicione itens deliciosos do cardápio para fazer um pedido.
            </Text>
            <TouchableOpacity style={styles.browseButton} onPress={onGoToHome}>
              <Text style={styles.browseButtonText}>Ver Cardápio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <CartItem item={item} onUpdateQuantity={onUpdateQuantity} />
              )}
              contentContainerStyle={styles.listContainer}
            />

            {/* FORM CLIENTE & RESUMO */}
            <View style={styles.summaryCard}>
              <View style={styles.clientGroup}>
                <Text style={styles.clientLabel}>Nome do Cliente para o Pedido *</Text>
                <TextInput
                  style={styles.clientInput}
                  placeholder="Ex: Maria Oliveira"
                  value={clienteNome}
                  onChangeText={setClienteNome}
                />
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal da Comanda</Text>
                <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Previsto</Text>
                <Text style={styles.totalValue}>R$ {subtotal.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSendOrder}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Confirmar Pedido (POST /pedidos)</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )
      ) : (
        /* HISTÓRICO DE PEDIDOS */
        <ScrollView style={styles.historicoContainer}>
          {loadingHistorico ? (
            <ActivityIndicator size="large" color="#FF5722" style={{ marginTop: 30 }} />
          ) : pedidosHistorico.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color="#CBD5E0" />
              <Text style={styles.emptyTitle}>Nenhum pedido cadastrado</Text>
            </View>
          ) : (
            pedidosHistorico.map((ped) => {
              const badge = getStatusBadge(ped.status);
              return (
                <View key={ped.id} style={styles.pedidoCard}>
                  <View style={styles.pedidoHeader}>
                    <Text style={styles.pedidoId}>Pedido #{ped.id}</Text>
                    <View style={[styles.badgePill, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.color }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.pedidoCliente}>
                    👤 Cliente: <Text style={{ fontWeight: "bold" }}>{ped.cliente || "Não informado"}</Text>
                  </Text>
                  <Text style={styles.pedidoTotal}>
                    💰 Total: R$ {Number(ped.total || 0).toFixed(2)}
                  </Text>

                  {/* Ações de Admin */}
                  {currentUser?.papel === "admin" && (
                    <View style={styles.adminActions}>
                      <TouchableOpacity
                        style={styles.statusBtn}
                        onPress={() => handleChangeStatus(ped.id, ped.status)}
                      >
                        <Ionicons name="create-outline" size={16} color="#2B6CB0" />
                        <Text style={styles.statusBtnText}>Alterar Status</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteOrderBtn}
                        onPress={() => handleDeletePedido(ped.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#E53E3E" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  headerTabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  headerTabActive: { borderBottomWidth: 2, borderBottomColor: "#FF5722" },
  headerTabText: { color: "#718096", fontWeight: "600", fontSize: 13 },
  headerTabTextActive: { color: "#FF5722", fontWeight: "bold" },
  listContainer: { paddingVertical: 12 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: "#718096",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  summaryCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    elevation: 4,
  },
  clientGroup: { marginBottom: 10 },
  clientLabel: { fontSize: 12, fontWeight: "bold", color: "#4A5568", marginBottom: 4 },
  clientInput: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: { color: "#718096", fontSize: 13 },
  summaryValue: { color: "#2D3748", fontSize: 13, fontWeight: "500" },
  totalRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
  },
  totalLabel: { fontSize: 15, fontWeight: "bold", color: "#1A1D20" },
  totalValue: { fontSize: 17, fontWeight: "bold", color: "#FF5722" },
  submitButton: {
    backgroundColor: "#FF5722",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
  historicoContainer: { padding: 16 },
  pedidoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pedidoId: { fontSize: 15, fontWeight: "bold", color: "#2D3748" },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: { fontSize: 11, fontWeight: "bold" },
  pedidoCliente: { fontSize: 13, color: "#4A5568", marginBottom: 4 },
  pedidoTotal: { fontSize: 14, fontWeight: "bold", color: "#FF5722" },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
  },
  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBtnText: { color: "#2B6CB0", fontSize: 12, fontWeight: "bold" },
  deleteOrderBtn: { padding: 6 },
});
