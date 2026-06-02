// Importa os ícones prontos do Expo.
// Será usado para mostrar sol ou lua.
import { Ionicons } from "@expo/vector-icons";

// Importa componentes do React Native.
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Importa o contexto de tema.
// Ele fornece o tema atual e a função para alternar tema.
import { useTheme } from "../contexts/ThemeContext";

// Componente responsável por alternar entre
// modo claro e modo escuro.
export default function ThemeToggle() {

  // Obtém informações do contexto de tema.
  const {
    dark,         // Informa se o tema atual é escuro.
    toggleTheme,  // Função para alternar o tema.
    theme,        // Objeto contendo as cores atuais.
  } = useTheme();

  return (

    // Botão que alterna o tema ao ser clicado.
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.button,

        // Cor de fundo acompanha o tema atual.
        { backgroundColor: theme.card },
      ]}
    >

      {/* 
        Ícone muda conforme o tema:
        🌞 Sol = tema escuro ativo (clicar para voltar ao claro)
        🌙 Lua = tema claro ativo (clicar para ir ao escuro)
      */}
      <Ionicons
        name={dark ? "sunny" : "moon"}
        size={20}

        // Cor do ícone.
        color={
          dark
            ? "#facc15" // amarelo para o sol
            : theme.text // cor padrão do tema
        }
      />
    </TouchableOpacity>
  );
}

// Estilos do componente.
const styles = StyleSheet.create({

  // Botão flutuante de troca de tema.
  button: {

    // Posicionamento absoluto na tela.
    position: "absolute",

    // Distância do topo.
    top: 10,

    // Distância da direita.
    right: 15,

    // Espaçamento interno.
    padding: 10,

    // Deixa o botão circular.
    borderRadius: 50,

    // Sombra em Android.
    elevation: 5,
  },
});