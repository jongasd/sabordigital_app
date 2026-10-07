import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({
  cartCount,
  onOpenOrders,
  onOpenAuth,
  onOpenIpConfig,
  currentUser,
  onLogout,
}) {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <Text style={styles.title}>SABOR DIGITAL</Text>

        <TouchableOpacity style={styles.ipBtn} onPress={onOpenIpConfig}>
          <Ionicons name="hardware-chip-outline" size={14} color="#718096" />
          <Text style={styles.ipBtnText}>API Config</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightContainer}>
        {currentUser ? (
          <TouchableOpacity style={styles.userBadge} onPress={onLogout}>
            <Ionicons
              name={currentUser.papel === "admin" ? "shield-checkmark" : "person-circle"}
              size={18}
              color={currentUser.papel === "admin" ? "#D69E2E" : "#3182CE"}
            />
            <Text style={styles.userName} numberOfLines={1}>
              {currentUser.nome} ({currentUser.papel})
            </Text>
            <Ionicons name="log-out-outline" size={16} color="#E53E3E" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={onOpenAuth}>
            <Ionicons name="log-in-outline" size={18} color="#FF5722" />
            <Text style={styles.loginBtnText}>Entrar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.cartBtn} onPress={onOpenOrders}>
          <Ionicons name="cart-outline" size={24} color="#1A1D20" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  leftContainer: { flexDirection: "column" },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF5722",
    letterSpacing: 1,
  },
  ipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ipBtnText: { fontSize: 11, color: "#718096" },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
    maxWidth: 160,
  },
  userName: { fontSize: 11, fontWeight: "bold", color: "#2D3748" },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF5722",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  loginBtnText: { fontSize: 12, fontWeight: "bold", color: "#FF5722" },
  cartBtn: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
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
