import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import { api } from "../services/api";

export default function HomeScreen({
  onAddToCart,
  cartCount,
  onOpenOrders,
  onOpenAuth,
  onOpenIpConfig,
  currentUser,
  onLogout,
}) {
  const [products, setProducts] = useState([]);
  const [cardapios, setCardapios] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Detail Modal
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const loadData = async () => {
    try {
      const [prodsData, cardsData] = await Promise.all([
        api.getProdutos().catch(() => []),
        api.getCardapios().catch(() => []),
      ]);

      setProducts(prodsData || []);
      setCardapios(cardsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Extrair categorias únicas + cardápios
  const filterOptions = ["Todos"];

  // Adiciona categorias dos produtos
  products.forEach((p) => {
    if (p.categoria && !filterOptions.includes(p.categoria)) {
      filterOptions.push(p.categoria);
    }
  });

  const filteredProducts = products.filter((p) => {
    const nome = p.nome || p.name || "";
    const cat = p.categoria || p.category || "";

    const matchFilter = selectedFilter === "Todos" || cat === selectedFilter;
    const matchSearch = nome.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleOpenDetail = (id) => {
    setSelectedProductId(id);
    setDetailVisible(true);
  };

  const handleDeleteProduct = (id, nome) => {
    Alert.alert(
      "Remover Produto",
      `Deseja deletar o produto "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deleteProduto(id);
              Alert.alert("Sucesso", "Produto deletado!");
              loadData();
            } catch (err) {
              Alert.alert("Erro", err.message || "Não foi possível deletar.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        cartCount={cartCount}
        onOpenOrders={onOpenOrders}
        onOpenAuth={onOpenAuth}
        onOpenIpConfig={onOpenIpConfig}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            colors={["#FF5722"]}
          />
        }
      >
        {/* BARRA DE PESQUISA */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar no cardápio..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* CATEGORIAS / FILTROS */}
        <Text style={styles.sectionTitle}>Filtros & Categorias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {filterOptions.map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.catCard, isSelected && styles.catCardSelected]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[styles.catText, isSelected && styles.catTextSelected]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* CARDÁPIOS ATIVOS */}
        {cardapios.length > 0 && (
          <View style={styles.cardapiosBanner}>
            <Text style={styles.bannerTitle}>Cardápios Especiais</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cardapios.map((c) => (
                <View key={c.id} style={styles.cardapioPill}>
                  <Ionicons name="restaurant" size={14} color="#FF5722" />
                  <Text style={styles.cardapioPillText}>{c.nome}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* LISTA DE PRODUTOS */}
        <Text style={styles.sectionTitle}>Cardápio Principal</Text>
        {loading ? (
          <ActivityIndicator
            color="#FF5722"
            size="large"
            style={{ marginTop: 20 }}
          />
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="nutrition-outline" size={50} color="#CBD5E0" />
            <Text style={styles.emptyText}>
              Nenhum produto encontrado na API.
            </Text>
          </View>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenDetail={handleOpenDetail}
              onDeleteProduct={handleDeleteProduct}
              isAdmin={currentUser?.papel === "admin"}
            />
          ))
        )}
      </ScrollView>

      {/* MODAL DETALHE DO PRODUTO */}
      <ProductDetailModal
        visible={detailVisible}
        productId={selectedProductId}
        onClose={() => setDetailVisible(false)}
        onAddToCart={onAddToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 8,
    color: "#2D3748",
  },
  categoriesContainer: { paddingLeft: 16, marginBottom: 14 },
  catCard: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  catCardSelected: { backgroundColor: "#FF5722", borderColor: "#FF5722" },
  catText: { color: "#4A5568", fontWeight: "500", fontSize: 13 },
  catTextSelected: { color: "#FFF", fontWeight: "bold" },
  cardapiosBanner: {
    backgroundColor: "#FFFEE0",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F6E05E",
  },
  bannerTitle: { fontSize: 13, fontWeight: "bold", color: "#B7791F", marginBottom: 6 },
  cardapioPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ECC94B",
    gap: 4,
  },
  cardapioPillText: { fontSize: 12, color: "#744210", fontWeight: "600" },
  emptyContainer: { alignItems: "center", marginTop: 30 },
  emptyText: { textAlign: "center", color: "#A0AEC0", marginTop: 8 },
});
