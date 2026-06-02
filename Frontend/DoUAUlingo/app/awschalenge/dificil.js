// Importa o contexto de autenticação.
// Usado para acessar o usuário logado e atualizar XP, nível e progresso.
import { useAuth } from "../../contexts/AuthContext";

// Obtém parâmetros da URL e permite navegação entre telas.
import { useLocalSearchParams, useRouter } from "expo-router";

// Componentes visuais do React Native.
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Contexto de tema.
// Permite aplicar modo claro e escuro.
import { useTheme } from "../../contexts/ThemeContext";

// URL do backend local.
const API_URL = "http://localhost:8080";

// Lista de desafios disponíveis nesta tela.
// Neste caso temos apenas o desafio AWS Difícil.
const challenges = [
  {
    id: "3",

    // Categoria da trilha.
    category: "AWS",

    // Nível do desafio.
    level: "Difícil",

    // Nome do desafio.
    title: "EC2 acessando S3",

    // Emoji ilustrativo.
    emoji: "🔐",

    // XP ganho ao concluir.
    xp: 250,

    // Conteúdo educacional apresentado antes do desafio.
    tutorial: [
      {
        title: "O que você vai aprender",
        text:
          "Neste módulo avançado você irá compreender como funciona a comunicação segura entre serviços da AWS utilizando IAM Roles e políticas de permissão.",
      },

      {
        title: "Cenário do Projeto",
        text:
          "Aplicações hospedadas em EC2 frequentemente precisam acessar arquivos armazenados no S3.",
      },

      {
        title: "O que é IAM?",
        text:
          "Serviço responsável pelo gerenciamento de usuários, permissões e acessos da AWS.",
      },

      {
        title: "O que é uma IAM Role?",
        text:
          "Identidade temporária utilizada por serviços AWS para acessar recursos com segurança.",
      },

      {
        title: "EC2 utilizando IAM Role",
        text:
          "A AWS fornece credenciais temporárias automaticamente para a instância.",
      },

      {
        title: "Segurança em ambientes cloud",
        text:
          "Utilizar IAM Roles e evitar credenciais fixas dentro do código.",
      },

      {
        title: "Estrutura da arquitetura",
        text:
          "Usuário → EC2 → IAM Role → AWS STS → Credenciais Temporárias → S3",
      },

      {
        title: "Etapa 1 — Criando Bucket S3",
        text:
          "Criar bucket, configurar região e permissões.",
      },

      {
        title: "Etapa 2 — Criando a EC2",
        text:
          "Criar instância EC2 com Security Group e IAM Role.",
      },

      {
        title: "Etapa 3 — Criando IAM Role",
        text:
          "Criar uma Role específica para EC2.",
      },

      {
        title: "Etapa 4 — Criando Política de Permissão",
        text:
          "Permitir ListBucket e GetObject.",
      },

      {
        title: "Associando Role à EC2",
        text:
          "Vincular a IAM Role à instância.",
      },

      {
        title: "Testando acesso ao S3",
        text:
          "Executar comandos AWS CLI para validar acesso.",
      },

      {
        title: "Possíveis erros comuns",
        text:
          "AccessDenied, credenciais inexistentes ou bucket incorreto.",
      },

      {
        title: "Boas práticas profissionais",
        text:
          "Utilizar IAM Roles, criptografia e princípio do menor privilégio.",
      },
    ],

    // Desafio final apresentado ao aluno.
    finalChallenge:
      "Configure uma EC2 com acesso seguro ao S3 utilizando IAM Roles e políticas de permissão.",
  },
];

