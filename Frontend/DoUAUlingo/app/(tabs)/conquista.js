import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "../../contexts/ThemeContext";

export default function ConquistaPage() {
  const { theme } = useTheme();

  const achievements = [
    {
      title: "Primeira lição",
      description: "Você completou sua primeira atividade.",
      emoji: "📚",
      unlocked: true,
    },
    {
      title: "Sequência de fogo",
      description: "Estudou por 7 dias seguidos.",
      emoji: "🔥",
      unlocked: true,
    },
    {
      title: "Caçador de XP",
      description: "Acumulou 800 XP no app.",
      emoji: "⭐",
      unlocked: true,
    },
    {
      title: "Mestre dos desafios",
      description: "Complete 10 desafios para desbloquear.",
      emoji: "🏆",
      unlocked: false,
    },
    {
      title: "Aluno lendário",
      description: "Chegue ao nível 10.",
      emoji: "🦉",
      unlocked: false,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>doUAUlingo</Text>

        <Text style={[styles.title, { color: theme.text }]}>
          Conquistas
        </Text>

        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          Veja seus troféus, metas e recompensas.
        </Text>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
        <Text style={styles.summaryEmoji}>🏆</Text>

        <View style={styles.summaryInfo}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>
            3 de 5 desbloqueadas
          </Text>

          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.progressBg || "#e5e5e5" },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.primary || "#58cc02" },
              ]}
            />
          </View>

          <Text style={[styles.progressText, { color: theme.subtext }]}>
            Continue fazendo lições para ganhar mais conquistas.
          </Text>
        </View>
      </View>

      {achievements.map((item) => (
        <View
          key={item.title}
          style={[
            styles.card,
            { backgroundColor: theme.card },
            !item.unlocked && styles.lockedCard,
          ]}
        >
          <View style={styles.iconBox}>
            <Text style={styles.cardEmoji}>
              {item.unlocked ? item.emoji : "🔒"}
            </Text>
          </View>

          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {item.title}
            </Text>

            <Text style={[styles.cardSub, { color: theme.subtext }]}>
              {item.description}
            </Text>
          </View>

          <Text style={styles.status}>
            {item.unlocked ? "✅" : "🔒"}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
  },

  summaryCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },

  summaryEmoji: {
    fontSize: 42,
    marginRight: 14,
  },

  summaryInfo: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },

  progressBar: {
    width: "100%",
    height: 16,
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    width: "60%",
    height: "100%",
    borderRadius: 20,
  },

  progressText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "800",
  },

  card: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },

  lockedCard: {
    opacity: 0.55,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  cardEmoji: {
    fontSize: 28,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  cardSub: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },

  status: {
    fontSize: 22,
    marginLeft: 8,
  },
});