// Importa recursos do Expo Router.
// useLocalSearchParams pega parâmetros da URL, como o id do desafio.
// useRouter permite navegar entre telas.
import { useLocalSearchParams, useRouter } from "expo-router";

// Importa hooks do React.
// useMemo memoriza valores calculados.
// useState armazena estados da tela.
import { useMemo, useState } from "react";

// Importa componentes visuais do React Native.
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Contexto de tema, usado para aplicar modo claro/escuro.
import { useTheme } from "../../contexts/ThemeContext";

// Contexto de autenticação, usado para pegar o usuário logado e atualizar seus dados.
import { useAuth } from "../../contexts/AuthContext";

// URL do backend local.
const API_URL = "http://localhost:8080";

// Lista de desafios desta tela.
// Aqui temos o desafio AWS Fácil.
const challenges = [
  {
    id: "1",
    category: "AWS",
    level: "Fácil",
    title: "Criando um Bucket S3",
    emoji: "☁️",
    xp: 50,

    // Conteúdo explicativo antes da avaliação.
    tutorial: [
      {
        title: "O que é o Amazon S3?",
        text: "O Amazon S3 é um serviço de armazenamento de objetos da AWS usado para guardar arquivos, imagens, vídeos, backups e conteúdos de aplicações web.",
      },
      {
        title: "O que é um bucket?",
        text: "Um bucket é o contêiner principal do S3. É dentro dele que os arquivos são armazenados e organizados.",
      },
      {
        title: "Como criar um bucket",
        text: "Acesse o console da AWS, procure por S3, clique em Create bucket, defina um nome único, escolha a região e finalize a criação.",
      },
      {
        title: "Como enviar arquivos",
        text: "Abra o bucket criado, clique em Upload, selecione os arquivos do computador e confirme o envio.",
      },
      {
        title: "Segurança no S3",
        text: "Evite deixar buckets públicos sem necessidade. Use políticas IAM, criptografia, versionamento e controle de permissões.",
      },
    ],

    // Desafio prático apresentado ao usuário.
    finalChallenge:
      "Crie um Bucket S3 e envie 3 arquivos diferentes para dentro dele.",

    // Requisitos que o usuário deve cumprir.
    requirements: [
      "Criar um bucket",
      "Enviar 3 arquivos diferentes",
      "Compartilhar print do bucket criado",
    ],

    // Questões da avaliação.
    questions: [
      {
        question: "O que é o Amazon S3?",
        options: [
          "Um serviço de armazenamento da AWS",
          "Um banco de dados SQL",
          "Uma máquina virtual Linux",
        ],
        answer: "Um serviço de armazenamento da AWS",
      },
      {
        question: "O que é um bucket?",
        options: ["Uma pasta principal do S3", "Um tipo de API", "Um servidor EC2"],
        answer: "Uma pasta principal do S3",
      },
      {
        question: "Qual destas opções pode ser armazenada no S3?",
        options: ["Imagens e documentos", "Somente bancos de dados", "Somente arquivos Java"],
        answer: "Imagens e documentos",
      },
      {
        question: "O que é necessário para hospedar um site no S3?",
        options: ["Habilitar Static Website Hosting", "Criar uma EC2", "Instalar Apache"],
        answer: "Habilitar Static Website Hosting",
      },
      {
        question: "Qual é uma boa prática de segurança no S3?",
        options: [
          "Não deixar buckets públicos sem necessidade",
          "Compartilhar acesso root",
          "Desativar criptografia",
        ],
        answer: "Não deixar buckets públicos sem necessidade",
      },
    ],
  },
];

