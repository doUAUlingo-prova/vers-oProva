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

const API_URL = "http://localhost:8080";

const challenges = [
  {
    id: "6",
    category: "Expo",
    level: "Difícil",
    title: "Consumindo API no Expo",
    emoji: "🔌",
    xp: 200,

    tutorial: [
      {
        title: "O que é uma API?",
        text: "API (Application Programming Interface) é uma interface que permite que seu aplicativo se comunique com servidores externos para buscar, enviar ou atualizar dados.",
      },
      {
        title: "fetch vs Axios",
        text: "fetch é nativo do JavaScript. Axios é uma biblioteca mais prática (recomendada para projetos médios/grandes).",
      },
      {
        title: "Boas práticas com useEffect",
        text: "Sempre use useEffect com array de dependências vazio para buscar dados ao carregar a tela.\n\nEvite chamar API diretamente no corpo do componente.",
      },
      {
        title: "Estados importantes",
        text: "• loading (carregando)\n• data (dados)\n• error (erro)\n• refreshing (para pull-to-refresh)",
      },
      {
        title: "Tratamento de Erros",
        text: "Sempre trate erros com try/catch e mostre mensagens amigáveis ao usuário. Verifique se a resposta veio com .ok",
      },
      {
        title: "Headers e Autenticação",
        text: "Muitas APIs precisam de headers como Authorization (Bearer Token), Content-Type e Accept.",
      },
      {
        title: "Dicas Avançadas",
        text: "Use AbortController para cancelar requisições.\nCache de dados com AsyncStorage.\nRefresh Token automático.",
      },
    ],

    finalChallenge:
      "Crie um aplicativo que consuma uma API pública (JSONPlaceholder ou Reqres), mostre lista de usuários ou posts, permita visualizar detalhes e trate loading + erro.",

    requirements: [
      "Consumir uma API real usando fetch ou axios",
      "Exibir lista de itens com FlatList",
      "Criar tela de detalhes ao clicar em um item",
      "Implementar estado de loading e erro",
      "Tratar falhas de conexão",
      "Usar useEffect corretamente",
    ],

    questions: [
      {
        question: "Qual hook é mais adequado para buscar dados ao carregar a tela?",
        options: ["useEffect", "useState", "useCallback"],
        answer: "useEffect",
      },
      {
        question: "Como transformar a resposta do fetch em JSON?",
        options: ["response.json()", "JSON.parse(response)", "await response.text()"],
        answer: "response.json()",
      },
      {
        question: "Qual é a melhor forma de tratar erros em requisições?",
        options: [
          "Usar try/catch junto com .catch()",
          "Ignorar e deixar o app quebrar",
          "Só usar console.log",
        ],
        answer: "Usar try/catch junto com .catch()",
      },
      {
        question: "O que significa o status response.ok?",
        options: [
          "Se a requisição foi bem sucedida (status 2xx)",
          "Se a resposta veio em JSON",
          "Se a API está online",
        ],
        answer: "Se a requisição foi bem sucedida (status 2xx)",
      },
      {
        question: "Qual biblioteca é mais usada para consumir APIs no React Native?",
        options: ["Axios", "Redux", "Expo API"],
        answer: "Axios",
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
      setLockedQuestions((prev) => ({
        ...prev,
        [questionIndex]: true,
      }));
      return;
    }

    if (lives > 0) {
      setLives((prev) => prev - 1);
      return;
    }

    setLockedQuestions((prev) => ({
      ...prev,
      [questionIndex]: true,
    }));
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
              ? `Parabéns Mestre! Você ganhou ${challenge.xp} XP.`
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

  statusRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  lifeCard: {
    flex: 1,
    backgroundColor: "#d7ffb8",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#46a302",
  },

  lifeText: {
    color: "#2f7d00",
    fontWeight: "900",
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },

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

  topicTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8,
  },

  topicText: {
    fontSize: 14,
    lineHeight: 22,
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

  questionCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },

  questionText: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  optionButton: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#f1f1f1",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ddd",
  },

  selectedOption: {
    borderColor: "#58cc02",
    backgroundColor: "#eaffdc",
  },

  correctOption: {
    backgroundColor: "#d7ffb8",
    borderColor: "#58cc02",
  },

  wrongOption: {
    backgroundColor: "#ffd6d6",
    borderColor: "#ff4b4b",
  },

  optionText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#333",
  },

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

  buttonText: {
    color: "#fff",
    fontSize: 14,
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