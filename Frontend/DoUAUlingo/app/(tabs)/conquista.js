// Importa hooks do React.
// useState = armazena dados da tela.
// useEffect = executa ações quando a tela é carregada.
import { useEffect, useState } from "react";

// Componentes visuais do React Native.
import { ScrollView, StyleSheet, Text, View } from "react-native";

// Contexto de autenticação.
// Usado para obter o usuário logado.
import { useAuth } from "../../contexts/AuthContext";

// Contexto de tema.
// Permite alternar entre modo claro e escuro.
import { useTheme } from "../../contexts/ThemeContext";

// URL do backend local.
const API_URL = "http://localhost:8080";

// Tela responsável por exibir as conquistas do usuário.
export default function ConquistaPage() {

  // Obtém as cores do tema atual.
  const { theme } = useTheme();

  // Obtém o usuário autenticado.
  const { usuario } = useAuth();

  // Armazena os dados do perfil do usuário.
  const [perfil, setPerfil] = useState(null);

  // Armazena a lista de desafios concluídos.
  const [progresso, setProgresso] = useState([]);

  // Executa quando a tela abre.
  useEffect(() => {

    // Carrega os dados inicialmente.
    carregarDados();

    // Atualiza os dados automaticamente a cada 2 segundos.
    const interval = setInterval(() => {
      carregarDados();
    }, 2000);

    // Limpa o intervalo ao sair da tela.
    return () => clearInterval(interval);

  }, [usuario]);

  // Função responsável por buscar informações do backend.
  const carregarDados = async () => {

    // Se não existir usuário logado, não faz nada.
    if (!usuario?.email) return;

    try {

      // Busca informações do perfil.
      const perfilResponse = await fetch(
        `${API_URL}/usuarios/me?email=${usuario.email}`
      );

      const perfilData = await perfilResponse.json();

      // Salva os dados do perfil.
      setPerfil(perfilData);

      // Busca os desafios concluídos pelo usuário.
      const progressoResponse = await fetch(
        `${API_URL}/progresso?email=${usuario.email}`
      );

      const progressoData = await progressoResponse.json();

      // Salva o progresso.
      setProgresso(progressoData);

    } catch (error) {

      // Caso ocorra erro ao consultar a API.
      console.log("Erro ao carregar conquistas:", error);
    }
  };

  // XP atual do usuário.
  const xp = perfil?.xp || 0;

  // Nível atual.
  const nivel = perfil?.nivel || 1;

  // Sequência de dias estudando.
  const streak = perfil?.streak || 0;

  // Quantidade de desafios concluídos.
  const desafiosConcluidos = progresso.length;

  // Lista de conquistas disponíveis no sistema.
  const achievements = [

    {
      title: "Primeira lição",
      description: "Você completou sua primeira atividade.",
      emoji: "📚",

      // Desbloqueia após concluir 1 atividade.
      unlocked: desafiosConcluidos >= 1,
    },

    {
      title: "Sequência inicial",
      description: "Concluiu 2 dias de progresso no app.",
      emoji: "🔥",

      // Desbloqueia com streak de 2 dias.
      unlocked: streak >= 2,
    },

    {
      title: "Caçador de XP",
      description: "Acumulou pelo menos 150 XP no app.",
      emoji: "⭐",

      // Desbloqueia com 150 XP.
      unlocked: xp >= 150,
    },

    {
      title: "Mestre dos desafios",
      description: "Complete 3 desafios para desbloquear.",
      emoji: "🏆",

      // Desbloqueia após 3 desafios.
      unlocked: desafiosConcluidos >= 3,
    },

    {
      title: "Aluno lendário",
      description: "Chegue ao nível 2.",
      emoji: "🦉",

      // Desbloqueia ao atingir nível 2.
      unlocked: nivel >= 2,
    },
  ];

  // Conta quantas conquistas já foram liberadas.
  const desbloqueadas =
    achievements.filter((item) => item.unlocked).length;

  // Total de conquistas existentes.
  const total = achievements.length;

  // Calcula porcentagem concluída.
  const porcentagem =
    Math.floor((desbloqueadas / total) * 100);

  // Interface da tela.
  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background }
      ]}
      contentContainerStyle={styles.content}
    >

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.logoText}>doUAUlingo</Text>

        <Text style={[
          styles.title,
          { color: theme.text }
        ]}>
          Conquistas
        </Text>

        <Text style={[
          styles.subtitle,
          { color: theme.subtext }
        ]}>
          Veja seus troféus, metas e recompensas.
        </Text>
      </View>

      {/* Resumo geral das conquistas */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.card }
        ]}
      >

        <Text style={styles.summaryEmoji}>🏆</Text>

        <View style={styles.summaryInfo}>

          {/* Quantidade desbloqueada */}
          <Text
            style={[
              styles.summaryTitle,
              { color: theme.text }
            ]}
          >
            {desbloqueadas} de {total} desbloqueadas
          </Text>

          {/* Barra de progresso */}
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor:
                  theme.progressBg || "#e5e5e5",
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${porcentagem}%`,
                  backgroundColor:
                    theme.primary || "#58cc02",
                },
              ]}
            />
          </View>

          <Text
            style={[
              styles.progressText,
              { color: theme.subtext }
            ]}
          >
            Continue fazendo lições para ganhar mais conquistas.
          </Text>
        </View>
      </View>

      {/* Lista todas as conquistas */}
      {achievements.map((item) => (

        <View
          key={item.title}
          style={[
            styles.card,
            { backgroundColor: theme.card },

            // Se estiver bloqueada, diminui a opacidade.
            !item.unlocked && styles.lockedCard,
          ]}
        >

          {/* Ícone da conquista */}
          <View style={styles.iconBox}>
            <Text style={styles.cardEmoji}>
              {item.unlocked
                ? item.emoji
                : "🔒"}
            </Text>
          </View>

          {/* Informações da conquista */}
          <View style={styles.cardInfo}>
            <Text
              style={[
                styles.cardTitle,
                { color: theme.text }
              ]}
            >
              {item.title}
            </Text>

            <Text
              style={[
                styles.cardSub,
                { color: theme.subtext }
              ]}
            >
              {item.description}
            </Text>
          </View>

          {/* Status visual */}
          <Text style={styles.status}>
            {item.unlocked ? "✅" : "🔒"}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 22,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 20,
  },

  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#58cc02",
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
  },

  summaryCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },

  summaryEmoji: {
    fontSize: 42,
    marginRight: 14,
  },

  summaryInfo: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },

  progressBar: {
    width: "100%",
    height: 16,
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
  },

  progressText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "800",
  },

  card: {
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

  lockedCard: {
    opacity: 0.55,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  cardEmoji: {
    fontSize: 28,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  cardSub: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },

  status: {
    fontSize: 22,
    marginLeft: 8,
  },
});