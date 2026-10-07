import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({ cartCount, onOpenOrders }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>SABOR DIGITAL</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={16} color="#FF5722" />
          <Text style={styles.locationText}>Entregar em meu endereço</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.cartBtn} onPress={onOpenOrders}>
        <Ionicons name="cart-outline" size={26} color="#1A1D20" />
        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF5722",
    letterSpacing: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    marginLeft: 4,
  },
  cartBtn: {
    position: "relative",
    padding: 6,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF5722",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
