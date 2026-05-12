import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();
  const { theme } = useTheme();

  const [open, setOpen] = useState(true);
  const width = useState(new Animated.Value(230))[0];

  const toggleSidebar = () => {
    Animated.timing(width, {
      toValue: open ? 78 : 230,
      duration: 220,
      useNativeDriver: false,
    }).start();

    setOpen(!open);
  };


  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          width,
          backgroundColor: theme.card,
        },
      ]}
    >
      <View style={styles.topArea}>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
          <Text style={styles.toggleText}>{open ? "←" : "→"}</Text>
        </TouchableOpacity>

        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🦉</Text>
          {open && <Text style={styles.logoText}>doUAU</Text>}
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigate("/dashboard")}
        >
          <Text style={styles.icon}>🏠</Text>
          {open && <Text style={[styles.itemText, { color: theme.text }]}>Dashboard</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigate("/conquista")}
        >
          <Text style={styles.icon}>🏆</Text>
          {open && <Text style={[styles.itemText, { color: theme.text }]}>Conquistas</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigate("/profile")}
        >
          <Text style={styles.icon}>👤</Text>
          {open && <Text style={[styles.itemText, { color: theme.text }]}>Perfil</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          logout();
          router.replace("/login");
        }}
      >
        <Text style={styles.icon}>🚪</Text>
        {open && <Text style={styles.logoutText}>Sair</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    height: "100%",
    paddingTop: 38,
    paddingHorizontal: 10,
    borderRightWidth: 2,
    borderRightColor: "#e5e5e5",
  },

  topArea: {
    marginBottom: 24,
  },

  toggleButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#58cc02",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderBottomWidth: 4,
    borderBottomColor: "#46a302",
  },

  toggleText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  logoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#d7ffb8",
    padding: 10,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#58cc02",
  },

  logoEmoji: {
    fontSize: 28,
  },

  logoText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#58cc02",
  },

  menu: {
    flex: 1,
    gap: 10,
  },

  item: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 4,
    borderBottomColor: "#d1d1d1",
  },

  icon: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
  },

  itemText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "900",
  },

  logoutButton: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe5e5",
    borderWidth: 2,
    borderColor: "#ffb3b3",
    borderBottomWidth: 4,
    borderBottomColor: "#ff8a8a",
    marginBottom: 24,
  },

  logoutText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "900",
    color: "#ff4b4b",
  },
});