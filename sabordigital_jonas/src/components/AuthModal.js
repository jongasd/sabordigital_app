import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";

export default function AuthModal({ visible, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form states
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState("cliente");

  const handleSubmit = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    if (!isLogin && !nome) {
      Alert.alert("Atenção", "Preencha seu nome.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.login(email, senha);
        Alert.alert("Bem-vindo!", `Olá, ${res.usuario?.nome || "usuário"}!`);
        onLoginSuccess(res.usuario, res.token);
        onClose();
      } else {
        await api.registrar({ nome, email, senha, papel });
        Alert.alert(
          "Sucesso!",
          "Conta criada com sucesso. Faça login para continuar."
        );
        setIsLogin(true);
      }
    } catch (err) {
      Alert.alert("Erro de Autenticação", err.message || "Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isLogin ? "Entrar na Conta" : "Criar Nova Conta"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#718096" />
            </TouchableOpacity>
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.activeTab]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.activeTab]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                Cadastrar
              </Text>
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: João Silva"
                value={nome}
                onChangeText={setNome}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="******"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Perfil</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleBtn,
                    papel === "cliente" && styles.roleBtnActive,
                  ]}
                  onPress={() => setPapel("cliente")}
                >
                  <Text
                    style={[
                      styles.roleText,
                      papel === "cliente" && styles.roleTextActive,
                    ]}
                  >
                    Cliente
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleBtn,
                    papel === "admin" && styles.roleBtnActive,
                  ]}
                  onPress={() => setPapel("admin")}
                >
                  <Text
                    style={[
                      styles.roleText,
                      papel === "admin" && styles.roleTextActive,
                    ]}
                  >
                    Administrador
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isLogin ? "Entrar" : "Finalizar Cadastro"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#2D3748" },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#EDF2F7",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 6 },
  activeTab: { backgroundColor: "#FFF" },
  tabText: { color: "#718096", fontWeight: "600" },
  activeTabText: { color: "#FF5722", fontWeight: "bold" },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: "bold", color: "#4A5568", marginBottom: 4 },
  input: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  roleContainer: { flexDirection: "row", marginTop: 4 },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    alignItems: "center",
    marginRight: 6,
  },
  roleBtnActive: { backgroundColor: "#FF5722", borderColor: "#FF5722" },
  roleText: { color: "#4A5568", fontWeight: "600" },
  roleTextActive: { color: "#FFF", fontWeight: "bold" },
  submitBtn: {
    backgroundColor: "#FF5722",
    borderRadius: 10,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitBtnText: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
});
