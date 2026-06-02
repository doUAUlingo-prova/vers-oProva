// Importa o contexto de autenticação.
// Usamos para acessar o usuário logado e atualizar seus dados após concluir o desafio.
import { useAuth } from "../../contexts/AuthContext";

// Importa recursos do Expo Router.
// useLocalSearchParams pega o id enviado pela rota.
// useRouter permite navegar entre telas.
import { useLocalSearchParams, useRouter } from "expo-router";

// Importa hooks do React.
// useMemo evita recalcular as perguntas embaralhadas toda hora.
// useState controla respostas, vidas, envio e salvamento.
import { useMemo, useState } from "react";

// Importa componentes visuais do React Native.
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Importa o contexto de tema.
// Permite aplicar tema claro ou escuro na tela.
import { useTheme } from "../../contexts/ThemeContext";

// URL do backend local.
const API_URL = "http://localhost:8080";

// Lista de desafios desta tela.
// Aqui temos o desafio Expo Fácil.
const challenges = [
  {
    id: "4",
    category: "Expo",
    level: "Fácil",
    title: "Primeira tela no Expo",
    emoji: "📱",
    xp: 40,

    // Conteúdo teórico exibido antes do desafio.
    tutorial: [
      {
        title: "O que é Expo?",
        text: "Expo é uma plataforma utilizada para criar aplicativos mobile com React Native de forma simples e rápida.",
      },
      {
        title: "Por que usar Expo?",
        text: "O Expo facilita o desenvolvimento mobile porque já possui diversas ferramentas prontas como navegação, câmera, notificações e testes em tempo real.",
      },
      {
        title: "Como iniciar um projeto Expo",
        text: "1. Instale o Node.js\n2. Rode: npx create-expo-app\n3. Entre na pasta do projeto\n4. Rode: npm start",
      },
      {
        title: "Estrutura básica",
        text: "O projeto Expo possui pastas importantes como:\n• app/\n• components/\n• assets/\n• contexts/\n• hooks/",
      },
      {
        title: "React Native",
        text: "O Expo funciona junto com React Native para criar aplicativos Android e iPhone usando JavaScript.",
      },
      {
        title: "Componentes básicos",
        text: "Os principais componentes são:\n• View\n• Text\n• Image\n• TouchableOpacity\n• ScrollView",
      },
      {
        title: "StyleSheet",
        text: "StyleSheet é utilizado para estilizar os componentes do aplicativo.",
      },
      {
        title: "Navegação",
        text: "O Expo Router permite navegar entre telas usando arquivos e pastas.",
      },
      {
        title: "Executando no celular",
        text: "Instale o aplicativo Expo Go no celular e escaneie o QR Code exibido no terminal.",
      },
      {
        title: "Publicando aplicativos",
        text: "Depois de finalizar o app, você pode gerar APKs e publicar na Play Store.",
      },
    ],

    // Desafio prático que o aluno deve fazer.
    finalChallenge:
      "Crie uma tela no Expo com título, descrição, imagem e botão estilizado.",

    // Requisitos do desafio prático.
    requirements: [
      "Criar uma tela no Expo",
      "Adicionar textos",
      "Adicionar botão",
      "Aplicar estilos",
      "Executar no celular usando Expo Go",
    ],

    // Perguntas da avaliação.
    questions: [
      {
        question: "O que é o Expo?",
        options: [
          "Uma plataforma para React Native",
          "Um banco de dados",
          "Um sistema operacional",
        ],
        answer: "Uma plataforma para React Native",
      },
      {
        question: "Qual comando cria um projeto Expo?",
        options: [
          "npx create-expo-app",
          "expo new database",
          "npm create server",
        ],
        answer: "npx create-expo-app",
      },
      {
        question: "Qual componente mostra textos?",
        options: ["Text", "View", "Image"],
        answer: "Text",
      },
      {
        question: "O StyleSheet serve para:",
        options: [
          "Estilizar componentes",
          "Criar APIs",
          "Criar banco de dados",
        ],
        answer: "Estilizar componentes",
      },
      {
        question: "Qual aplicativo testa o Expo no celular?",
        options: ["Expo Go", "Photoshop", "Visual Studio"],
        answer: "Expo Go",
      },
    ],
  },
];

