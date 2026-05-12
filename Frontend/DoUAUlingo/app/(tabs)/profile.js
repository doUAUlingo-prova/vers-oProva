import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useAvatar } from "../../contexts/AvatarContext";
import { useTheme } from "../../contexts/ThemeContext";

import capivara from "../../assets/avatars/capivara.webp";

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { selectedAnimal, setSelectedAnimal } = useAvatar();
  const router = useRouter();

  const animals = [
    { id: "owl", emoji: "🦉" },
    { id: "cat", emoji: "🐱" },
    { id: "dog", emoji: "🐶" },
    { id: "panda", emoji: "🐼" },
    { id: "fox", emoji: "🦊" },
    { id: "frog", emoji: "🐸" },
    { id: "monkey", emoji: "🐵" },
    { id: "koala", emoji: "🐨" },
    { id: "capybara", image: capivara },
  ];

  const stats = [
    { label: "Dias seguidos", value: "7", emoji: "🔥" },
    { label: "XP total", value: "820", emoji: "⭐" },
    { label: "Nível", value: "4", emoji: "🏆" },
  ];

  const achievements = [
    { title: "Primeira lição", emoji: "📚" },
    { title: "Sequência inicial", emoji: "🔥" },
    { title: "Aluno dedicado", emoji: "💚" },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const renderSelectedAvatar = () => {
    const animal = animals.find(
      (item) => item.id === selectedAnimal || item.emoji === selectedAnimal
    );

    if (animal?.image) {
      return <Image source={animal.image} style={styles.avatarImage} />;
    }

    return <Text style={styles.avatarEmoji}>{animal?.emoji || "🦉"}</Text>;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>doUAUlingo</Text>

        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          Seu perfil de aprendizado
        </Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
        <View style={styles.avatarCircle}>{renderSelectedAvatar()}</View>

        <Text style={[styles.userName, { color: theme.text }]}>
          {user?.name || "Usuário"}
        </Text>

        <Text style={[styles.userEmail, { color: theme.subtext }]}>
          {user?.email || "usuario@email.com"}
        </Text>

        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Nível 4</Text>
        </View>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Escolha seu mascote
        </Text>

        <View style={styles.animalGrid}>
          {animals.map((animal) => (
            <TouchableOpacity
              key={animal.id}
              style={[
                styles.animalButton,
                selectedAnimal === animal.id && styles.selectedAnimal,
              ]}
              onPress={() => setSelectedAnimal(animal.id)}
            >
              {animal.image ? (
                <Image source={animal.image} style={styles.animalImage} />
              ) : (
                <Text style={styles.animalEmoji}>{animal.emoji}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.statsRow}>
        {stats.map((item) => (
          <View
            key={item.label}
            style={[styles.statCard, { backgroundColor: theme.card }]}
          >
            <Text style={styles.statEmoji}>{item.emoji}</Text>

            <Text style={[styles.statValue, { color: theme.text }]}>
              {item.value}
            </Text>

            <Text style={[styles.statLabel, { color: theme.subtext }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Conquistas
        </Text>

        {achievements.map((item) => (
          <View key={item.title} style={styles.achievementItem}>
            <Text style={styles.achievementEmoji}>{item.emoji}</Text>

            <Text style={[styles.achievementText, { color: theme.text }]}>
              {item.title}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Configurações
        </Text>

        <TouchableOpacity style={styles.optionButton} onPress={toggleTheme}>
          <Text style={styles.optionIcon}>🌗</Text>
          <Text style={[styles.optionText, { color: theme.text }]}>
            Alternar tema claro/escuro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionIcon}>🔔</Text>
          <Text style={[styles.optionText, { color: theme.text }]}>
            Notificações
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionIcon}>🔐</Text>
          <Text style={[styles.optionText, { color: theme.text }]}>
            Segurança da conta
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>SAIR DA CONTA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  content: {
    padding: 22,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 20,
  },

  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#58cc02",
    letterSpacing: 1,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
  },

  profileCard: {
    alignItems: "center",
    borderRadius: 24,
    padding: 22,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
    marginBottom: 16,
  },

  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#58cc02",
    marginBottom: 14,
    overflow: "hidden",
  },

  avatarEmoji: {
    fontSize: 54,
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },

  userName: {
    fontSize: 26,
    fontWeight: "900",
  },

  userEmail: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  levelBadge: {
    marginTop: 14,
    backgroundColor: "#58cc02",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    borderBottomWidth: 4,
    borderBottomColor: "#46a302",
  },

  levelText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  animalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },

  animalButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 4,
    borderBottomColor: "#d1d1d1",
    overflow: "hidden",
  },

  selectedAnimal: {
    backgroundColor: "#d7ffb8",
    borderColor: "#58cc02",
    borderBottomColor: "#46a302",
  },

  animalEmoji: {
    fontSize: 32,
  },

  animalImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    resizeMode: "cover",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },

  statEmoji: {
    fontSize: 24,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 4,
  },

  statLabel: {
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  sectionCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },

  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  achievementEmoji: {
    fontSize: 24,
    marginRight: 12,
  },

  achievementText: {
    fontSize: 15,
    fontWeight: "800",
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  optionText: {
    fontSize: 15,
    fontWeight: "800",
  },

  logoutButton: {
    backgroundColor: "#ff4b4b",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#cc3838",
  },

  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
});