import { useAuth } from "../../contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
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
    id: "3",
    category: "AWS",
    level: "Difícil",
    title: "EC2 acessando S3",
    emoji: "🔐",
    xp: 250,

    tutorial: [
      {
        title: "O que você vai aprender",
        text:
          "Neste módulo avançado você irá compreender como funciona a comunicação segura entre serviços da AWS utilizando IAM Roles e políticas de permissão.\n\nO foco principal será permitir que uma instância EC2 consiga acessar buckets S3 de forma segura, sem utilizar credenciais fixas dentro da aplicação.",
      },
      {
        title: "Cenário do Projeto",
        text:
          "Imagine uma aplicação hospedada em uma instância EC2 que precisa ler arquivos armazenados no S3, fazer upload de backups, processar imagens, ler arquivos JSON e hospedar arquivos estáticos.\n\nPor segurança, não é recomendado armazenar AWS Access Key e AWS Secret Key diretamente no servidor.\n\nPara resolver isso utilizamos IAM Roles, Temporary Credentials e Security Policies.",
      },
      {
        title: "O que é IAM?",
        text:
          "O IAM é o serviço da AWS responsável por controle de acesso, autenticação, autorização, gerenciamento de usuários e permissões.",
      },
      {
        title: "O que é uma IAM Role?",
        text:
          "Uma IAM Role é uma identidade temporária utilizada por serviços AWS para acessar outros recursos de forma segura.",
      },
      {
        title: "EC2 utilizando IAM Role",
        text:
          "Quando associamos uma IAM Role à EC2, a AWS fornece permissões temporárias automaticamente para a instância.",
      },
      {
        title: "Segurança em ambientes cloud",
        text:
          "A abordagem correta é utilizar IAM Roles, aplicar o princípio do menor privilégio e evitar credenciais fixas no código.",
      },
      {
        title: "Estrutura da arquitetura",
        text:
          "Usuário\n ↓\nEC2\n ↓\nIAM Role\n ↓\nAWS STS\n ↓\nTemporary Credentials\n ↓\nAmazon S3",
      },
      {
        title: "Etapa 1 — Criando Bucket S3",
        text:
          "1. Abrir Amazon S3\n2. Criar bucket\n3. Definir nome único, região, bloqueio público e versionamento opcional.",
      },
      {
        title: "Etapa 2 — Criando a EC2",
        text:
          "Configure uma instância usando Amazon Linux, t2.micro, Security Group, chave SSH e IAM Role.",
      },
      {
        title: "Etapa 3 — Criando IAM Role",
        text:
          "1. Abrir IAM\n2. Roles\n3. Create Role\n4. AWS Service\n5. EC2",
      },
      {
        title: "Etapa 4 — Criando Política de Permissão",
        text:
          "Permissões principais:\n\n• s3:ListBucket\n• s3:GetObject",
      },
      {
        title: "Associando Role à EC2",
        text:
          "Abrir EC2 → Actions → Security → Modify IAM Role → Selecionar Role.",
      },
      {
        title: "Testando acesso ao S3",
        text:
          "aws s3 ls\n\naws s3 ls s3://empresa-backups-s3",
      },
      {
        title: "Possíveis erros comuns",
        text:
          "Access Denied, NoCredentialsError, Bucket inexistente e Região incorreta.",
      },
      {
        title: "Boas práticas profissionais",
        text:
          "Nunca usar credenciais fixas, utilizar IAM Roles, criptografia e monitoramento.",
      },
    ],

    finalChallenge:
      "Configure uma EC2 com acesso seguro ao S3 utilizando IAM Roles e políticas de permissão.",
  },
];

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { usuario, atualizarUsuario } = useAuth();

  const challenge = challenges.find((item) => item.id === String(id));

  const concluirDesafio = async () => {
    if (!challenge || !usuario?.email) {
      console.log("Usuário ou desafio não encontrado para salvar progresso.");
      router.replace("/(tabs)/dashboard"); // opcional, ou poderia ser "/(tabs)/dashboard"
      return;
    }

    try {
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

      if (atualizarUsuario) {
        await atualizarUsuario();
      }

      console.log("Progresso salvo com sucesso!");
      router.replace("/(tabs)/dashboard"); // Redireciona para dashboard
    } catch (error) {
      console.log("Erro ao salvar progresso:", error);
    }
  };

  const voltarDashboard = async () => {
    if (atualizarUsuario) {
      await atualizarUsuario();
    }

    router.replace("/(tabs)/dashboard"); // Corrigido
  };

  if (!challenge) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorTitle, { color: theme.text }]}>
          Desafio não encontrado 😵
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={voltarDashboard}
        >
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
      <TouchableOpacity onPress={voltarDashboard}>
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

      <TouchableOpacity
        style={styles.button}
        onPress={concluirDesafio}
      >
        <Text style={styles.buttonText}>
          MARCAR COMO CONCLUÍDO
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBottomButton}
        onPress={voltarDashboard}
      >
        <Text style={styles.backBottomText}>
          ← Voltar ao Dashboard
        </Text>
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

  button: {
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#46a302",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },

  backBottomButton: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 14,
  },

  backBottomText: {
    color: "#1cb0f6",
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