// Função que embaralha as alternativas.
// Assim as opções aparecem em ordem aleatória.
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Componente principal da tela de desafio.
export default function ChallengeScreen() {
  // Pega o id recebido pela rota.
  const { id } = useLocalSearchParams();

  // Permite navegar entre telas.
  const router = useRouter();

  // Obtém as cores do tema atual.
  const { theme } = useTheme();

  // Obtém usuário logado e função para atualizar dados do usuário.
  const { usuario, atualizarUsuario } = useAuth();

  // Guarda as respostas selecionadas pelo usuário.
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Guarda quais perguntas já foram travadas.
  const [lockedQuestions, setLockedQuestions] = useState({});

  // Controla as vidas do usuário.
  const [lives, setLives] = useState(3);

  // Controla se a avaliação já foi enviada.
  const [submitted, setSubmitted] = useState(false);

  // Controla se o app está salvando o progresso no backend.
  const [saving, setSaving] = useState(false);

  // Procura o desafio pelo id recebido.
  const challenge = challenges.find((item) => item.id === String(id));

  // Embaralha as alternativas das perguntas.
  // useMemo evita que elas sejam embaralhadas novamente a cada renderização.
  const shuffledQuestions = useMemo(() => {
    if (!challenge) return [];

    return challenge.questions.map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }));
  }, [challenge]);

  // Caso o desafio não seja encontrado.
  if (!challenge) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorTitle, { color: theme.text }]}>
          Desafio não encontrado 😵
        </Text>

        <TouchableOpacity onPress={() => router.replace("(tabs)/dashboard")}>
          <Text style={styles.backText}>← Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Total de perguntas.
  const totalQuestions = shuffledQuestions.length;

  // Conta quantas respostas estão corretas.
  const correctAnswers = shuffledQuestions.filter(
    (item, index) => selectedAnswers[index] === item.answer
  ).length;

  // Conta quantas perguntas foram respondidas.
  const answeredQuestions = Object.keys(selectedAnswers).length;

  // Verifica se todas as perguntas foram respondidas.
  const allAnswered = answeredQuestions === totalQuestions;

  // Calcula a porcentagem de acerto.
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  // Define se foi aprovado.
  // A regra é acertar pelo menos 75%.
  const approved = percentage >= 75;

  // Função executada ao selecionar uma alternativa.
  const selectAnswer = (questionIndex, option) => {
    // Impede responder se a avaliação já foi enviada ou se a pergunta está travada.
    if (submitted || lockedQuestions[questionIndex]) return;

    const question = shuffledQuestions[questionIndex];
    const isCorrect = option === question.answer;

    // Salva a resposta selecionada.
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));

    // Se acertar, trava a pergunta.
    if (isCorrect) {
      setLockedQuestions((prev) => ({
        ...prev,
        [questionIndex]: true,
      }));
      return;
    }

    // Se errar, perde uma vida.
    if (lives > 0) {
      setLives((prev) => prev - 1);
      return;
    }

    // Se não tiver mais vidas, trava a pergunta.
    setLockedQuestions((prev) => ({
      ...prev,
      [questionIndex]: true,
    }));
  };

  // Função executada ao enviar a avaliação.
  const submitChallenge = async () => {
    // Impede envio se faltam respostas, se já enviou ou se está salvando.
    if (!allAnswered || submitted || saving) return;

    setSubmitted(true);

    // Se não foi aprovado, não salva progresso.
    if (!approved) return;

    try {
      setSaving(true);

      // Verifica se existe usuário logado.
      if (!usuario?.email) {
        console.log("Usuário não encontrado para salvar progresso.");
        return;
      }

      // Envia para o backend que o desafio foi concluído.
      const response = await fetch(
        `${API_URL}/progresso/concluir?email=${encodeURIComponent(
          usuario.email
        )}&desafioId=${challenge.id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const erro = await response.text();
        console.log("Erro ao salvar progresso:", erro);
        return;
      }

      // Atualiza dados do usuário como XP, nível e streak.
      if (atualizarUsuario) {
        await atualizarUsuario();
      }

      console.log("Progresso salvo com sucesso!");
    } catch (error) {
      console.log("Erro ao concluir desafio:", error);
    } finally {
      setSaving(false);
    }
  };

  // Volta para o Dashboard atualizando o usuário antes.
  const voltarDashboard = async () => {
    if (atualizarUsuario) {
      await atualizarUsuario();
    }

    router.replace("(tabs)/dashboard");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Botão voltar */}
      <TouchableOpacity onPress={voltarDashboard}>
        <Text style={styles.backText}>← Voltar ao início</Text>
      </TouchableOpacity>

      {/* Card principal */}
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

      {/* Status de vidas e perguntas respondidas */}
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

      {/* Tutorial */}
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

      {/* Desafio final */}
      <View style={styles.finalCard}>
        <Text style={styles.finalEmoji}>🎯</Text>
        <Text style={styles.finalTitle}>Desafio Final</Text>
        <Text style={styles.finalText}>{challenge.finalChallenge}</Text>
      </View>

      {/* Requisitos */}
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

      {/* Avaliação */}
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

      {/* Resultado */}
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

      {/* Botão final */}
      {submitted ? (
        <TouchableOpacity style={styles.button} onPress={voltarDashboard}>
          <Text style={styles.buttonText}>VOLTAR AO INÍCIO</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={!allAnswered || saving}
          style={[
            styles.button,
            (!allAnswered || saving) && styles.disabledButton,
          ]}
          onPress={submitChallenge}
        >
          <Text style={styles.buttonText}>
            {saving
              ? "SALVANDO..."
              : allAnswered
              ? "ENVIAR RESPOSTAS"
              : "RESPONDA TODAS AS QUESTÕES"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

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