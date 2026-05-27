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

const API_URL = "https://x49aok4laf.execute-api.us-east-1.amazonaws.com";


const challenges = [
  {
  id: "2",
  category: "AWS",
  level: "Médio",
  title: "EC2 com Servidor Web",
  emoji: "🖥️",
  xp: 120,

  tutorial: [
    {
      title: "O que você vai aprender",
      text:
        "Neste módulo você aprenderá a criar e configurar uma instância EC2 na AWS para hospedar aplicações web. Além disso, entenderá como funcionam servidores web como Apache e Nginx, muito utilizados em ambientes profissionais para disponibilizar sites e sistemas na internet.\n\nAo final do módulo, você será capaz de subir uma máquina virtual na nuvem e hospedar sua própria página HTML acessível publicamente.",
    },
    {
      title: "O que é uma instância EC2?",
      text:
        "O Amazon EC2 (Elastic Compute Cloud) é um serviço da AWS que permite criar servidores virtuais na nuvem.\n\nEssas máquinas virtuais podem ser utilizadas para:\n• Hospedar sites\n• Rodar APIs\n• Executar bancos de dados\n• Criar ambientes de desenvolvimento\n• Executar aplicações corporativas\n• Hospedar sistemas web\n\nA EC2 funciona como um computador remoto hospedado dentro da infraestrutura da AWS, permitindo total controle do sistema operacional, instalação de programas e gerenciamento do servidor.",
    },
    {
      title: "Como funciona uma EC2?",
      text:
        "Ao criar uma instância EC2, você escolhe:\n\n• Sistema operacional\n• Capacidade de processamento\n• Memória RAM\n• Armazenamento\n• Região AWS\n• Regras de acesso e segurança\n\nExemplo:\n\nUsuário\n   ↓\nInternet\n   ↓\nEC2\n   ↓\nServidor Web (Apache/Nginx)\n   ↓\nSite HTML",
    },
    {
      title: "O que é um Servidor Web?",
      text:
        "Um servidor web é um software responsável por receber requisições dos navegadores e entregar páginas web aos usuários.\n\nQuando alguém acessa um site, como www.meusite.com, o servidor web processa a solicitação e retorna arquivos como:\n\n• HTML\n• CSS\n• JavaScript\n• Imagens\n• APIs\n• Arquivos\n\nOs servidores web mais utilizados no mercado são Apache e Nginx.",
    },
    {
      title: "Apache vs Nginx",
      text:
        "🔹 Apache\nO Apache HTTP Server é um dos servidores web mais tradicionais e populares do mundo.\n\nCaracterísticas:\n• Fácil configuração\n• Grande compatibilidade\n• Muito utilizado em aplicações PHP\n• Excelente documentação\n\n🔹 Nginx\nO Nginx é um servidor web moderno focado em alta performance e escalabilidade.\n\nCaracterísticas:\n• Alto desempenho\n• Baixo consumo de recursos\n• Excelente para aplicações modernas\n• Muito utilizado como proxy reverso",
    },
    {
      title: "Criando uma EC2",
      text:
        "Passo 1 — Acessar o EC2\n\nEntre no Console AWS, pesquise por EC2 e abra o serviço.\n\nPasso 2 — Criar instância\n\nClique em Launch Instance e configure:\n• Nome da instância\n• Sistema operacional\n• Tipo da máquina\n• Chave SSH\n• Security Group",
    },
    {
      title: "Security Group",
      text:
        "O Security Group funciona como um firewall da EC2.\n\nPara hospedar um site é necessário liberar:\n\n• Porta 22 — SSH\n• Porta 80 — HTTP\n• Porta 443 — HTTPS\n\nA porta 22 permite conexão remota via terminal. A porta 80 permite acesso ao site via HTTP. A porta 443 permite acesso seguro via HTTPS.",
    },
    {
      title: "Conectando na EC2",
      text:
        "A conexão normalmente é feita via SSH:\n\nssh -i chave.pem ec2-user@IP_PUBLICO\n\nDepois da conexão, você terá acesso ao terminal Linux da máquina virtual.",
    },
    {
      title: "Instalando Apache",
      text:
        "Em sistemas Amazon Linux:\n\nsudo yum update -y\nsudo yum install httpd -y\n\nIniciar serviço:\nsudo systemctl start httpd\n\nHabilitar inicialização automática:\nsudo systemctl enable httpd",
    },
    {
      title: "Instalando Nginx",
      text:
        "Instalação:\n\nsudo yum install nginx -y\n\nIniciar serviço:\nsudo systemctl start nginx\n\nHabilitar inicialização automática:\nsudo systemctl enable nginx",
    },
    {
      title: "Hospedando uma página HTML",
      text:
        "Após instalar e iniciar o servidor web, você pode criar ou enviar uma página HTML para a pasta padrão do servidor.\n\nDepois disso, basta acessar no navegador:\n\nhttp://IP_PUBLICO_DA_EC2\n\nO site ficará disponível pela internet.",
    },
    {
      title: "Boas práticas de segurança",
      text:
        "Boas práticas importantes:\n\n• Nunca deixar SSH aberto para qualquer IP\n• Utilizar chaves SSH\n• Atualizar o sistema regularmente\n• Configurar HTTPS\n• Utilizar firewall corretamente\n• Monitorar acessos",
    },
  ],

  finalChallenge:
    "Hospede uma página HTML em uma instância EC2 utilizando Apache ou Nginx.",

  requirements: [
    "Criar uma instância EC2",
    "Liberar a porta 80 no Security Group",
    "Instalar Apache ou Nginx",
    "Criar uma página HTML",
    "Acessar o site publicamente pelo navegador",
  ],

  expectedResult: [
    "Criar servidores virtuais na AWS",
    "Configurar ambientes Linux",
    "Instalar servidores web",
    "Hospedar aplicações simples",
    "Publicar páginas HTML na internet",
    "Entender a base da infraestrutura web em nuvem",
  ],

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
}
];

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

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

        <TouchableOpacity onPress={() => router.back()}>
  <Text style={styles.backText}>← Voltar</Text>
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

  const submitChallenge = () => {
    if (!allAnswered || submitted) return;
    setSubmitted(true);
  };

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
        <Text style={styles.finalTitle}>Desafio prático</Text>
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
              ? `Boa! Você atingiu a média mínima e ganhou ${challenge.xp} XP.`
              : "Você precisa atingir pelo menos 75% para concluir este módulo."}
          </Text>
        </View>
      )}

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

{submitted && (
  <TouchableOpacity
    style={styles.backBottomButton}
    onPress={() => router.replace("/(tabs)/dashboard")}
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