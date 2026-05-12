import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: theme.card }]}
    >
      <Ionicons
        name={dark ? "sunny" : "moon"}
        size={20}
        color={dark ? "#facc15" : theme.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 10,
    right: 15,
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
});