import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { api } from "../services/api";

export default function HomeScreen({ onAddToCart, cartCount, onOpenOrders }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: "all", name: "Todos" }]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [dataProducts, dataCategories] = await Promise.all([
        api.getProdutos().catch(() => []),
        api.getCategorias().catch(() => []),
      ]);

      setProducts(dataProducts);
      if (dataCategories.length > 0) {
        setCategories([{ id: "all", name: "Todos" }, ...dataCategories]);
      }
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

  const filteredProducts = products.filter((p) => {
    const matchCat =
      selectedCategory === "Todos" || p.category === selectedCategory;
    const matchSearch = p.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={styles.container}>
      <Header cartCount={cartCount} onOpenOrders={onOpenOrders} />

      <ScrollView
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

        {/* CATEGORIAS */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id || cat.name}
                style={[styles.catCard, isSelected && styles.catCardSelected]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Text
                  style={[styles.catText, isSelected && styles.catTextSelected]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* LISTA DE PRODUTOS */}
        <Text style={styles.sectionTitle}>Cardápio</Text>
        {loading ? (
          <ActivityIndicator
            color="#FF5722"
            size="large"
            style={{ marginTop: 20 }}
          />
        ) : filteredProducts.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum produto encontrado no banco.
          </Text>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))
        )}
      </ScrollView>
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
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 10,
  },
  categoriesContainer: { paddingLeft: 16, marginBottom: 16 },
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
  catText: { color: "#4A5568", fontWeight: "500" },
  catTextSelected: { color: "#FFF", fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#A0AEC0", marginTop: 20 },
});
