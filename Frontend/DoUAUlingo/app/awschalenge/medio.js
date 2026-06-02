// Importa o contexto de autenticação.
// Usado para acessar o usuário logado e atualizar o progresso.
import { useAuth } from "../../contexts/AuthContext";

// Importa recursos do Expo Router.
// useLocalSearchParams pega o id vindo da rota.
// useRouter permite navegar entre telas.
import { useLocalSearchParams, useRouter } from "expo-router";

// Hooks do React.
// useMemo evita recalcular dados sem necessidade.
// useState armazena estados da tela.
import { useMemo, useState } from "react";

// Componentes visuais do React Native.
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Contexto de tema, usado para aplicar modo claro/escuro.
import { useTheme } from "../../contexts/ThemeContext";

// URL do backend local.
const API_URL = "http://localhost:8080";

// Lista de desafios desta tela.
// Aqui está o desafio AWS Médio.
const challenges = [
  {
    id: "2",
    category: "AWS",
    level: "Médio",
    title: "EC2 com Servidor Web",
    emoji: "🖥️",
    xp: 120,

    // Conteúdo teórico do módulo.
    tutorial: [
      {
        title: "O que você vai aprender",
        text:
          "Neste módulo você aprenderá a criar e configurar uma instância EC2 na AWS para hospedar aplicações web.",
      },
      {
        title: "O que é uma instância EC2?",
        text:
          "O Amazon EC2 é um serviço da AWS que permite criar servidores virtuais na nuvem.",
      },
      {
        title: "Como funciona uma EC2?",
        text:
          "Ao criar uma EC2, escolhemos sistema operacional, processamento, memória, armazenamento, região e regras de segurança.",
      },
      {
        title: "O que é um Servidor Web?",
        text:
          "Um servidor web recebe requisições dos navegadores e entrega páginas como HTML, CSS, JavaScript e imagens.",
      },
      {
        title: "Apache vs Nginx",
        text:
          "Apache é tradicional e fácil de configurar. Nginx é moderno, performático e muito usado como proxy reverso.",
      },
      {
        title: "Criando uma EC2",
        text:
          "No console da AWS, acesse EC2, clique em Launch Instance e configure nome, sistema operacional, tipo da máquina, chave SSH e Security Group.",
      },
      {
        title: "Security Group",
        text:
          "O Security Group funciona como firewall da EC2, controlando portas como 22 para SSH, 80 para HTTP e 443 para HTTPS.",
      },
      {
        title: "Conectando na EC2",
        text:
          "A conexão normalmente é feita via SSH usando a chave PEM e o IP público da instância.",
      },
      {
        title: "Instalando Apache",
        text:
          "No Amazon Linux, usamos comandos como sudo yum install httpd -y para instalar o Apache.",
      },
      {
        title: "Instalando Nginx",
        text:
          "Também é possível instalar Nginx com sudo yum install nginx -y e iniciar o serviço.",
      },
      {
        title: "Hospedando uma página HTML",
        text:
          "Após instalar o servidor web, criamos ou enviamos uma página HTML para a pasta padrão e acessamos pelo IP público da EC2.",
      },
      {
        title: "Boas práticas de segurança",
        text:
          "Não deixar SSH aberto para qualquer IP, usar chaves SSH, atualizar o sistema, configurar HTTPS e monitorar acessos.",
      },
    ],

    // Desafio prático.
    finalChallenge:
      "Hospede uma página HTML em uma instância EC2 utilizando Apache ou Nginx.",

    // Requisitos para concluir o desafio.
    requirements: [
      "Criar uma instância EC2",
      "Liberar a porta 80 no Security Group",
      "Instalar Apache ou Nginx",
      "Criar uma página HTML",
      "Acessar o site publicamente pelo navegador",
    ],

    // Resultado esperado de aprendizado.
    expectedResult: [
      "Criar servidores virtuais na AWS",
      "Configurar ambientes Linux",
      "Instalar servidores web",
      "Hospedar aplicações simples",
      "Publicar páginas HTML na internet",
      "Entender a base da infraestrutura web em nuvem",
    ],

    // Perguntas da avaliação.
    questions: [
      {
        question: "O que é o Amazon EC2?",
        options: [
          "Um serviço da AWS para criar servidores virtuais na nuvem",
          "Um serviço exclusivo para armazenar imagens",
          "Uma ferramenta para editar código online",
        ],
        answer: "Um serviço da AWS para criar servidores virtuais na nuvem",
      },
      {
        question: "Para que serve um servidor web?",
        options: [
          "Receber requisições e entregar páginas web aos usuários",
          "Criar usuários IAM automaticamente",
          "Armazenar senhas de banco de dados",
        ],
        answer: "Receber requisições e entregar páginas web aos usuários",
      },
      {
        question: "Qual porta normalmente é usada para acesso HTTP?",
        options: ["80", "22", "3306"],
        answer: "80",
      },
      {
        question: "Qual porta normalmente é usada para conexão SSH?",
        options: ["22", "443", "8080"],
        answer: "22",
      },
      {
        question: "O que é um Security Group?",
        options: [
          "Um firewall que controla o tráfego da EC2",
          "Um tipo de bucket público",
          "Um serviço para criar interfaces mobile",
        ],
        answer: "Um firewall que controla o tráfego da EC2",
      },
      {
        question: "Qual comando instala o Apache no Amazon Linux?",
        options: [
          "sudo yum install httpd -y",
          "npm install apache",
          "sudo apt create ec2",
        ],
        answer: "sudo yum install httpd -y",
      },
      {
        question: "Depois de iniciar o servidor web, como o site pode ser acessado?",
        options: [
          "Pelo endereço http://IP_PUBLICO_DA_EC2",
          "Somente pelo painel IAM",
          "Apenas pelo terminal SSH",
        ],
        answer: "Pelo endereço http://IP_PUBLICO_DA_EC2",
      },
      {
        question: "Qual é uma boa prática de segurança na EC2?",
        options: [
          "Não deixar SSH aberto para qualquer IP",
          "Deixar todas as portas abertas",
          "Compartilhar a chave PEM publicamente",
        ],
        answer: "Não deixar SSH aberto para qualquer IP",
      },
    ],
  },
];

