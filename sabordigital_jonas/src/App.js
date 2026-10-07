import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import OrdersScreen from "./screens/OrdersScreen";
import AdminScreen from "./screens/AdminScreen";

import AuthModal from "./components/AuthModal";
import IpConfigModal from "./components/IpConfigModal";
import { setAuthToken } from "./services/api";

export default function App() {
  const [currentTab, setCurrentTab] = useState("home"); // "home" | "orders" | "admin"
  const [cart, setCart] = useState([]);

  // Auth User State
  const [currentUser, setCurrentUser] = useState(null);

  // Modals Visibility
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [ipModalVisible, setIpModalVisible] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const handleLoginSuccess = (usuario, token) => {
    setCurrentUser(usuario);
    setAuthToken(token);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* TELA ATIVA */}
      <View style={styles.content}>
        {currentTab === "home" && (
          <HomeScreen
            onAddToCart={addToCart}
            cartCount={cartCount}
            onOpenOrders={() => setCurrentTab("orders")}
            onOpenAuth={() => setAuthModalVisible(true)}
            onOpenIpConfig={() => setIpModalVisible(true)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}

        {currentTab === "orders" && (
          <OrdersScreen
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
            onGoToHome={() => setCurrentTab("home")}
            currentUser={currentUser}
          />
        )}

        {currentTab === "admin" && (
          <AdminScreen currentUser={currentUser} />
        )}
      </View>

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab("home")}
        >
          <Ionicons
            name={currentTab === "home" ? "restaurant" : "restaurant-outline"}
            size={22}
            color={currentTab === "home" ? "#FF5722" : "#888"}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: currentTab === "home" ? "#FF5722" : "#888" },
            ]}
          >
            Cardápio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab("orders")}
        >
          <View style={styles.tabIconContainer}>
            <Ionicons
              name={currentTab === "orders" ? "cart" : "cart-outline"}
              size={22}
              color={currentTab === "orders" ? "#FF5722" : "#888"}
            />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              { color: currentTab === "orders" ? "#FF5722" : "#888" },
            ]}
          >
            Pedidos
          </Text>
        </TouchableOpacity>

        {currentUser?.papel === "admin" && (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentTab("admin")}
          >
            <Ionicons
              name={currentTab === "admin" ? "shield-checkmark" : "shield-outline"}
              size={22}
              color={currentTab === "admin" ? "#FF5722" : "#888"}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: currentTab === "admin" ? "#FF5722" : "#888" },
              ]}
            >
              Painel Admin
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* MODAL DE AUTENTICAÇÃO */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* MODAL DE CONFIGURAÇÃO DE IP DO BACKEND */}
      <IpConfigModal
        visible={ipModalVisible}
        onClose={() => setIpModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  content: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabIconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#FF5722",
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },
});
