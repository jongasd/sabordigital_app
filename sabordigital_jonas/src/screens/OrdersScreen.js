import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
}) {
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0,
  );
  const deliveryFee = cart.length > 0 ? 5.0 : 0.0;
  const total = subtotal + deliveryFee;

  const handleSendOrder = async () => {
    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      await api.criarPedido({
        itens: cart,
        subtotal: subtotal,
        taxaEntrega: deliveryFee,
        total: total,
        data: new Date().toISOString(),
      });

      Alert.alert(
        "Sucesso! 🎉",
        "Seu pedido foi enviado para a cozinha com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              onClearCart();
              onGoToHome();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar seu pedido. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER DA TELA */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={onClearCart}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CONTEÚDO */}
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#CBD5E0" />
          <Text style={styles.emptyTitle}>Seu pedido está vazio</Text>
          <Text style={styles.emptySub}>
            Adicione itens do cardápio para fazer um pedido.
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

          {/* RESUMO DO PEDIDO */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxa de Entrega</Text>
              <Text style={styles.summaryValue}>
                R$ {deliveryFee.toFixed(2)}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
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
                  <Text style={styles.submitButtonText}>Confirmar Pedido</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1A1D20" },
  clearText: { color: "#E53E3E", fontSize: 13, fontWeight: "bold" },
  listContainer: { paddingVertical: 12 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
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
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: { color: "#718096", fontSize: 13 },
  summaryValue: { color: "#2D3748", fontSize: 13, fontWeight: "500" },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
  },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#1A1D20" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#FF5722" },
  submitButton: {
    backgroundColor: "#FF5722",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 8,
  },
});
