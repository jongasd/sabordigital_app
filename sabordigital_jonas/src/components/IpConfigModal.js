import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { setBaseUrl, getBaseUrl } from "../services/api";

export default function IpConfigModal({ visible, onClose, onSave }) {
  const [ipUrl, setIpUrl] = useState(getBaseUrl());

  const handleSave = () => {
    if (!ipUrl) {
      Alert.alert("Erro", "O IP não pode estar em branco.");
      return;
    }
    setBaseUrl(ipUrl);
    Alert.alert("Configuração Atualizada", `Endereço da API ajustado para:\n${ipUrl}`);
    if (onSave) onSave(ipUrl);
    onClose();
  };

  const applyPreset = (preset) => {
    setIpUrl(preset);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Servidor Backend (IP)</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#718096" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtext}>
            No celular/emulador o `localhost` aponta para o próprio aparelho. Ajuste a URL para conectar à sua API:
          </Text>

          <TextInput
            style={styles.input}
            value={ipUrl}
            onChangeText={setIpUrl}
            placeholder="http://192.168.0.10:3000"
            autoCapitalize="none"
          />

          <Text style={styles.presetsTitle}>Atalhos rápidos:</Text>
          <View style={styles.presetsContainer}>
            <TouchableOpacity
              style={styles.presetBtn}
              onPress={() => applyPreset("http://10.0.2.2:3000")}
            >
              <Text style={styles.presetText}>Emulador Android (10.0.2.2)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetBtn}
              onPress={() => applyPreset("http://localhost:3000")}
            >
              <Text style={styles.presetText}>Navegador Web / iOS (localhost)</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Salvar Endereço</Text>
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
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#2D3748" },
  subtext: { fontSize: 12, color: "#718096", marginBottom: 14 },
  input: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: "#2D3748",
  },
  presetsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4A5568",
    marginTop: 14,
    marginBottom: 6,
  },
  presetsContainer: { gap: 6 },
  presetBtn: {
    backgroundColor: "#EDF2F7",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  presetText: { fontSize: 12, color: "#2B6CB0", fontWeight: "600" },
  saveBtn: {
    backgroundColor: "#FF5722",
    borderRadius: 10,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  saveBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
});