// Tela principal do desafio.
export default function ChallengeScreen() {

  // Obtém o ID recebido pela rota.
  const { id } = useLocalSearchParams();

  // Permite navegação entre telas.
  const router = useRouter();

  // Obtém as cores do tema atual.
  const { theme } = useTheme();

  // Obtém usuário e função de atualização.
  const { usuario, atualizarUsuario } = useAuth();

  // Procura o desafio correspondente ao ID recebido.
  const challenge = challenges.find(
    (item) => item.id === String(id)
  );

  // Função chamada ao concluir o desafio.
  const concluirDesafio = async () => {

    // Se não encontrar desafio ou usuário.
    if (!challenge || !usuario?.email) {
      console.log(
        "Usuário ou desafio não encontrado para salvar progresso."
      );

      router.replace("(tabs)/dashboard");
      return;
    }

    try {

      // Envia ao backend que o desafio foi concluído.
      const response = await fetch(
        `${API_URL}/progresso/concluir?email=${encodeURIComponent(
          usuario.email
        )}&desafioId=${challenge.id}`,
        {
          method: "POST",
        }
      );

      // Se ocorrer erro.
      if (!response.ok) {
        const erro = await response.text();

        console.log(
          "Erro ao salvar progresso:",
          erro
        );

        return;
      }

      // Atualiza XP, nível e streak.
      if (atualizarUsuario) {
        await atualizarUsuario();
      }

      console.log(
        "Progresso salvo com sucesso!"
      );

      // Volta ao dashboard.
      router.replace("(tabs)/dashboard");

    } catch (error) {
      console.log(
        "Erro ao salvar progresso:",
        error
      );
    }
  };

  // Função para voltar ao dashboard.
  const voltarDashboard = async () => {

    // Atualiza usuário antes de voltar.
    if (atualizarUsuario) {
      await atualizarUsuario();
    }

    router.replace("(tabs)/dashboard");
  };

  // Caso o desafio não seja encontrado.
  if (!challenge) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: theme.background },
        ]}
      >
        <Text
          style={[
            styles.errorTitle,
            { color: theme.text },
          ]}
        >
          Desafio não encontrado 😵
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={voltarDashboard}
        >
          <Text style={styles.buttonText}>
            VOLTAR
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (

    // Tela com rolagem.
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      contentContainerStyle={styles.content}
    >

      {/* Botão voltar */}
      <TouchableOpacity onPress={voltarDashboard}>
        <Text style={styles.backText}>
          ← Voltar
        </Text>
      </TouchableOpacity>

      {/* Card principal do desafio */}
      <View
        style={[
          styles.heroCard,
          { backgroundColor: theme.card },
        ]}
      >
        <Text style={styles.emoji}>
          {challenge.emoji}
        </Text>

        <Text
          style={[
            styles.category,
            { color: theme.subtext },
          ]}
        >
          {challenge.category} • {challenge.level}
        </Text>

        <Text
          style={[
            styles.title,
            { color: theme.text },
          ]}
        >
          {challenge.title}
        </Text>

        <Text style={styles.xp}>
          +{challenge.xp} XP
        </Text>
      </View>

      {/* Título da seção de aprendizado */}
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.text },
        ]}
      >
        Aprenda antes do desafio
      </Text>

      {/* Renderiza todo o conteúdo do tutorial */}
      {challenge.tutorial.map((topic, index) => (
        <View
          key={index}
          style={[
            styles.topicCard,
            { backgroundColor: theme.card },
          ]}
        >
          <Text style={styles.topicNumber}>
            0{index + 1}
          </Text>

          <Text
            style={[
              styles.topicTitle,
              { color: theme.text },
            ]}
          >
            {topic.title}
          </Text>

          <Text
            style={[
              styles.topicText,
              { color: theme.subtext },
            ]}
          >
            {topic.text}
          </Text>
        </View>
      ))}

      {/* Card do desafio final */}
      <View style={styles.finalCard}>
        <Text style={styles.finalEmoji}>
          🎯
        </Text>

        <Text style={styles.finalTitle}>
          Desafio Final
        </Text>

        <Text style={styles.finalText}>
          {challenge.finalChallenge}
        </Text>
      </View>

      {/* Botão para concluir desafio */}
      <TouchableOpacity
        style={styles.button}
        onPress={concluirDesafio}
      >
        <Text style={styles.buttonText}>
          MARCAR COMO CONCLUÍDO
        </Text>
      </TouchableOpacity>

      {/* Botão de retorno */}
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
