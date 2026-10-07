import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, getImageUrl } from "../services/api";

export default function ProductDetailModal({
  visible,
  productId,
  onClose,
  onAddToCart,
}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && productId) {
      setLoading(true);
      api
        .getProdutoById(productId)
        .then((data) => setProduct(data))
        .catch(() => setProduct(null))
        .finally(() => setLoading(false));
    } else {
      setProduct(null);
    }
  }, [visible, productId]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF5722" />
            </View>
          ) : product ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image
                source={{ uri: getImageUrl(product.imagem) }}
                style={styles.image}
              />

              <View style={styles.content}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {product.categoria || "Geral"}
                  </Text>
                </View>

                <Text style={styles.title}>{product.nome}</Text>
                <Text style={styles.price}>
                  R$ {Number(product.preco || 0).toFixed(2)}
                </Text>

                <Text style={styles.description}>
                  {product.descricao || "Sem descrição disponível."}
                </Text>

                <View style={styles.statusRow}>
                  <Ionicons
                    name={product.disponivel ? "checkmark-circle" : "close-circle"}
                    size={18}
                    color={product.disponivel ? "#38A169" : "#E53E3E"}
                  />
                  <Text style={styles.statusText}>
                    {product.disponivel ? "Disponível para pedido" : "Indisponível no momento"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    !product.disponivel && styles.addBtnDisabled,
                  ]}
                  disabled={!product.disponivel}
                  onPress={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                >
                  <Ionicons name="cart" size={20} color="#FFF" />
                  <Text style={styles.addBtnText}>Adicionar ao Pedido</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.errorText}>Produto não encontrado.</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    overflow: "hidden",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
  loadingContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 220,
    backgroundColor: "#EDF2F7",
  },
  content: { padding: 20 },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEEBC8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: { color: "#C05621", fontSize: 12, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1A202C", marginBottom: 6 },
  price: { fontSize: 20, fontWeight: "bold", color: "#FF5722", marginBottom: 12 },
  description: { fontSize: 14, color: "#4A5568", lineHeight: 20, marginBottom: 16 },
  statusRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  statusText: { marginLeft: 6, fontSize: 13, color: "#718096" },
  addBtn: {
    backgroundColor: "#FF5722",
    borderRadius: 12,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addBtnDisabled: { backgroundColor: "#CBD5E0" },
  addBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "#E53E3E", fontSize: 15 },
});
