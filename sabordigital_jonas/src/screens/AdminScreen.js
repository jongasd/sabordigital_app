import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";

export default function AdminScreen({ currentUser }) {
  const [activeSubTab, setActiveSubTab] = useState("produtos"); // "produtos" | "cardapios"
  const [loading, setLoading] = useState(false);

  // Form Produto State
  const [pNome, setPNome] = useState("");
  const [pDescricao, setPDescricao] = useState("");
  const [pPreco, setPPreco] = useState("");
  const [pCategoria, setPCategoria] = useState("Massa");
  const [pImagem, setPImagem] = useState("");
  const [pDisponivel, setPDisponivel] = useState(true);

  // Form Cardapio State
  const [cNome, setCNome] = useState("");
  const [cDescricao, setCDescricao] = useState("");
  const [cDisponivel, setCDisponivel] = useState(true);
  const [cProdutosSelected, setCProdutosSelected] = useState([]);

  // Data lists
  const [productsList, setProductsList] = useState([]);
  const [cardapiosList, setCardapiosList] = useState([]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [prods, cards] = await Promise.all([
        api.getProdutos().catch(() => []),
        api.getCardapios().catch(() => []),
      ]);
      setProductsList(prods);
      setCardapiosList(cards);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Cadastrar Produto
  const handleCreateProduto = async () => {
    if (!pNome || !pDescricao || !pPreco) {
      Alert.alert("Erro", "Nome, descrição e preço são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      await api.createProduto({
        nome: pNome,
        descricao: pDescricao,
        preco: parseFloat(pPreco.replace(",", ".")),
        categoria: pCategoria,
        disponivel: pDisponivel,
        imagem: pImagem || undefined,
      });

      Alert.alert("Sucesso!", "Produto cadastrado com sucesso.");
      setPNome("");
      setPDescricao("");
      setPPreco("");
      setPImagem("");
      loadAdminData();
    } catch (err) {
      Alert.alert("Erro", err.message || "Não foi possível cadastrar produto.");
    } finally {
      setLoading(false);
    }
  };

  // Cadastrar Cardápio
  const handleCreateCardapio = async () => {
    if (!cNome) {
      Alert.alert("Erro", "O nome do cardápio é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      await api.createCardapio({
        nome: cNome,
        descricao: cDescricao,
        disponivel: cDisponivel,
        produtos: cProdutosSelected,
      });

      Alert.alert("Sucesso!", "Cardápio criado com sucesso.");
      setCNome("");
      setCDescricao("");
      setCProdutosSelected([]);
      loadAdminData();
    } catch (err) {
      Alert.alert("Erro", err.message || "Não foi possível criar cardápio.");
    } finally {
      setLoading(false);
    }
  };

  // Deletar Cardápio
  const handleDeleteCardapio = async (id, nome) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente remover o cardápio "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deleteCardapio(id);
              Alert.alert("Sucesso", "Cardápio removido com sucesso.");
              loadAdminData();
            } catch (err) {
              Alert.alert("Erro", err.message || "Erro ao remover cardápio.");
            }
          },
        },
      ]
    );
  };

  const toggleSelectProductForCardapio = (id) => {
    setCProdutosSelected((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  if (!currentUser || currentUser.papel !== "admin") {
    return (
      <View style={styles.unauthContainer}>
        <Ionicons name="shield-outline" size={64} color="#CBD5E0" />
        <Text style={styles.unauthTitle}>Acesso Restrito</Text>
        <Text style={styles.unauthSub}>
          Esta área é restrita a administradores logados com token válido.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sub Tabs */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.subTab, activeSubTab === "produtos" && styles.activeSubTab]}
          onPress={() => setActiveSubTab("produtos")}
        >
          <Ionicons
            name="fast-food-outline"
            size={18}
            color={activeSubTab === "produtos" ? "#FF5722" : "#718096"}
          />
          <Text
            style={[
              styles.subTabText,
              activeSubTab === "produtos" && styles.activeSubTabText,
            ]}
          >
            Cadastrar Produto
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTab, activeSubTab === "cardapios" && styles.activeSubTab]}
          onPress={() => setActiveSubTab("cardapios")}
        >
          <Ionicons
            name="restaurant-outline"
            size={18}
            color={activeSubTab === "cardapios" ? "#FF5722" : "#718096"}
          />
          <Text
            style={[
              styles.subTabText,
              activeSubTab === "cardapios" && styles.activeSubTabText,
            ]}
          >
            Gerenciar Cardápios
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSubTab === "produtos" ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Novo Produto (POST /produtos)</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Produto *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Pizza Quatro Queijos"
                value={pNome}
                onChangeText={setPNome}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                style={[styles.input, { height: 70 }]}
                placeholder="Massa crocante, mussarela, gorgonzola, parmesão..."
                multiline
                value={pDescricao}
                onChangeText={setPDescricao}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Preço (R$) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="45.90"
                  keyboardType="decimal-pad"
                  value={pPreco}
                  onChangeText={setPPreco}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>Categoria</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Pizza, Massa, Bebida..."
                  value={pCategoria}
                  onChangeText={setPCategoria}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL da Imagem (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://exemplo.com/foto.jpg ou /public/uploads/..."
                value={pImagem}
                onChangeText={setPImagem}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Disponível no Cardápio</Text>
              <Switch
                value={pDisponivel}
                onValueChange={setPDisponivel}
                trackColor={{ true: "#FF5722", false: "#CBD5E0" }}
              />
            </View>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleCreateProduto}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={20} color="#FFF" />
                  <Text style={styles.saveBtnText}>Salvar Produto</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* Form Criar Cardápio */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Novo Cardápio (POST /cardapios)</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome do Cardápio *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Almoço Executivo / Promoção de Sexta"
                  value={cNome}
                  onChangeText={setCNome}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Descrição das opções..."
                  value={cDescricao}
                  onChangeText={setCDescricao}
                />
              </View>

              <Text style={styles.label}>Selecionar Produtos inclusos:</Text>
              {productsList.map((prod) => {
                const isSelected = cProdutosSelected.includes(prod.id);
                return (
                  <TouchableOpacity
                    key={prod.id}
                    style={[
                      styles.prodCheckItem,
                      isSelected && styles.prodCheckItemSelected,
                    ]}
                    onPress={() => toggleSelectProductForCardapio(prod.id)}
                  >
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={20}
                      color={isSelected ? "#FF5722" : "#718096"}
                    />
                    <Text style={styles.prodCheckText}>
                      #{prod.id} - {prod.nome} (R$ {Number(prod.preco).toFixed(2)})
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleCreateCardapio}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="journal-outline" size={20} color="#FFF" />
                    <Text style={styles.saveBtnText}>Criar Cardápio</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Lista de Cardápios Existentes */}
            <Text style={styles.sectionTitle}>Cardápios Cadastrados</Text>
            {cardapiosList.map((c) => (
              <View key={c.id} style={styles.cardapioItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardapioName}>{c.nome}</Text>
                  <Text style={styles.cardapioDesc}>{c.descricao}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteCardapio(c.id, c.nome)}
                >
                  <Ionicons name="trash-outline" size={22} color="#E53E3E" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  unauthContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  unauthTitle: { fontSize: 20, fontWeight: "bold", color: "#2D3748", marginTop: 12 },
  unauthSub: { fontSize: 14, color: "#718096", textAlign: "center", marginTop: 6 },
  tabHeader: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  subTab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  activeSubTab: { borderBottomWidth: 2, borderBottomColor: "#FF5722" },
  subTabText: { color: "#718096", fontWeight: "600", fontSize: 13 },
  activeSubTabText: { color: "#FF5722", fontWeight: "bold" },
  content: { padding: 16 },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    elevation: 2,
  },
  formTitle: { fontSize: 16, fontWeight: "bold", color: "#2D3748", marginBottom: 14 },
  inputGroup: { marginBottom: 12 },
  row: { flexDirection: "row" },
  label: { fontSize: 12, fontWeight: "bold", color: "#4A5568", marginBottom: 4 },
  input: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  saveBtn: {
    backgroundColor: "#FF5722",
    borderRadius: 10,
    height: 46,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  saveBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
  prodCheckItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#F7FAFC",
    marginBottom: 6,
    gap: 8,
  },
  prodCheckItemSelected: { backgroundColor: "#FEEBC8" },
  prodCheckText: { fontSize: 13, color: "#2D3748" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#2D3748", marginBottom: 10 },
  cardapioItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  cardapioName: { fontSize: 15, fontWeight: "bold", color: "#2D3748" },
  cardapioDesc: { fontSize: 12, color: "#718096" },
});