// Função para embaralhar as alternativas das questões.
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Componente principal da tela do desafio.
export default function ChallengeScreen() {
  // Pega o id recebido pela rota.
  const { id } = useLocalSearchParams();

  // Permite navegar entre telas.
  const router = useRouter();

  // Obtém as cores do tema atual.
  const { theme } = useTheme();

  // Obtém usuário logado e função para atualizar seus dados.
  const { usuario, atualizarUsuario } = useAuth();

  // Guarda as respostas escolhidas.
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Guarda as perguntas que já foram travadas.
  const [lockedQuestions, setLockedQuestions] = useState({});

  // Controla as vidas do usuário.
  const [lives, setLives] = useState(3);

  // Indica se a avaliação já foi enviada.
  const [submitted, setSubmitted] = useState(false);

  // Indica se o progresso está sendo salvo.
  const [saving, setSaving] = useState(false);

  // Busca o desafio correspondente ao id.
  const challenge = challenges.find((item) => item.id === String(id));

  // Embaralha as alternativas das questões.
  const shuffledQuestions = useMemo(() => {
    if (!challenge) return [];

    return challenge.questions.map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }));
  }, [challenge]);

  // Se o desafio não existir, mostra erro.
  if (!challenge) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorTitle, { color: theme.text }]}>
          Desafio não encontrado 😵
        </Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Total de perguntas.
  const totalQuestions = shuffledQuestions.length;

  // Conta respostas corretas.
  const correctAnswers = shuffledQuestions.filter(
    (item, index) => selectedAnswers[index] === item.answer
  ).length;

  // Conta respostas dadas.
  const answeredQuestions = Object.keys(selectedAnswers).length;

  // Verifica se respondeu tudo.
  const allAnswered = answeredQuestions === totalQuestions;

  // Calcula porcentagem de acerto.
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  // Define aprovação com mínimo de 75%.
  const approved = percentage >= 75;

  // Função chamada ao selecionar alternativa.
  const selectAnswer = (questionIndex, option) => {
    // Impede alteração se já enviou ou se a questão está travada.
    if (submitted || lockedQuestions[questionIndex]) return;

    const question = shuffledQuestions[questionIndex];

    // Verifica se a opção está correta.
    const isCorrect = option === question.answer;

    // Salva resposta escolhida.
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));

    // Se acertou, trava a pergunta.
    if (isCorrect) {
      setLockedQuestions((prev) => ({
        ...prev,
        [questionIndex]: true,
      }));

      return;
    }

    // Se errou, perde uma vida.
    if (lives > 0) {
      setLives((prev) => prev - 1);
      return;
    }

    // Se acabaram as vidas, trava a questão.
    setLockedQuestions((prev) => ({
      ...prev,
      [questionIndex]: true,
    }));
  };

  // Função para enviar avaliação.
  const submitChallenge = async () => {
    // Impede envio se faltam respostas, se já enviou ou se está salvando.
    if (!allAnswered || submitted || saving) return;

    // Marca como enviado.
    setSubmitted(true);

    // Se não aprovado, não salva progresso.
    if (!approved) return;

    try {
      setSaving(true);

      // Verifica se há usuário logado.
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

      // Se o backend retornar erro.
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

  // Volta para o Dashboard atualizando dados antes.
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
      <TouchableOpacity onPress={() => router.back()}>
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

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Tutorial
      </Text>

      {/* Lista o conteúdo teórico */}
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

      {/* Lista de perguntas */}
      {shuffledQuestions.map((item, questionIndex) => (
        <View
          key={questionIndex}
          style={[styles.questionCard, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.questionText, { color: theme.text }]}>
            {questionIndex + 1}. {item.question}
          </Text>

          {/* Alternativas da pergunta */}
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

          {/* Mostra quando a resposta foi travada */}
          {lockedQuestions[questionIndex] && (
            <Text style={styles.lockedText}>Resposta travada 🔒</Text>
          )}
        </View>
      ))}

      {/* Resultado da avaliação */}
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
              ? `Boa! Você atingiu a média mínima e ganhou ${challenge.xp} XP.`
              : "Você precisa atingir pelo menos 75% para concluir este módulo."}
          </Text>
        </View>
      )}

      {/* Botão de envio */}
      <TouchableOpacity
        disabled={!allAnswered || submitted}
        style={[
          styles.button,
          (!allAnswered || submitted) && styles.disabledButton,
        ]}
        onPress={submitChallenge}
      >
        <Text style={styles.buttonText}>
          {submitted
            ? "AVALIAÇÃO ENVIADA"
            : allAnswered
            ? "ENVIAR RESPOSTAS"
            : "RESPONDA TODAS AS QUESTÕES"}
        </Text>
      </TouchableOpacity>

      {/* Botão para voltar após envio */}
      {submitted && (
        <TouchableOpacity
          style={styles.backBottomButton}
          onPress={voltarDashboard}
        >
          <Text style={styles.backBottomText}>
            ← Voltar ao Dashboard
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
  backBottomButton: {
  marginTop: 16,
  backgroundColor: "#222",
  paddingVertical: 16,
  borderRadius: 18,
  alignItems: "center",
  borderBottomWidth: 5,
  borderBottomColor: "#111",
},

backBottomText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "900",
},
});
