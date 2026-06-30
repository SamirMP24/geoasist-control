import { useState, useRef } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import axios from "axios";

const API_URL = "http://192.168.18.185:3000";

export default function DashboardScreen({ route, navigation }) {
  const { user, token } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [location, setLocation] = useState(null);
  const cameraRef = useRef(null);

  const handleAttendance = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus !== "granted") {
        setStatus({ tipo: "error", texto: "Permiso de ubicación denegado" });
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitud = loc.coords.latitude;
      const longitud = loc.coords.longitude;
      setLocation({ latitud, longitud });

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });

      const foto = `data:image/jpeg;base64,${photo.base64}`;

      await axios.post(
        `${API_URL}/api/attendance/register`,
        { latitud, longitud, foto },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus({ tipo: "ok", texto: "Asistencia registrada correctamente" });

    } catch (error) {
      console.error(error);
      setStatus({ tipo: "error", texto: "Error al registrar asistencia" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const initials = user?.nombre
    ?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.welcome}>Bienvenido, {user?.nombre}</Text>
          <Text style={styles.role}>
            {user?.rol === "admin" ? "Administrador" : "Empleado"} · GPS activo
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {status && (
        <View style={[
          styles.statusBox,
          { backgroundColor: status.tipo === "ok" ? "#eaf3de" : "#fcebeb",
            borderColor: status.tipo === "ok" ? "#c0dd97" : "#f7c1c1" }
        ]}>
          <Text style={{
            color: status.tipo === "ok" ? "#3B6D11" : "#A32D2D",
            fontSize: 13, fontWeight: "500",
          }}>
            {status.texto}
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cámara de verificación</Text>

        {permission?.granted ? (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
          />
        ) : (
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionText}>Activar cámara</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAttendance}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Marcar Asistencia</Text>
          )}
        </TouchableOpacity>
      </View>

      {location && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ubicación registrada</Text>
          <View style={styles.coordRow}>
            <View style={styles.coordBox}>
              <Text style={styles.coordLabel}>Latitud</Text>
              <Text style={styles.coordValue}>{location.latitud.toFixed(6)}</Text>
            </View>
            <View style={styles.coordBox}>
              <Text style={styles.coordLabel}>Longitud</Text>
              <Text style={styles.coordValue}>{location.longitud.toFixed(6)}</Text>
            </View>
          </View>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f0" },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16,
    flexDirection: "row", alignItems: "center", gap: 12,
    marginBottom: 16, borderWidth: 0.5, borderColor: "#e2e8f0",
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#C9A84C", justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: "#162010", fontSize: 15, fontWeight: "600" },
  headerInfo: { flex: 1 },
  welcome: { fontSize: 15, fontWeight: "500", color: "#1e293b" },
  role: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  logoutBtn: {
    backgroundColor: "#f1f5f9", borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 0.5, borderColor: "#e2e8f0",
  },
  logoutText: { fontSize: 12, color: "#64748b" },
  statusBox: {
    borderRadius: 8, padding: 12, marginBottom: 16,
    borderWidth: 0.5,
  },
  card: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16,
    marginBottom: 16, borderWidth: 0.5, borderColor: "#e2e8f0",
  },
  cardTitle: { fontSize: 13, fontWeight: "500", color: "#1e293b", marginBottom: 12 },
  camera: { width: "100%", height: 280, borderRadius: 10, marginBottom: 16 },
  permissionBtn: {
    backgroundColor: "#f1f5f9", borderRadius: 10, padding: 20,
    alignItems: "center", marginBottom: 16,
  },
  permissionText: { color: "#64748b", fontSize: 14 },
  button: {
    backgroundColor: "#2D5016", borderRadius: 10,
    padding: 16, alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#94a3b8" },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  coordRow: { flexDirection: "row", gap: 8 },
  coordBox: {
    flex: 1, backgroundColor: "#f8fafc", borderRadius: 8,
    padding: 10, borderWidth: 0.5, borderColor: "#e2e8f0",
  },
  coordLabel: { fontSize: 10, color: "#94a3b8", marginBottom: 2 },
  coordValue: { fontSize: 12, fontFamily: "monospace", color: "#1e293b" },
});