// Função que embaralha as alternativas.
// Isso faz com que as opções apareçam em ordem aleatória.
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Tela principal do desafio.
export default function ChallengeScreen() {
  // Pega o id enviado pela rota.
  const { id } = useLocalSearchParams();

  // Permite navegar entre telas.
  const router = useRouter();

  // Obtém as cores do tema atual.
  const { theme } = useTheme();

  // Obtém usuário logado e função para atualizar os dados dele.
  const { usuario, atualizarUsuario } = useAuth();

  // Armazena as respostas selecionadas pelo usuário.
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Armazena quais perguntas já foram travadas.
  const [lockedQuestions, setLockedQuestions] = useState({});

  // Controla as vidas do usuário.
  const [lives, setLives] = useState(3);

  // Controla se a avaliação já foi enviada.
  const [submitted, setSubmitted] = useState(false);

  // Controla se o app está salvando progresso.
  const [saving, setSaving] = useState(false);

  // Procura o desafio pelo id recebido na rota.
  const challenge = challenges.find((item) => item.id === String(id));

  // Embaralha as alternativas das perguntas.
  // useMemo evita embaralhar novamente a cada renderização.
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
          <Text style={styles.backText}>← Voltar</Text>
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

  // Conta quantas perguntas já foram respondidas.
  const answeredQuestions = Object.keys(selectedAnswers).length;

  // Verifica se todas as perguntas foram respondidas.
  const allAnswered = answeredQuestions === totalQuestions;

  // Calcula a nota em porcentagem.
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  // Define aprovação mínima de 75%.
  const approved = percentage >= 75;

  // Função chamada quando o usuário escolhe uma alternativa.
  const selectAnswer = (questionIndex, option) => {
    // Impede responder se já enviou ou se a pergunta está travada.
    if (submitted || lockedQuestions[questionIndex]) return;

    const question = shuffledQuestions[questionIndex];

    // Verifica se a alternativa escolhida é correta.
    const isCorrect = option === question.answer;

    // Salva a resposta selecionada.
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));

    // Se estiver correta, trava a pergunta.
    if (isCorrect) {
      setLockedQuestions((prev) => ({
        ...prev,
        [questionIndex]: true,
      }));
      return;
    }

    // Se estiver errada, perde uma vida.
    if (lives > 0) {
      setLives((prev) => prev - 1);
      return;
    }

    // Se não houver mais vidas, trava a questão.
    setLockedQuestions((prev) => ({
      ...prev,
      [questionIndex]: true,
    }));
  };

  // Função chamada ao enviar respostas.
  const submitChallenge = async () => {
    // Impede envio incompleto, duplicado ou durante salvamento.
    if (!allAnswered || submitted || saving) return;

    // Marca a avaliação como enviada.
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

      // Trata erro ao salvar progresso.
      if (!response.ok) {
        const erro = await response.text();
        console.log("Erro ao salvar progresso:", erro);
        return;
      }

      // Atualiza usuário, XP, nível e streak.
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

  // Função para voltar ao Dashboard.
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
      <TouchableOpacity onPress={() => router.replace("(tabs)/dashboard")}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      {/* Card principal do desafio */}
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

      {/* Linha com vidas e perguntas respondidas */}
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
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Tutorial</Text>

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

      {/* Desafio prático */}
      <View style={styles.finalCard}>
        <Text style={styles.finalEmoji}>🎯</Text>
        <Text style={styles.finalTitle}>Desafio prático</Text>
        <Text style={styles.finalText}>{challenge.finalChallenge}</Text>
      </View>

      {/* Requisitos */}
      <View style={[styles.topicCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.topicTitle, { color: theme.text }]}>
          Requisitos
        </Text>

        {challenge.requirements.map((item, index) => (
          <Text key={index} style={[styles.topicText, { color: theme.subtext }]}>
            ✅ {item}
          </Text>
        ))}
      </View>

      {/* Avaliação */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Avaliação</Text>

      <Text style={[styles.helpText, { color: theme.subtext }]}>
        Você precisa acertar pelo menos 75%. As alternativas aparecem em ordem
        aleatória.
      </Text>

      {/* Renderiza as perguntas */}
      {shuffledQuestions.map((item, questionIndex) => (
        <View
          key={questionIndex}
          style={[styles.questionCard, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.questionText, { color: theme.text }]}>
            {questionIndex + 1}. {item.question}
          </Text>

          {/* Renderiza as alternativas */}
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

                  // Alternativa selecionada.
                  selected && styles.selectedOption,

                  // Se estiver selecionada, travada e correta.
                  selected && locked && isCorrect && styles.correctOption,

                  // Se estiver selecionada, travada e errada.
                  selected && locked && !isCorrect && styles.wrongOption,

                  // Após envio, marca correta.
                  submitted && selected && isCorrect && styles.correctOption,

                  // Após envio, marca errada.
                  submitted && selected && !isCorrect && styles.wrongOption,
                ]}
                onPress={() => selectAnswer(questionIndex, option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Indica pergunta travada */}
          {lockedQuestions[questionIndex] && (
            <Text style={styles.lockedText}>Resposta travada 🔒</Text>
          )}
        </View>
      ))}

      {/* Resultado final */}
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
              ? `Boa! Você ganhou ${challenge.xp} XP.`
              : "Você precisa atingir pelo menos 75% para concluir este módulo."}
          </Text>
        </View>
      )}

      {/* Botão de envio ou botão para voltar */}
      {!submitted ? (
        <TouchableOpacity
          disabled={!allAnswered}
          style={[styles.button, !allAnswered && styles.disabledButton]}
          onPress={submitChallenge}
        >
          <Text style={styles.buttonText}>
            {allAnswered ? "ENVIAR RESPOSTAS" : "RESPONDA TODAS AS QUESTÕES"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.backBottomButton} onPress={voltarDashboard}>
          <Text style={styles.backBottomText}>← Voltar ao Dashboard</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 22, paddingBottom: 100 },
  backText: { color: "#58cc02", fontSize: 16, fontWeight: "900", marginBottom: 18 },
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
  helpText: { fontSize: 14, fontWeight: "700", lineHeight: 21, marginBottom: 16 },
  topicCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },
  topicNumber: { color: "#58cc02", fontSize: 16, fontWeight: "900", marginBottom: 8 },
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
  finalTitle: { color: "#fff", fontSize: 22, fontWeight: "900", marginBottom: 10 },
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
  lockedText: { marginTop: 4, color: "#ff4b4b", fontSize: 13, fontWeight: "900" },
  resultCard: { borderRadius: 22, padding: 20, marginBottom: 16, borderWidth: 2, borderBottomWidth: 5 },
  approvedCard: { backgroundColor: "#d7ffb8", borderColor: "#58cc02", borderBottomColor: "#46a302" },
  failedCard: { backgroundColor: "#ffd6d6", borderColor: "#ff4b4b", borderBottomColor: "#cc3838" },
  resultTitle: { fontSize: 22, fontWeight: "900", marginBottom: 10, color: "#222" },
  resultInfo: { fontSize: 15, fontWeight: "900", color: "#222", marginBottom: 4 },
  resultDescription: { fontSize: 14, fontWeight: "800", color: "#222", marginTop: 8, lineHeight: 20 },
  button: {
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#46a302",
  },
  disabledButton: { backgroundColor: "#b7b7b7", borderBottomColor: "#8f8f8f" },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "900" },
  backBottomButton: {
    marginTop: 16,
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#46a302",
  },
  backBottomText: { color: "#fff", fontSize: 14, fontWeight: "900" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 22 },
  errorTitle: { fontSize: 22, fontWeight: "900", marginBottom: 20 },
});