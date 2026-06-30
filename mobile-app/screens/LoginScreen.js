import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator, Alert
} from "react-native";
import axios from "axios";

const API_URL = "http://192.168.18.185:3000";

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert("Error", "Ingresa tu correo y contraseña");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        correo,
        password,
      });

      navigation.replace("Dashboard", { user: data.user, token: data.token });

    } catch (error) {
      Alert.alert("Error", "Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Image
          source={require("../assets/LOGO_COGAE.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>GeoAsist</Text>
        <Text style={styles.subtitle}>COGAE · Sistema de Asistencia</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#94a3b8"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#162010",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 28,
  },
  input: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1e293b",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#2D5016",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});