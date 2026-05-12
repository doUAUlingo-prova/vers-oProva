import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import ThemeToggle from "../../components/ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "900",
        },
        headerRight: () => <ThemeToggle />,

        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 2,
          borderTopColor: "#e5e5e5",
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#58cc02",
        tabBarInactiveTintColor: theme.subtext,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "900",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="conquista"
        options={{
          title: "Conquistas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}