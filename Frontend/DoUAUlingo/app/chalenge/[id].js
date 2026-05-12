import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useTheme } from "../../contexts/ThemeContext";

const challenges = [
  {
    id: "1",
    category: "AWS",
    level: "Fácil",
    title: "Criando um Bucket S3",
    emoji: "☁️",
    xp: 50,
    topics: [
      {
        title: "O que é o Amazon S3?",
        text: "O Amazon S3 é um serviço da AWS usado para armazenar arquivos na nuvem, como imagens, documentos, backups e vídeos.",
      },
      {
        title: "O que é um bucket?",
        text: "Bucket é como uma pasta principal dentro do S3. É nele que você guarda seus arquivos.",
      },
    ],
    finalChallenge:
      "Crie um bucket no Amazon S3 e envie 3 arquivos para dentro dele.",
  },
  {
    id: "2",
    category: "AWS",
    level: "Médio",
    title: "EC2 com servidor web",
    emoji: "🖥️",
    xp: 120,
    topics: [
      {
        title: "O que é EC2?",
        text: "EC2 é uma máquina virtual na nuvem. Ela funciona como um computador Linux ou Windows rodando dentro da AWS.",
      },
      {
        title: "O que é Apache?",
        text: "Apache é um servidor web usado para exibir páginas HTML pelo navegador.",
      },
    ],
    finalChallenge:
      "Crie uma EC2 Linux, instale Apache e publique uma página HTML simples.",
  },
  {
    id: "3",
    category: "AWS",
    level: "Difícil",
    title: "EC2 acessando S3",
    emoji: "🔐",
    xp: 250,
    topics: [
      {
        title: "O que é IAM Role?",
        text: "IAM Role é uma permissão temporária que você pode entregar para um serviço da AWS acessar outro com segurança.",
      },
      {
        title: "EC2 + S3",
        text: "Uma EC2 pode acessar arquivos do S3 sem usar chave secreta, usando uma role com permissão correta.",
      },
    ],
    finalChallenge:
      "Configure uma EC2 com IAM Role e liste arquivos de um bucket S3 pelo terminal.",
  },
  {
    id: "4",
    category: "Expo",
    level: "Fácil",
    title: "Primeira tela no Expo",
    emoji: "📱",
    xp: 40,
    topics: [
      {
        title: "View e Text",
        text: "View é como uma caixa/container. Text é usado para mostrar textos na tela.",
      },
      {
        title: "StyleSheet",
        text: "StyleSheet serve para organizar os estilos do app, como cor, tamanho, margem e alinhamento.",
      },
    ],
    finalChallenge:
      "Crie uma tela de boas-vindas com título, subtítulo e botão.",
  },
  {
    id: "5",
    category: "Expo",
    level: "Médio",
    title: "Navegação com Expo Router",
    emoji: "🧭",
    xp: 100,
    topics: [
      {
        title: "O que é Expo Router?",
        text: "Expo Router permite criar navegação usando arquivos e pastas dentro da pasta app.",
      },
      {
        title: "router.push",
        text: "O router.push envia o usuário para outra tela do aplicativo.",
      },
    ],
    finalChallenge:
      "Crie uma navegação entre as telas Login, Cadastro e Dashboard.",
  },
  {
    id: "6",
    category: "Expo",
    level: "Difícil",
    title: "Consumindo API no Expo",
    emoji: "⚡",
    xp: 200,
    topics: [
      {
        title: "fetch e axios",
        text: "fetch e axios servem para buscar dados de APIs externas, como PokéAPI ou ViaCEP.",
      },
      {
        title: "useEffect",
        text: "useEffect permite executar uma ação quando a tela abre, como carregar dados de uma API.",
      },
    ],
    finalChallenge:
      "Crie uma tela que consuma uma API real e mostre os dados em cards.",
  },
];

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const challenge = challenges.find((item) => item.id === String(id));

  if (!challenge) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorTitle, { color: theme.text }]}>
          Desafio não encontrado 😵
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <View style={[styles.heroCard, { backgroundColor: theme.card }]}>
        <Text style={styles.emoji}>{challenge.emoji}</Text>

        <Text style={[styles.category, { color: theme.subtext }]}>
          {challenge.category} • {challenge.level}
        </Text>

        <Text style={[styles.title, { color: theme.text }]}>
          {challenge.title}
        </Text>

        <Text style={styles.xp}>+{challenge.xp} XP</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Aprenda antes do desafio
      </Text>

      {challenge.topics.map((topic, index) => (
        <View
          key={index}
          style={[styles.topicCard, { backgroundColor: theme.card }]}
        >
          <Text style={styles.topicNumber}>0{index + 1}</Text>

          <Text style={[styles.topicTitle, { color: theme.text }]}>
            {topic.title}
          </Text>

          <Text style={[styles.topicText, { color: theme.subtext }]}>
            {topic.text}
          </Text>
        </View>
      ))}

      <View style={styles.finalCard}>
        <Text style={styles.finalEmoji}>🎯</Text>

        <Text style={styles.finalTitle}>Desafio Final</Text>

        <Text style={styles.finalText}>{challenge.finalChallenge}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/dashboard")}
      >
        <Text style={styles.buttonText}>MARCAR COMO CONCLUÍDO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 22,
    paddingBottom: 100,
  },

  backText: {
    color: "#58cc02",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 18,
  },

  heroCard: {
    borderRadius: 26,
    padding: 22,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 6,
    borderBottomColor: "#d1d1d1",
    marginBottom: 24,
  },

  emoji: {
    fontSize: 58,
    marginBottom: 8,
  },

  category: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },

  title: {
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  xp: {
    marginTop: 12,
    color: "#ffb020",
    fontSize: 16,
    fontWeight: "900",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },

  topicCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },

  topicNumber: {
    color: "#58cc02",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },

  topicTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8,
  },

  topicText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },

  finalCard: {
    backgroundColor: "#58cc02",
    borderRadius: 24,
    padding: 22,
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 6,
    borderBottomColor: "#46a302",
  },

  finalEmoji: {
    fontSize: 34,
    marginBottom: 8,
  },

  finalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
  },

  finalText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "800",
  },

  button: {
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#46a302",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 20,
  },
});