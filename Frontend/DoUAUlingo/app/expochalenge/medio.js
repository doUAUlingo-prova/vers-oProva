import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

const API_URL = "https://x49aok4laf.execute-api.us-east-1.amazonaws.com";

const challenges = [
  {
    id: "5",
    category: "Expo Router",
    level: "Médio",
    title: "Navegação com Expo Router",
    emoji: "🧭",
    xp: 100,

    tutorial: [
      {
        title: "O que é Expo Router?",
        text: "Expo Router é a solução oficial de navegação do Expo. Ele usa um sistema baseado em arquivos (file-based routing), onde cada arquivo dentro da pasta app/ se torna uma tela automaticamente.",
      },
      {
        title: "Estrutura de Pastas",
        text: "• app/index.js → Tela inicial (/)\n• app/about.js → Tela /about\n• app/(tabs)/home.js → Grupo de tabs\n• app/_layout.js → Layout compartilhado",
      },
      {
        title: "Navegação Básica",
        text: "useRouter() → Para navegar entre telas\nrouter.push('/about')\nrouter.back()\nrouter.replace('/profile')",
      },
      {
        title: "Passando Parâmetros",
        text: "router.push(`/profile/${userId}`)\n\nPara pegar: const { id } = useLocalSearchParams();",
      },
      {
        title: "Layouts e Grupos",
        text: "Use pastas entre parênteses ( ) para criar grupos de rotas sem afetar a URL.\nEx: app/(tabs)/ e app/(auth)/",
      },
      {
        title: "useLocalSearchParams()",
        text: "Hook usado para receber parâmetros da rota (id, slug, etc).",
      },
      {
        title: "useRouter()",
        text: "Hook principal para navegação: push, back, replace, dismiss, etc.",
      },
    ],

    finalChallenge:
      "Crie um aplicativo com pelo menos 4 telas (Home, Perfil, Configurações e Sobre) usando Expo Router com navegação funcional.",

    requirements: [
      "Criar pelo menos 4 telas",
      "Implementar navegação entre elas",
      "Passar parâmetros entre telas",
      "Criar um layout compartilhado",
      "Implementar botão de voltar",
    ],

    questions: [
      {
        question: "Como se chama o sistema de navegação do Expo?",
        options: ["Expo Router", "React Navigation", "Expo Link"],
        answer: "Expo Router",
      },
      {
        question: "Qual arquivo representa a tela inicial?",
        options: ["app/index.js", "app/home.js", "app/start.js"],
        answer: "app/index.js",
      },
      {
        question: "Como navegar para outra tela usando código?",
        options: ["router.push('/about')", "navigate('/about')", "goTo('/about')"],
        answer: "router.push('/about')",
      },
      {
        question: "Qual hook é usado para pegar parâmetros da URL?",
        options: ["useLocalSearchParams()", "useParams()", "useSearchParams()"],
        answer: "useLocalSearchParams()",
      },
      {
        question: "O que significa uma pasta entre parênteses ( ) no Expo Router?",
        options: [
          "É um grupo de rotas (não aparece na URL)",
          "Cria uma rota dinâmica",
          "É uma pasta protegida",
        ],
        answer: "É um grupo de rotas (não aparece na URL)",
      },
    ],
  },
];

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { usuario } = useAuth();

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [lockedQuestions, setLockedQuestions] = useState({});
  const [lives, setLives] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  const challenge = challenges.find((item) => item.id === String(id));

  const shuffledQuestions = useMemo(() => {
    if (!challenge) return [];
    return challenge.questions.map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }));
  }, [challenge]);

  if (!challenge) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorTitle, { color: theme.text }]}>
          Desafio não encontrado 😵
        </Text>

        <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")}>
          <Text style={styles.backText}>← Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalQuestions = shuffledQuestions.length;
  const correctAnswers = shuffledQuestions.filter(
    (item, index) => selectedAnswers[index] === item.answer
  ).length;

  const answeredQuestions = Object.keys(selectedAnswers).length;
  const allAnswered = answeredQuestions === totalQuestions;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const approved = percentage >= 75;

  const selectAnswer = (questionIndex, option) => {
    if (submitted || lockedQuestions[questionIndex]) return;

    const question = shuffledQuestions[questionIndex];
    const isCorrect = option === question.answer;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));

    if (isCorrect) {
      setLockedQuestions((prev) => ({ ...prev, [questionIndex]: true }));
      return;
    }

    if (lives > 0) {
      setLives((prev) => prev - 1);
      return;
    }

    setLockedQuestions((prev) => ({ ...prev, [questionIndex]: true }));
  };

  const submitChallenge = async () => {
    if (!allAnswered || submitted) return;

    setSubmitted(true);

    if (!approved) return;

    try {
      await fetch(
        `${API_URL}/progresso/concluir?email=${usuario.email}&desafioId=${challenge.id}`,
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.log("Erro ao salvar progresso:", error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")}>
        <Text style={styles.backText}>← Voltar ao início</Text>
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

      <View style={styles.statusRow}>
        <View style={styles.lifeCard}>
          <Text style={styles.lifeText}>Vidas: {"❤️".repeat(lives)}</Text>
        </View>

        <View style={styles.lifeCard}>
          <Text style={styles.lifeText}>
            Respondidas: {answeredQuestions}/{totalQuestions}
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Aprenda antes do desafio
      </Text>

      {challenge.tutorial.map((topic, index) => (
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

      <View style={[styles.topicCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.topicTitle, { color: theme.text }]}>
          Requisitos
        </Text>

        {challenge.requirements.map((item, index) => (
          <Text
            key={index}
            style={[styles.topicText, { color: theme.subtext }]}
          >
            ✅ {item}
          </Text>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Avaliação
      </Text>

      <Text style={[styles.helpText, { color: theme.subtext }]}>
        Você precisa acertar pelo menos 75%. As alternativas aparecem em ordem
        aleatória. Você possui 3 vidas para corrigir respostas erradas antes da
        resposta ficar travada.
      </Text>

      {shuffledQuestions.map((item, questionIndex) => (
        <View
          key={questionIndex}
          style={[styles.questionCard, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.questionText, { color: theme.text }]}>
            {questionIndex + 1}. {item.question}
          </Text>

          {item.options.map((option) => {
            const selected = selectedAnswers[questionIndex] === option;
            const isCorrect = option === item.answer;
            const locked = lockedQuestions[questionIndex];

            return (
              <TouchableOpacity
                key={option}
                disabled={submitted || locked}
                style={[
                  styles.optionButton,
                  selected && styles.selectedOption,
                  selected && locked && isCorrect && styles.correctOption,
                  selected && locked && !isCorrect && styles.wrongOption,
                  submitted && selected && isCorrect && styles.correctOption,
                  submitted && selected && !isCorrect && styles.wrongOption,
                ]}
                onPress={() => selectAnswer(questionIndex, option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}

          {lockedQuestions[questionIndex] && (
            <Text style={styles.lockedText}>Resposta travada 🔒</Text>
          )}
        </View>
      ))}

      {submitted && (
        <View
          style={[
            styles.resultCard,
            approved ? styles.approvedCard : styles.failedCard,
          ]}
        >
          <Text style={styles.resultTitle}>
            {approved ? "Aprovado! 🏆" : "Reprovado 😵"}
          </Text>

          <Text style={styles.resultInfo}>
            Acertos: {correctAnswers}/{totalQuestions}
          </Text>

          <Text style={styles.resultInfo}>Nota: {percentage}%</Text>

          <Text style={styles.resultDescription}>
            {approved
              ? `Parabéns! Você ganhou ${challenge.xp} XP.`
              : "Você precisa atingir pelo menos 75% para concluir este módulo."}
          </Text>
        </View>
      )}

      {submitted ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)/dashboard")}
        >
          <Text style={styles.buttonText}>VOLTAR AO INÍCIO</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={!allAnswered}
          style={[styles.button, !allAnswered && styles.disabledButton]}
          onPress={submitChallenge}
        >
          <Text style={styles.buttonText}>
            {allAnswered ? "ENVIAR RESPOSTAS" : "RESPONDA TODAS AS QUESTÕES"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 22, paddingBottom: 100 },
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
    marginBottom: 18,
  },
  emoji: { fontSize: 58, marginBottom: 8 },
  category: { fontSize: 14, fontWeight: "900", marginBottom: 8 },
  title: { fontSize: 25, fontWeight: "900", textAlign: "center" },
  xp: { marginTop: 12, color: "#ffb020", fontSize: 16, fontWeight: "900" },
  statusRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  lifeCard: {
    flex: 1,
    backgroundColor: "#d7ffb8",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#46a302",
  },
  lifeText: { color: "#2f7d00", fontWeight: "900", fontSize: 13 },
  sectionTitle: { fontSize: 22, fontWeight: "900", marginBottom: 14 },
  helpText: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    marginBottom: 16,
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
  topicTitle: { fontSize: 19, fontWeight: "900", marginBottom: 8 },
  topicText: { fontSize: 14, lineHeight: 22, fontWeight: "700" },
  finalCard: {
    backgroundColor: "#58cc02",
    borderRadius: 24,
    padding: 22,
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 6,
    borderBottomColor: "#46a302",
  },
  finalEmoji: { fontSize: 34, marginBottom: 8 },
  finalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
  },
  finalText: { color: "#fff", fontSize: 15, lineHeight: 22, fontWeight: "800" },
  questionCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },
  questionText: { fontSize: 17, fontWeight: "900", marginBottom: 12 },
  optionButton: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#f1f1f1",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  selectedOption: { borderColor: "#58cc02", backgroundColor: "#eaffdc" },
  correctOption: { backgroundColor: "#d7ffb8", borderColor: "#58cc02" },
  wrongOption: { backgroundColor: "#ffd6d6", borderColor: "#ff4b4b" },
  optionText: { fontSize: 14, fontWeight: "900", color: "#333" },
  lockedText: {
    marginTop: 4,
    color: "#ff4b4b",
    fontSize: 13,
    fontWeight: "900",
  },
  resultCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderBottomWidth: 5,
  },
  approvedCard: {
    backgroundColor: "#d7ffb8",
    borderColor: "#58cc02",
    borderBottomColor: "#46a302",
  },
  failedCard: {
    backgroundColor: "#ffd6d6",
    borderColor: "#ff4b4b",
    borderBottomColor: "#cc3838",
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
    color: "#222",
  },
  resultInfo: {
    fontSize: 15,
    fontWeight: "900",
    color: "#222",
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    fontWeight: "800",
    color: "#222",
    marginTop: 8,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#46a302",
  },
  disabledButton: {
    backgroundColor: "#b7b7b7",
    borderBottomColor: "#8f8f8f",
  },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "900" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },
  errorTitle: { fontSize: 22, fontWeight: "900", marginBottom: 20 },
});