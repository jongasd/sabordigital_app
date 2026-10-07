import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            product.image || "https://via.placeholder.com/150?text=Sem+Imagem",
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>
            R$ {Number(product.price || 0).toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => onAddToCart(product)}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A1D20",
  },
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
