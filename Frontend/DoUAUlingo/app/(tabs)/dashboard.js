import { useState } from "react";
import {
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

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { selectedAnimal } = useAvatar();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("AWS");

  const progress = 50;

  const startChallenge = (id) => {
    router.push(`/challenge/${id}`);
  };

  const challengeSections = {
    AWS: [
      {
        level: "Fácil",
        color: "#58cc02",
        challenges: [
          {
            id: 1,
            title: "Criando um Bucket S3",
            xp: 50,
            emoji: "☁️",
            blocked: false,
            topics: [
              "Entenda o que é o Amazon S3 e para que ele serve.",
              "Aprenda como criar um bucket e enviar arquivos.",
              "Desafio Final: crie um bucket e envie 3 arquivos.",
            ],
          },
        ],
      },
      {
        level: "Médio",
        color: "#ffb020",
        challenges: [
          {
            id: 2,
            title: "EC2 com servidor web",
            xp: 120,
            emoji: "🖥️",
            blocked: false,
            topics: [
              "Entenda o que é uma instância EC2.",
              "Aprenda como instalar Apache ou Nginx.",
              "Desafio Final: hospede uma página HTML na EC2.",
            ],
          },
        ],
      },
      {
        level: "Difícil",
        color: "#ff4b4b",
        challenges: [
          {
            id: 3,
            title: "EC2 acessando S3",
            xp: 250,
            emoji: "🔐",
            blocked: true,
            topics: [
              "Entenda permissões IAM e roles.",
              "Aprenda como listar arquivos do S3 pela EC2.",
              "Desafio Final: configure uma EC2 com acesso seguro ao S3.",
            ],
          },
        ],
      },
    ],

    Expo: [
      {
        level: "Fácil",
        color: "#58cc02",
        challenges: [
          {
            id: 4,
            title: "Primeira tela no Expo",
            xp: 40,
            emoji: "📱",
            blocked: false,
            topics: [
              "Entenda View, Text e StyleSheet.",
              "Aprenda como montar uma tela simples.",
              "Desafio Final: crie uma tela de perfil.",
            ],
          },
        ],
      },
      {
        level: "Médio",
        color: "#ffb020",
        challenges: [
          {
            id: 5,
            title: "Navegação com Expo Router",
            xp: 100,
            emoji: "🧭",
            blocked: false,
            topics: [
              "Entenda como o expo-router funciona.",
              "Aprenda como navegar entre páginas.",
              "Desafio Final: crie Login, Cadastro e Dashboard.",
            ],
          },
        ],
      },
      {
        level: "Difícil",
        color: "#ff4b4b",
        challenges: [
          {
            id: 6,
            title: "Consumindo API no Expo",
            xp: 200,
            emoji: "⚡",
            blocked: true,
            topics: [
              "Entenda fetch, axios e useEffect.",
              "Aprenda como exibir dados vindos de uma API.",
              "Desafio Final: crie um app consumindo uma API real.",
            ],
          },
        ],
      },
    ],
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>doUAUlingo</Text>

          <Text style={[styles.welcome, { color: theme.text }]}>
            Olá, {user?.name || "Usuário"} 👋
          </Text>

          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Continue sua jornada de aprendizado.
          </Text>
        </View>

        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>{selectedAnimal}</Text>
        </View>
      </View>

      <View style={[styles.mainCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.subtext }]}>
          Seu progresso
        </Text>

        <Text style={[styles.lessonTitle, { color: theme.text }]}>
          Unidade 1: Primeiros passos
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
              {
                width: `${progress}%`,
                backgroundColor: theme.primary || "#58cc02",
              },
            ]}
          />
        </View>

        <Text style={[styles.progressText, { color: theme.subtext }]}>
          {progress}% concluído
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>7</Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>dias</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statEmoji}>⭐</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>820</Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>XP</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statEmoji}>🏆</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>4</Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            nível
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Escolha sua trilha
      </Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "AWS" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("AWS")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "AWS" && styles.activeTabText,
            ]}
          >
            ☁️ AWS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Expo" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Expo")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Expo" && styles.activeTabText,
            ]}
          >
            📱 Expo
          </Text>
        </TouchableOpacity>
      </View>

      {challengeSections[selectedTab].map((levelData) => (
        <View key={levelData.level} style={styles.levelContainer}>
          <View
            style={[
              styles.levelBadge,
              { backgroundColor: levelData.color },
            ]}
          >
            <Text style={styles.levelText}>{levelData.level}</Text>
          </View>

          {levelData.challenges.map((challenge) => (
            <View
              key={challenge.id}
              style={[
                styles.challengeCard,
                { backgroundColor: theme.card },
                challenge.blocked && styles.challengeBlocked,
              ]}
            >
              <View style={styles.challengeIcon}>
                <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
              </View>

              <View style={styles.challengeInfo}>
                <Text style={[styles.challengeTitle, { color: theme.text }]}>
                  {challenge.title}
                </Text>

                <Text style={styles.challengeXP}>+{challenge.xp} XP</Text>

                <View style={styles.topicsBox}>
                  {challenge.topics.map((topic, index) => (
                    <Text
                      key={index}
                      style={[
                        styles.topicText,
                        { color: theme.subtext },
                        index === 2 && styles.finalChallengeText,
                      ]}
                    >
                      {index === 2 ? "🎯 " : "• "}
                      {topic}
                    </Text>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                disabled={challenge.blocked}
                style={[
                  styles.playButton,
                  challenge.blocked && styles.playButtonBlocked,
                ]}
                onPress={() => startChallenge(challenge.id)}
              >
                <Text style={styles.playButtonText}>
                  {challenge.blocked ? "🔒" : "▶"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => startChallenge(1)}
      >
        <Text style={styles.primaryText}>INICIAR LIÇÃO</Text>
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
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#58cc02",
    letterSpacing: 1,
  },

  welcome: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
  },

  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 36,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#58cc02",
  },

  avatarEmoji: {
    fontSize: 34,
  },

  mainCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },

  lessonTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },

  progressBar: {
    width: "100%",
    height: 18,
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
  },

  progressText: {
    marginTop: 10,
    fontWeight: "800",
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

  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "800",
  },

  sectionTitle: {
    marginTop: 10,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: "900",
  },

  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#cfcfcf",
  },

  activeTab: {
    backgroundColor: "#58cc02",
    borderBottomColor: "#46a302",
  },

  tabText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#555",
  },

  activeTabText: {
    color: "#fff",
  },

  levelContainer: {
    marginBottom: 18,
  },

  levelBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  levelText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  challengeCard: {
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

  challengeBlocked: {
    opacity: 0.55,
  },

  challengeIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  challengeEmoji: {
    fontSize: 28,
  },

  challengeInfo: {
    flex: 1,
  },

  challengeTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  challengeXP: {
    marginTop: 6,
    color: "#ffb020",
    fontWeight: "900",
    fontSize: 13,
  },

  topicsBox: {
    marginTop: 10,
    gap: 6,
  },

  topicText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },

  finalChallengeText: {
    color: "#58cc02",
    fontWeight: "900",
  },

  playButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#58cc02",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#46a302",
    marginLeft: 8,
  },

  playButtonBlocked: {
    backgroundColor: "#e5e5e5",
    borderBottomColor: "#cfcfcf",
  },

  playButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    borderBottomWidth: 5,
    borderBottomColor: "#46a302",
  },

  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
});