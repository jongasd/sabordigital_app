import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CartItem({ item, onUpdateQuantity }) {
  const itemTotal = Number(item.price || 0) * item.quantity;

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.image || "https://via.placeholder.com/100?text=Sem+Imagem",
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>R$ {itemTotal.toFixed(2)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => onUpdateQuantity(item.id, -1)}
        >
          <Ionicons name="remove" size={16} color="#FF5722" />
        </TouchableOpacity>
        <Text style={styles.qty}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => onUpdateQuantity(item.id, 1)}
        >
          <Ionicons name="add" size={16} color="#FF5722" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2D3748",
  },
  price: {
    fontSize: 13,
    color: "#FF5722",
    fontWeight: "600",
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  btn: {
    padding: 8,
  },
  qty: {
    fontSize: 13,
    fontWeight: "bold",
    paddingHorizontal: 8,
  },
});
