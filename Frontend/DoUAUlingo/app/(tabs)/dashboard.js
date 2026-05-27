import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../../contexts/AuthContext";
import { useAvatar } from "../../contexts/AvatarContext";
import { useTheme } from "../../contexts/ThemeContext";

import capivara from "../../assets/avatars/capivara.webp";

const API_URL = "https://x49aok4laf.execute-api.us-east-1.amazonaws.com";

export default function Dashboard() {
  const { usuario } = useAuth();
  const { theme } = useTheme();
  const { selectedAnimal } = useAvatar();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("AWS");
  const [perfil, setPerfil] = useState(null);
  const [progresso, setProgresso] = useState([]);

  const avatarMap = {
    owl: "🦉",
    cat: "🐱",
    dog: "🐶",
    panda: "🐼",
    fox: "🦊",
    frog: "🐸",
    monkey: "🐵",
    koala: "🐨",
    capybara: capivara,

    "🦉": "🦉",
    "🐱": "🐱",
    "🐶": "🐶",
    "🐼": "🐼",
    "🦊": "🦊",
    "🐸": "🐸",
    "🐵": "🐵",
    "🐨": "🐨",
  };

  const challengeSections = {
    AWS: [
      {
        level: "Fácil",
        color: "#58cc02",
        route: "/awschalenge/facil?id=1",
        challenges: [
          {
            id: 1,
            title: "Criando um Bucket S3",
            xp: 50,
            emoji: "☁️",
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
        route: "/awschalenge/medio?id=2",
        challenges: [
          {
            id: 2,
            title: "EC2 com servidor web",
            xp: 120,
            emoji: "🖥️",
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
        route: "/awschalenge/dificil?id=3",
        challenges: [
          {
            id: 3,
            title: "EC2 acessando S3",
            xp: 250,
            emoji: "🔐",
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
        route: "/expochalenge/facil?id=4",
        challenges: [
          {
            id: 4,
            title: "Primeira tela no Expo",
            xp: 40,
            emoji: "📱",
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
        route: "/expochalenge/medio?id=5",
        challenges: [
          {
            id: 5,
            title: "Navegação com Expo Router",
            xp: 100,
            emoji: "🧭",
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
        route: "/expochalenge/dificil?id=6",
        challenges: [
          {
            id: 6,
            title: "Consumindo API no Expo",
            xp: 200,
            emoji: "⚡",
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

  useEffect(() => {
    carregarDados();

    const interval = setInterval(() => {
      carregarDados();
    }, 2000);

    return () => clearInterval(interval);
  }, [usuario?.email]);

  const carregarDados = async () => {
    if (!usuario?.email) return;

    try {
      const perfilResponse = await fetch(
        `${API_URL}/usuarios/me?email=${usuario.email}`
      );

      const perfilData = await perfilResponse.json();
      setPerfil(perfilData);

      const progressoResponse = await fetch(
        `${API_URL}/progresso?email=${usuario.email}`
      );

      const progressoData = await progressoResponse.json();
      setProgresso(progressoData);
    } catch (error) {
      console.log("Erro ao carregar dados:", error);
    }
  };

  const getDesafiosDaTrilha = () => {
    return challengeSections[selectedTab].flatMap(
      (section) => section.challenges
    );
  };

  const desafioConcluido = (id) => {
    return progresso.some((item) => item.desafio?.id === id);
  };

  const desafioBloqueado = (challengeId) => {
    const desafiosDaTrilha = getDesafiosDaTrilha();
    const index = desafiosDaTrilha.findIndex((item) => item.id === challengeId);

    if (index === 0) return false;

    const desafioAnterior = desafiosDaTrilha[index - 1];

    return !desafioConcluido(desafioAnterior.id);
  };

  const getProgressoTrilha = () => {
    const desafiosDaTrilha = getDesafiosDaTrilha();

    if (desafiosDaTrilha.length === 0) return 0;

    const concluidos = desafiosDaTrilha.filter((desafio) =>
      desafioConcluido(desafio.id)
    ).length;

    return Math.floor((concluidos / desafiosDaTrilha.length) * 100);
  };

  const getAulaAtual = () => {
    const desafiosDaTrilha = getDesafiosDaTrilha();

    const proximaAula = desafiosDaTrilha.find(
      (desafio) => !desafioConcluido(desafio.id)
    );

    if (!proximaAula) {
      return `${selectedTab}: trilha concluída!`;
    }

    return `${selectedTab}: ${proximaAula.title}`;
  };

  const getPrimeiraAulaDisponivel = () => {
    const desafiosDaTrilha = getDesafiosDaTrilha();

    const proximaAula = desafiosDaTrilha.find(
      (desafio) => !desafioConcluido(desafio.id) && !desafioBloqueado(desafio.id)
    );

    return proximaAula || desafiosDaTrilha[0];
  };

  const getRouteByChallengeId = (challengeId) => {
    for (const section of challengeSections[selectedTab]) {
      const found = section.challenges.find((item) => item.id === challengeId);

      if (found) {
        return section.route;
      }
    }

    return challengeSections[selectedTab][0].route;
  };

  const renderAvatar = () => {
    const avatar = avatarMap[selectedAnimal] || "🦉";

    if (typeof avatar === "string") {
      return <Text style={styles.avatarEmoji}>{avatar}</Text>;
    }

    return <Image source={avatar} style={styles.avatarImage} />;
  };

  const startLevel = (route, challengeId) => {
    if (desafioBloqueado(challengeId)) return;

    router.push(route);
  };

  const progressoTrilha = getProgressoTrilha();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>doUAUlingo</Text>

          <Text style={[styles.welcome, { color: theme.text }]}>
            Olá, {perfil?.nome?.split(" ")[0] || "Usuário"} 👋
          </Text>

          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Continue sua jornada de aprendizado.
          </Text>
        </View>

        <View style={styles.avatarCircle}>{renderAvatar()}</View>
      </View>

      <View style={[styles.mainCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.subtext }]}>
          Seu progresso em {selectedTab}
        </Text>

        <Text style={[styles.lessonTitle, { color: theme.text }]}>
          Aula atual:
        </Text>

        <Text style={[styles.currentLesson, { color: theme.subtext }]}>
          {getAulaAtual()}
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
                width: `${progressoTrilha}%`,
                backgroundColor: theme.primary || "#58cc02",
              },
            ]}
          />
        </View>

        <Text style={[styles.progressText, { color: theme.subtext }]}>
          {progressoTrilha}% concluído
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {perfil?.streak || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>dias</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statEmoji}>⭐</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {perfil?.xp || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>XP</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statEmoji}>🏆</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {perfil?.nivel || 1}
          </Text>
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
          style={[styles.tabButton, selectedTab === "AWS" && styles.activeTab]}
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
          style={[styles.tabButton, selectedTab === "Expo" && styles.activeTab]}
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
            style={[styles.levelBadge, { backgroundColor: levelData.color }]}
          >
            <Text style={styles.levelText}>{levelData.level}</Text>
          </View>

          {levelData.challenges.map((challenge) => {
            const concluido = desafioConcluido(challenge.id);
            const bloqueado = desafioBloqueado(challenge.id);

            return (
              <View
                key={challenge.id}
                style={[
                  styles.challengeCard,
                  { backgroundColor: theme.card },
                  bloqueado && styles.challengeBlocked,
                  concluido && styles.challengeDone,
                ]}
              >
                <View style={styles.challengeIcon}>
                  <Text style={styles.challengeEmoji}>
                    {bloqueado ? "🔒" : challenge.emoji}
                  </Text>
                </View>

                <View style={styles.challengeInfo}>
                  <Text style={[styles.challengeTitle, { color: theme.text }]}>
                    {challenge.title}
                  </Text>

                  <Text
                    style={[
                      styles.challengeXP,
                      concluido && styles.challengeCompletedText,
                      bloqueado && styles.challengeLockedText,
                    ]}
                  >
                    {concluido
                      ? "Concluído"
                      : bloqueado
                      ? "Bloqueado"
                      : `+${challenge.xp} XP`}
                  </Text>

                  <View style={styles.topicsBox}>
                    {challenge.topics.map((topic, index) => (
                      <Text
                        key={index}
                        style={[
                          styles.topicText,
                          { color: theme.subtext },
                          index === 2 && styles.finalChallengeText,
                          bloqueado && styles.lockedTopicText,
                        ]}
                      >
                        {index === 2 ? "🎯 " : "• "}
                        {topic}
                      </Text>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  disabled={bloqueado}
                  style={[
                    styles.playButton,
                    bloqueado && styles.playButtonBlocked,
                    concluido && styles.playButtonDone,
                  ]}
                  onPress={() => startLevel(levelData.route, challenge.id)}
                >
                  <Text style={styles.playButtonText}>
                    {concluido ? "✓" : bloqueado ? "🔒" : "▶"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ))}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          const aula = getPrimeiraAulaDisponivel();
          const rota = getRouteByChallengeId(aula.id);

          startLevel(rota, aula.id);
        }}
      >
        <Text style={styles.primaryText}>
          {progressoTrilha === 100 ? "TRILHA CONCLUÍDA" : "INICIAR LIÇÃO"}
        </Text>
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
    overflow: "hidden",
  },

  avatarEmoji: {
    fontSize: 34,
  },

  avatarImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    resizeMode: "cover",
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
    marginBottom: 4,
  },

  currentLesson: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 14,
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

  challengeDone: {
    borderColor: "#58cc02",
    borderBottomColor: "#46a302",
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

  challengeCompletedText: {
    color: "#58cc02",
  },

  challengeLockedText: {
    color: "#999",
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

  lockedTopicText: {
    opacity: 0.7,
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

  playButtonDone: {
    backgroundColor: "#1cb0f6",
    borderBottomColor: "#0f8ac0",
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