// Importa o hook de navegação do Expo Router.
import { useRouter } from "expo-router";

// Importa hooks do React.
// useEffect executa ações quando a tela carrega.
// useState armazena dados e controla estados da tela.
import { useEffect, useState } from "react";

// Importa componentes visuais do React Native.
import {
  Alert, // Exibe alertas na tela.
  Image, // Exibe imagens.
  ScrollView, // Permite rolagem da tela.
  StyleSheet, // Cria os estilos.
  Text, // Exibe textos.
  TextInput, // Campo de texto.
  TouchableOpacity, // Botão clicável.
  View, // Container visual.
} from "react-native";

// Contexto de autenticação.
// Usado para acessar o usuário logado e fazer logout.
import { useAuth } from "../../contexts/AuthContext";

// Contexto de avatar.
// Usado para pegar e alterar o mascote escolhido.
import { useAvatar } from "../../contexts/AvatarContext";

// Contexto de tema.
// Usado para aplicar tema claro/escuro.
import { useTheme } from "../../contexts/ThemeContext";

// Imagem local da capivara.
import capivara from "../../assets/avatars/capivara.webp";

// URL do backend local.
const API_URL = "http://localhost:8080";

// Tela de perfil do usuário.
export default function Profile() {
  // Pega o usuário logado e a função de logout.
  const { usuario, logout } = useAuth();

  // Pega o tema atual e a função para alternar tema.
  const { theme, toggleTheme } = useTheme();

  // Pega o avatar selecionado e a função para alterar.
  const { selectedAnimal, setSelectedAnimal } = useAvatar();

  // Hook de navegação.
  const router = useRouter();

  // Armazena os dados completos do perfil.
  const [perfil, setPerfil] = useState(null);

  // Armazena o progresso/desafios concluídos.
  const [progresso, setProgresso] = useState([]);

  // Armazena a nova senha digitada.
  const [novaSenha, setNovaSenha] = useState("");

  // Controla se o campo de alterar senha aparece ou não.
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Armazena o novo nome digitado.
  const [novoNome, setNovoNome] = useState("");

  // Controla se o usuário está editando o nome.
  const [editandoNome, setEditandoNome] = useState(false);

  // Lista de mascotes disponíveis.
  const animals = [
    { id: "owl", emoji: "🦉" },
    { id: "cat", emoji: "🐱" },
    { id: "dog", emoji: "🐶" },
    { id: "panda", emoji: "🐼" },
    { id: "fox", emoji: "🦊" },
    { id: "frog", emoji: "🐸" },
    { id: "monkey", emoji: "🐵" },
    { id: "koala", emoji: "🐨" },
    { id: "capybara", image: capivara },
  ];

  // Carrega o perfil sempre que o e-mail do usuário mudar.
  useEffect(() => {
    carregarPerfil();
  }, [usuario?.email]);

  // Busca os dados do perfil e progresso no backend.
  const carregarPerfil = async () => {
    // Se não tiver usuário logado, não faz nada.
    if (!usuario?.email) return;

    try {
      // Busca dados do usuário.
      const response = await fetch(
        `${API_URL}/usuarios/me?email=${usuario.email}`
      );

      const data = await response.json();

      // Salva dados do perfil.
      setPerfil(data);

      // Busca progresso do usuário.
      const progressoResponse = await fetch(
        `${API_URL}/progresso?email=${usuario.email}`
      );

      const progressoData = await progressoResponse.json();

      // Salva progresso.
      setProgresso(progressoData);

      // Se o usuário tiver avatar salvo, atualiza no contexto.
      if (data.avatar) {
        setSelectedAnimal(data.avatar);
      }
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
    }
  };

  // Atualiza o avatar/mascote do usuário.
  const atualizarAvatar = async (avatar) => {
    // Garante que existe e-mail para atualizar.
    if (!perfil?.email && !usuario?.email) return;

    const emailUsuario = perfil?.email || usuario?.email;

    try {
      // Atualiza visualmente na hora.
      setSelectedAnimal(avatar);

      // Envia o novo avatar para o backend.
      const response = await fetch(
        `${API_URL}/usuarios/avatar?email=${emailUsuario}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar }),
        }
      );

      const data = await response.json();

      // Atualiza o perfil local com o avatar novo.
      setPerfil((old) => ({
        ...old,
        ...data,
        avatar,
      }));
    } catch (error) {
      console.log("Erro ao atualizar avatar:", error);
    }
  };

  // Altera o nome do usuário.
  const alterarNome = async () => {
    // Se não tiver perfil carregado, não faz nada.
    if (!perfil?.email) return;

    // Valida se o nome é válido.
    if (!novoNome || novoNome.trim().length < 2) {
      Alert.alert("Nome inválido", "Digite um nome válido.");
      return;
    }

    try {
      // Envia o novo nome para o backend.
      const response = await fetch(
        `${API_URL}/usuarios/nome?email=${perfil.email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: novoNome.trim() }),
        }
      );

      // Se der erro, exibe alerta.
      if (!response.ok) {
        Alert.alert("Erro", "Não foi possível alterar o nome.");
        return;
      }

      const data = await response.json();

      // Atualiza o nome localmente.
      setPerfil((old) => ({
        ...old,
        nome: data.nome || novoNome.trim(),
      }));

      // Limpa o campo e fecha modo de edição.
      setNovoNome("");
      setEditandoNome(false);
    } catch (error) {
      console.log("Erro ao alterar nome:", error);
      Alert.alert("Erro", "Não foi possível alterar o nome.");
    }
  };

  // Altera a senha do usuário.
  const alterarSenha = async () => {
    // Se não tiver perfil carregado, não faz nada.
    if (!perfil?.email) return;

    // Valida tamanho mínimo da senha.
    if (!novaSenha || novaSenha.length < 6) {
      Alert.alert("Senha inválida", "A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    try {
      // Envia a nova senha para o backend.
      const response = await fetch(
        `${API_URL}/usuarios/senha?email=${perfil.email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senha: novaSenha }),
        }
      );

      // Se der erro, mostra alerta.
      if (!response.ok) {
        Alert.alert("Erro", "Não foi possível alterar a senha.");
        return;
      }

      // Limpa o campo e fecha a área de senha.
      setNovaSenha("");
      setMostrarSenha(false);

      Alert.alert("Sucesso", "Senha alterada com sucesso!");
    } catch (error) {
      console.log("Erro ao alterar senha:", error);
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  };

  // Lista de estatísticas exibidas na tela.
  const stats = [
    { label: "Dias seguidos", value: perfil?.streak || 0, emoji: "🔥" },
    { label: "XP total", value: perfil?.xp || 0, emoji: "⭐" },
    { label: "Nível", value: perfil?.nivel || 1, emoji: "🏆" },
  ];

  // Dados usados para calcular conquistas.
  const xp = perfil?.xp || 0;
  const nivel = perfil?.nivel || 1;
  const streak = perfil?.streak || 0;
  const desafiosConcluidos = progresso?.length || 0;

  // Lista de conquistas desbloqueadas.
  const achievements = [
    { title: "Primeira lição", emoji: "📚", unlocked: desafiosConcluidos >= 1 },
    { title: "Sequência inicial", emoji: "🔥", unlocked: streak >= 2 },
    { title: "Caçador de XP", emoji: "⭐", unlocked: xp >= 150 },
    { title: "Mestre dos desafios", emoji: "🏆", unlocked: desafiosConcluidos >= 3 },
    { title: "Aluno lendário", emoji: "🦉", unlocked: nivel >= 2 },
  ].filter((item) => item.unlocked);

  // Faz logout e manda o usuário para a tela de login.
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // Renderiza o avatar selecionado.
  const renderSelectedAvatar = () => {
    const animal = animals.find(
      (item) => item.id === selectedAnimal || item.emoji === selectedAnimal
    );

    // Se o avatar for imagem, renderiza imagem.
    if (animal?.image) {
      return <Image source={animal.image} style={styles.avatarImage} />;
    }

    // Se for emoji, renderiza texto.
    return <Text style={styles.avatarEmoji}>{animal?.emoji || "🦉"}</Text>;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Cabeçalho da tela */}
      <View style={styles.header}>
        <Text style={styles.logoText}>doUAUlingo</Text>

        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          Seu perfil de aprendizado
        </Text>
      </View>

      {/* Card principal do perfil */}
      <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
        <View style={styles.avatarCircle}>{renderSelectedAvatar()}</View>

        {/* Área de nome: pode mostrar ou editar */}
        <View style={styles.nameRow}>
          {editandoNome ? (
            <>
              <TextInput
                value={novoNome}
                onChangeText={setNovoNome}
                placeholder="Nome"
                placeholderTextColor="#999"
                style={styles.nameInput}
              />

              <TouchableOpacity onPress={alterarNome} style={styles.nameSaveButton}>
                <Text style={styles.nameSaveText}>✓</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setNovoNome("");
                  setEditandoNome(false);
                }}
                style={styles.nameCancelButton}
              >
                <Text style={styles.nameCancelText}>×</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.userName, { color: theme.text }]}>
                {perfil?.nome?.split(" ")[0] || "Usuário"}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setNovoNome(perfil?.nome || "");
                  setEditandoNome(true);
                }}
                style={styles.editNameButton}
              >
                <Text style={styles.editNameText}>✏️</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Text style={[styles.userEmail, { color: theme.subtext }]}>
          {perfil?.email || "usuario@email.com"}
        </Text>

        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Nível {perfil?.nivel || 1}</Text>
        </View>
      </View>

      {/* Escolha de mascote */}
      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Escolha seu mascote
        </Text>

        <View style={styles.animalGrid}>
          {animals.map((animal) => (
            <TouchableOpacity
              key={animal.id}
              style={[
                styles.animalButton,
                selectedAnimal === animal.id && styles.selectedAnimal,
              ]}
              onPress={() => atualizarAvatar(animal.id)}
            >
              {animal.image ? (
                <Image source={animal.image} style={styles.animalImage} />
              ) : (
                <Text style={styles.animalEmoji}>{animal.emoji}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Estatísticas do usuário */}
      <View style={styles.statsRow}>
        {stats.map((item) => (
          <View
            key={item.label}
            style={[styles.statCard, { backgroundColor: theme.card }]}
          >
            <Text style={styles.statEmoji}>{item.emoji}</Text>

            <Text style={[styles.statValue, { color: theme.text }]}>
              {item.value}
            </Text>

            <Text style={[styles.statLabel, { color: theme.subtext }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Conquistas desbloqueadas */}
      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Conquistas
        </Text>

        {achievements.length > 0 ? (
          achievements.map((item) => (
            <View key={item.title} style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>{item.emoji}</Text>

              <Text style={[styles.achievementText, { color: theme.text }]}>
                {item.title}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: theme.subtext }]}>
            Nenhuma conquista ainda.
          </Text>
        )}
      </View>

      {/* Configurações */}
      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Configurações
        </Text>

        {/* Alternar tema */}
        <TouchableOpacity style={styles.optionButton} onPress={toggleTheme}>
          <Text style={styles.optionIcon}>🌗</Text>
          <Text style={[styles.optionText, { color: theme.text }]}>
            Alternar tema claro/escuro
          </Text>
        </TouchableOpacity>

        {/* Mostrar/ocultar área de redefinição de senha */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => setMostrarSenha(!mostrarSenha)}
        >
          <Text style={styles.optionIcon}>🔐</Text>
          <Text style={[styles.optionText, { color: theme.text }]}>
            Redefinir senha
          </Text>
        </TouchableOpacity>

        {/* Campo para alterar senha */}
        {mostrarSenha && (
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Nova senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
              style={styles.passwordInput}
            />

            <TouchableOpacity
              style={styles.savePasswordButton}
              onPress={alterarSenha}
            >
              <Text style={styles.savePasswordText}>Salvar nova senha</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Botão de sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>SAIR DA CONTA</Text>
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
    marginBottom: 20,
  },

  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#58cc02",
    letterSpacing: 1,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
  },

  profileCard: {
    alignItems: "center",
    borderRadius: 24,
    padding: 22,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
    marginBottom: 16,
  },

  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#58cc02",
    marginBottom: 14,
    overflow: "hidden",
  },

  avatarEmoji: {
    fontSize: 54,
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },

  editNameButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#58cc02",
  },

  editNameText: {
    fontSize: 13,
  },

  nameInput: {
    width: 150,
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    textAlign: "center",
    fontWeight: "900",
    fontSize: 18,
    borderWidth: 2,
    borderColor: "#58cc02",
  },

  nameSaveButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#58cc02",
  },

  nameSaveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },

  nameCancelButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4b4b",
  },

  nameCancelText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  userName: {
    fontSize: 26,
    fontWeight: "900",
  },

  userEmail: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  levelBadge: {
    marginTop: 14,
    backgroundColor: "#58cc02",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    borderBottomWidth: 4,
    borderBottomColor: "#46a302",
  },

  levelText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  animalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },

  animalButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 4,
    borderBottomColor: "#d1d1d1",
    overflow: "hidden",
  },

  selectedAnimal: {
    backgroundColor: "#d7ffb8",
    borderColor: "#58cc02",
    borderBottomColor: "#46a302",
  },

  animalEmoji: {
    fontSize: 32,
  },

  animalImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    resizeMode: "cover",
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

  statValue: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 4,
  },

  statLabel: {
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  sectionCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },

  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  achievementEmoji: {
    fontSize: 24,
    marginRight: 12,
  },

  achievementText: {
    fontSize: 15,
    fontWeight: "800",
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "700",
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  optionText: {
    fontSize: 15,
    fontWeight: "800",
  },

  passwordContainer: {
    marginTop: 12,
  },

  passwordInput: {
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontWeight: "700",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },

  savePasswordButton: {
    marginTop: 10,
    backgroundColor: "#58cc02",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#46a302",
  },

  savePasswordText: {
    color: "#fff",
    fontWeight: "900",
  },

  logoutButton: {
    backgroundColor: "#ff4b4b",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#cc3838",
  },

  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
});