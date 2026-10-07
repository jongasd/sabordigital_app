import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getImageUrl } from "../services/api";

export default function ProductCard({
  product,
  onAddToCart,
  onOpenDetail,
  onDeleteProduct,
  isAdmin,
}) {
  const imageUrl = getImageUrl(product.imagem || product.image);
  const nome = product.nome || product.name;
  const descricao = product.descricao || product.description;
  const preco = Number(product.preco || product.price || 0);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onOpenDetail && onOpenDetail(product.id)}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {nome}
          </Text>
          {isAdmin && onDeleteProduct && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDeleteProduct(product.id, nome)}
            >
              <Ionicons name="trash-outline" size={18} color="#E53E3E" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.desc} numberOfLines={2}>
          {descricao}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>R$ {preco.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => onAddToCart(product)}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EDF2F7",
    elevation: 2,
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A1D20",
    flex: 1,
  },
  deleteBtn: { padding: 2 },
  desc: {
    fontSize: 12,
    color: "#718096",
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FF5722",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5722",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 2,
  },
});
