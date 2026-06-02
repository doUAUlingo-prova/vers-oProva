// Importa o useFocusEffect e o useRouter do Expo Router.
// useFocusEffect executa uma ação sempre que a tela entra em foco.
// useRouter permite navegar para outras telas.
import { useFocusEffect, useRouter } from "expo-router";

// Importa hooks do React.
// useCallback evita recriar funções sem necessidade.
// useState armazena estados da tela.
import { useCallback, useState } from "react";

// Importa componentes visuais do React Native.
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Contexto de autenticação.
// Usado para acessar o usuário logado e atualizar seus dados.
import { useAuth } from "../../contexts/AuthContext";

// Contexto de avatar.
// Usado para acessar o avatar escolhido pelo usuário.
import { useAvatar } from "../../contexts/AvatarContext";

// Contexto de tema.
// Usado para aplicar tema claro/escuro na tela.
import { useTheme } from "../../contexts/ThemeContext";

// Importa imagem local da capivara.
import capivara from "../../assets/avatars/capivara.webp";

// URL do backend local.
const API_URL = "http://localhost:8080";

// Componente principal do Dashboard.
export default function Dashboard() {
  // Obtém o usuário logado e a função para atualizar os dados do usuário.
  const { usuario, atualizarUsuario } = useAuth();

  // Obtém as cores do tema atual.
  const { theme } = useTheme();

  // Obtém o animal/avatar selecionado.
  const { selectedAnimal } = useAvatar();

  // Permite navegar entre telas.
  const router = useRouter();

  // Controla qual trilha está selecionada: AWS ou Expo.
  const [selectedTab, setSelectedTab] = useState("AWS");

  // Armazena os dados do perfil vindos do backend.
  const [perfil, setPerfil] = useState(null);

  // Armazena os desafios concluídos pelo usuário.
  const [progresso, setProgresso] = useState([]);

  // Mapeia os avatares disponíveis.
  // Alguns são emojis e a capivara é uma imagem local.
  const avatarMap = {
    owl: "🦉",
    cat: "🐱",
    dog: "🐶",
    panda: "🐼",
    fox: "🦊",
    frog: "🐸",
    monkey: "🐵",
    koala: "🐨",
    capybara: capivara,

    // Também aceita emojis salvos diretamente.
    "🦉": "🦉",
    "🐱": "🐱",
    "🐶": "🐶",
    "🐼": "🐼",
    "🦊": "🦊",
    "🐸": "🐸",
    "🐵": "🐵",
    "🐨": "🐨",
  };

  // Define as trilhas, níveis e desafios disponíveis no app.
  const challengeSections = {
    AWS: [
      {
        level: "Fácil",
        color: "#58cc02",
        route: "/awschalenge/facil?id=1",
        challenges: [
          {
            id: 1,
            title: "Criando um Bucket S3",
            xp: 50,
            emoji: "☁️",
            topics: [
              "Entenda o que é o Amazon S3 e para que ele serve.",
              "Aprenda como criar um bucket e enviar arquivos.",
              "Desafio Final: crie um bucket e envie 3 arquivos.",
            ],
          },
        ],
      },
      {
        level: "Médio",
        color: "#ffb020",
        route: "/awschalenge/medio?id=2",
        challenges: [
          {
            id: 2,
            title: "EC2 com servidor web",
            xp: 120,
            emoji: "🖥️",
            topics: [
              "Entenda o que é uma instância EC2.",
              "Aprenda como instalar Apache ou Nginx.",
              "Desafio Final: hospede uma página HTML na EC2.",
            ],
          },
        ],
      },
      {
        level: "Difícil",
        color: "#ff4b4b",
        route: "/awschalenge/dificil?id=3",
        challenges: [
          {
            id: 3,
            title: "EC2 acessando S3",
            xp: 250,
            emoji: "🔐",
            topics: [
              "Entenda permissões IAM e roles.",
              "Aprenda como listar arquivos do S3 pela EC2.",
              "Desafio Final: configure uma EC2 com acesso seguro ao S3.",
            ],
          },
        ],
      },
    ],

    Expo: [
      {
        level: "Fácil",
        color: "#58cc02",
        route: "/expochalenge/facil?id=4",
        challenges: [
          {
            id: 4,
            title: "Primeira tela no Expo",
            xp: 40,
            emoji: "📱",
            topics: [
              "Entenda View, Text e StyleSheet.",
              "Aprenda como montar uma tela simples.",
              "Desafio Final: crie uma tela de perfil.",
            ],
          },
        ],
      },
      {
        level: "Médio",
        color: "#ffb020",
        route: "/expochalenge/medio?id=5",
        challenges: [
          {
            id: 5,
            title: "Navegação com Expo Router",
            xp: 100,
            emoji: "🧭",
            topics: [
              "Entenda como o expo-router funciona.",
              "Aprenda como navegar entre páginas.",
              "Desafio Final: crie Login, Cadastro e Dashboard.",
            ],
          },
        ],
      },
      {
        level: "Difícil",
        color: "#ff4b4b",
        route: "/expochalenge/dificil?id=6",
        challenges: [
          {
            id: 6,
            title: "Consumindo API no Expo",
            xp: 200,
            emoji: "⚡",
            topics: [
              "Entenda fetch, axios e useEffect.",
              "Aprenda como exibir dados vindos de uma API.",
              "Desafio Final: crie um app consumindo uma API real.",
            ],
          },
        ],
      },
    ],
  };

  // Função responsável por carregar os dados do usuário e progresso.
  const carregarDados = useCallback(async () => {
    // Se não existir usuário logado, limpa os dados da tela.
    if (!usuario?.email) {
      setPerfil(null);
      setProgresso([]);
      return;
    }

    try {
      // Atualiza os dados do usuário no contexto, se a função existir.
      if (atualizarUsuario) {
        await atualizarUsuario();
      }

      // Codifica o e-mail para evitar problemas com caracteres especiais na URL.
      const emailEncoded = encodeURIComponent(usuario.email);

      // Busca os dados do perfil no backend.
      const perfilResponse = await fetch(
        `${API_URL}/usuarios/me?email=${emailEncoded}`
      );

      // Se a resposta for OK, salva o perfil no estado.
      if (perfilResponse.ok) {
        const perfilData = await perfilResponse.json();
        setPerfil(perfilData);
      } else {
        console.log("Erro ao carregar perfil:", await perfilResponse.text());
      }

      // Busca o progresso do usuário no backend.
      const progressoResponse = await fetch(
        `${API_URL}/progresso?email=${emailEncoded}`
      );

      // Se a resposta for OK, salva a lista de progresso.
      if (progressoResponse.ok) {
        const progressoData = await progressoResponse.json();

        // Garante que o progresso seja sempre um array.
        setProgresso(Array.isArray(progressoData) ? progressoData : []);
      } else {
        console.log(
          "Erro ao carregar progresso:",
          await progressoResponse.text()
        );
      }
    } catch (error) {
      // Caso ocorra erro de conexão ou erro inesperado.
      console.log("Erro ao carregar dados:", error);
    }
  }, [usuario?.email, atualizarUsuario]);

  // Executa carregarDados sempre que o Dashboard entra em foco.
  // Isso atualiza XP, nível e progresso quando o usuário volta de uma lição.
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  // Retorna todos os desafios da trilha selecionada.
  const getDesafiosDaTrilha = () => {
    return challengeSections[selectedTab].flatMap(
      (section) => section.challenges
    );
  };

  // Verifica se um desafio já foi concluído.
  const desafioConcluido = (id) => {
    return progresso.some((item) => Number(item.desafio?.id) === Number(id));
  };

  // Verifica se um desafio deve ficar bloqueado.
  // Um desafio só é liberado se o desafio anterior foi concluído.
  const desafioBloqueado = (challengeId) => {
    const desafiosDaTrilha = getDesafiosDaTrilha();

    const index = desafiosDaTrilha.findIndex(
      (item) => Number(item.id) === Number(challengeId)
    );

    // O primeiro desafio da trilha nunca fica bloqueado.
    if (index <= 0) return false;

    // Pega o desafio anterior.
    const desafioAnterior = desafiosDaTrilha[index - 1];

    // Se o anterior não foi concluído, este fica bloqueado.
    return !desafioConcluido(desafioAnterior.id);
  };

  // Calcula a porcentagem de progresso da trilha selecionada.
  const getProgressoTrilha = () => {
    const desafiosDaTrilha = getDesafiosDaTrilha();

    // Evita divisão por zero.
    if (desafiosDaTrilha.length === 0) return 0;

    // Conta quantos desafios foram concluídos.
    const concluidos = desafiosDaTrilha.filter((desafio) =>
      desafioConcluido(desafio.id)
    ).length;

    // Retorna a porcentagem concluída.
    return Math.floor((concluidos / desafiosDaTrilha.length) * 100);
  };

  // Retorna a aula atual, ou seja, o próximo desafio não concluído.
  const getAulaAtual = () => {
    const desafiosDaTrilha = getDesafiosDaTrilha();

    const proximaAula = desafiosDaTrilha.find(
      (desafio) => !desafioConcluido(desafio.id)
    );

    // Se não houver próxima aula, a trilha foi concluída.
    if (!proximaAula) {
      return `${selectedTab}: trilha concluída!`;
    }

    return `${selectedTab}: ${proximaAula.title}`;
  };

  // Busca a primeira aula disponível para o usuário iniciar.
  const getPrimeiraAulaDisponivel = () => {
    const desafiosDaTrilha = getDesafiosDaTrilha();

    const proximaAula = desafiosDaTrilha.find(
      (desafio) => !desafioConcluido(desafio.id) && !desafioBloqueado(desafio.id)
    );

    // Se não encontrar, retorna o primeiro desafio da trilha.
    return proximaAula || desafiosDaTrilha[0];
  };

  // Descobre a rota de navegação de acordo com o ID do desafio.
  const getRouteByChallengeId = (challengeId) => {
    for (const section of challengeSections[selectedTab]) {
      const found = section.challenges.find(
        (item) => Number(item.id) === Number(challengeId)
      );

      if (found) {
        return section.route;
      }
    }

    // Retorno padrão caso não encontre.
    return challengeSections[selectedTab][0].route;
  };

  // Renderiza o avatar do usuário.
  const renderAvatar = () => {
    // Usa o avatar salvo no perfil ou o avatar selecionado localmente.
    const avatarKey = perfil?.avatar || selectedAnimal;

    // Busca o avatar no mapa. Se não encontrar, usa a coruja.
    const avatar = avatarMap[avatarKey] || "🦉";

    // Se o avatar for texto, renderiza como emoji.
    if (typeof avatar === "string") {
      return <Text style={styles.avatarEmoji}>{avatar}</Text>;
    }

    // Se for imagem, renderiza com o componente Image.
    return <Image source={avatar} style={styles.avatarImage} />;
  };

  // Inicia uma lição.
  const startLevel = (route, challengeId) => {
    // Se o desafio estiver bloqueado, não permite entrar.
    if (desafioBloqueado(challengeId)) return;

    // Navega para a rota do desafio.
    router.push(route);
  };

  // Calcula o progresso da trilha atual.
  const progressoTrilha = getProgressoTrilha();

  return (
    // ScrollView permite rolar a tela.
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Cabeçalho com logo, saudação e avatar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>doUAUlingo</Text>

          {/* Saudação usando o primeiro nome do usuário */}
          <Text style={[styles.welcome, { color: theme.text }]}>
            Olá, {perfil?.nome?.split(" ")[0] || usuario?.nome?.split(" ")[0] || "Usuário"} 👋
          </Text>

          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Continue sua jornada de aprendizado.
          </Text>
        </View>

        {/* Avatar do usuário */}
        <View style={styles.avatarCircle}>{renderAvatar()}</View>
      </View>

      {/* Card principal com progresso da trilha */}
      <View style={[styles.mainCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.subtext }]}>
          Seu progresso em {selectedTab}
        </Text>

        <Text style={[styles.lessonTitle, { color: theme.text }]}>
          Aula atual:
        </Text>

        <Text style={[styles.currentLesson, { color: theme.subtext }]}>
          {getAulaAtual()}
        </Text>

        {/* Barra de progresso */}
        <View
          style={[
            styles.progressBar,
            { backgroundColor: theme.progressBg || "#e5e5e5" },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressoTrilha}%`,
                backgroundColor: theme.primary || "#58cc02",
              },
            ]}
          />
        </View>

        <Text style={[styles.progressText, { color: theme.subtext }]}>
          {progressoTrilha}% concluído
        </Text>
      </View>

      {/* Cards de estatísticas do usuário */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {perfil?.streak ?? usuario?.streak ?? 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>dias</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statEmoji}>⭐</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {perfil?.xp ?? usuario?.xp ?? 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>XP</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statEmoji}>🏆</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {perfil?.nivel ?? usuario?.nivel ?? 1}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            nível
          </Text>
        </View>
      </View>

      {/* Título da seleção de trilhas */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Escolha sua trilha
      </Text>

      {/* Botões para trocar entre trilha AWS e Expo */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "AWS" && styles.activeTab]}
          onPress={() => setSelectedTab("AWS")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "AWS" && styles.activeTabText,
            ]}
          >
            ☁️ AWS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "Expo" && styles.activeTab]}
          onPress={() => setSelectedTab("Expo")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Expo" && styles.activeTabText,
            ]}
          >
            📱 Expo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Renderiza os níveis e desafios da trilha selecionada */}
      {challengeSections[selectedTab].map((levelData) => (
        <View key={levelData.level} style={styles.levelContainer}>
          {/* Badge do nível: Fácil, Médio ou Difícil */}
          <View
            style={[styles.levelBadge, { backgroundColor: levelData.color }]}
          >
            <Text style={styles.levelText}>{levelData.level}</Text>
          </View>

          {/* Renderiza os desafios dentro de cada nível */}
          {levelData.challenges.map((challenge) => {
            // Verifica se o desafio foi concluído.
            const concluido = desafioConcluido(challenge.id);

            // Verifica se o desafio está bloqueado.
            const bloqueado = desafioBloqueado(challenge.id);

            return (
              <View
                key={challenge.id}
                style={[
                  styles.challengeCard,
                  { backgroundColor: theme.card },

                  // Aplica estilo de bloqueado se necessário.
                  bloqueado && styles.challengeBlocked,

                  // Aplica estilo de concluído se necessário.
                  concluido && styles.challengeDone,
                ]}
              >
                {/* Ícone ou cadeado do desafio */}
                <View style={styles.challengeIcon}>
                  <Text style={styles.challengeEmoji}>
                    {bloqueado ? "🔒" : challenge.emoji}
                  </Text>
                </View>

                {/* Informações do desafio */}
                <View style={styles.challengeInfo}>
                  <Text style={[styles.challengeTitle, { color: theme.text }]}>
                    {challenge.title}
                  </Text>

                  {/* Mostra XP, Concluído ou Bloqueado */}
                  <Text
                    style={[
                      styles.challengeXP,
                      concluido && styles.challengeCompletedText,
                      bloqueado && styles.challengeLockedText,
                    ]}
                  >
                    {concluido
                      ? "Concluído"
                      : bloqueado
                      ? "Bloqueado"
                      : `+${challenge.xp} XP`}
                  </Text>

                  {/* Lista de tópicos do desafio */}
                  <View style={styles.topicsBox}>
                    {challenge.topics.map((topic, index) => (
                      <Text
                        key={index}
                        style={[
                          styles.topicText,
                          { color: theme.subtext },

                          // O terceiro tópico é tratado como desafio final.
                          index === 2 && styles.finalChallengeText,

                          // Se bloqueado, aplica estilo mais apagado.
                          bloqueado && styles.lockedTopicText,
                        ]}
                      >
                        {index === 2 ? "🎯 " : "• "}
                        {topic}
                      </Text>
                    ))}
                  </View>
                </View>

                {/* Botão de iniciar desafio */}
                <TouchableOpacity
                  disabled={bloqueado}
                  style={[
                    styles.playButton,
                    bloqueado && styles.playButtonBlocked,
                    concluido && styles.playButtonDone,
                  ]}
                  onPress={() => startLevel(levelData.route, challenge.id)}
                >
                  <Text style={styles.playButtonText}>
                    {concluido ? "✓" : bloqueado ? "🔒" : "▶"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ))}

      {/* Botão principal para iniciar a próxima lição disponível */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          const aula = getPrimeiraAulaDisponivel();
          const rota = getRouteByChallengeId(aula.id);

          startLevel(rota, aula.id);
        }}
      >
        <Text style={styles.primaryText}>
          {progressoTrilha === 100 ? "TRILHA CONCLUÍDA" : "INICIAR LIÇÃO"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  content: {
    padding: 22,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#58cc02",
    letterSpacing: 1,
  },

  welcome: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
  },

  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 36,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#58cc02",
    overflow: "hidden",
  },

  avatarEmoji: {
    fontSize: 34,
  },

  avatarImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    resizeMode: "cover",
  },

  mainCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },

  lessonTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 4,
  },

  currentLesson: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 14,
  },

  progressBar: {
    width: "100%",
    height: 18,
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
  },

  progressText: {
    marginTop: 10,
    fontWeight: "800",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },

  statEmoji: {
    fontSize: 24,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "800",
  },

  sectionTitle: {
    marginTop: 10,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: "900",
  },

  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#cfcfcf",
  },

  activeTab: {
    backgroundColor: "#58cc02",
    borderBottomColor: "#46a302",
  },

  tabText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#555",
  },

  activeTabText: {
    color: "#fff",
  },

  levelContainer: {
    marginBottom: 18,
  },

  levelBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  levelText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  challengeCard: {
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

  challengeDone: {
    borderColor: "#58cc02",
    borderBottomColor: "#46a302",
  },

  challengeBlocked: {
    opacity: 0.55,
  },

  challengeIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  challengeEmoji: {
    fontSize: 28,
  },

  challengeInfo: {
    flex: 1,
  },

  challengeTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  challengeXP: {
    marginTop: 6,
    color: "#ffb020",
    fontWeight: "900",
    fontSize: 13,
  },

  challengeCompletedText: {
    color: "#58cc02",
  },

  challengeLockedText: {
    color: "#999",
  },

  topicsBox: {
    marginTop: 10,
    gap: 6,
  },

  topicText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },

  finalChallengeText: {
    color: "#58cc02",
    fontWeight: "900",
  },

  lockedTopicText: {
    opacity: 0.7,
  },

  playButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#58cc02",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#46a302",
    marginLeft: 8,
  },

  playButtonDone: {
    backgroundColor: "#1cb0f6",
    borderBottomColor: "#0f8ac0",
  },

  playButtonBlocked: {
    backgroundColor: "#e5e5e5",
    borderBottomColor: "#cfcfcf",
  },

  playButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    borderBottomWidth: 5,
    borderBottomColor: "#46a302",
  },

  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
});