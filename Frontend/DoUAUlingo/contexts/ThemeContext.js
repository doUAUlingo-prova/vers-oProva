// Importa funções do React.
// createContext cria um contexto global.
// useContext permite acessar esse contexto.
// useState armazena o estado atual do tema.
import React, {
  createContext,
  useContext,
  useState,
} from "react";

// Cria o contexto de tema.
const ThemeContext = createContext();

// =======================
// TEMA ESCURO
// =======================
// Conjunto de cores utilizadas quando o modo escuro está ativo.
const darkTheme = {

  // Cor de fundo principal das telas.
  background: "#0a0a0a",

  // Cor dos cards.
  card: "#1a1a1a",

  // Cor de caixas secundárias.
  box: "#222",

  // Cor principal dos textos.
  text: "#fff",

  // Cor de textos secundários.
  subtext: "#aaa",

  // Cor para informações menos importantes.
  muted: "#666",

  // Cor principal da aplicação.
  primary: "#e11d48",

  // Cor de fundo das barras de progresso.
  progressBg: "#333"
};

// =======================
// TEMA CLARO
// =======================
// Conjunto de cores utilizadas quando o modo claro está ativo.
const lightTheme = {

  // Cor de fundo principal.
  background: "#f5f5f5",

  // Cor dos cards.
  card: "#ffffff",

  // Cor de caixas secundárias.
  box: "#f0f0f0",

  // Cor principal dos textos.
  text: "#000",

  // Cor dos textos secundários.
  subtext: "#555",

  // Cor de informações menos importantes.
  muted: "#888",

  // Cor principal da aplicação.
  primary: "#e11d48",

  // Cor de fundo das barras de progresso.
  progressBg: "#ddd"
};

// Provider responsável por disponibilizar o tema
// para toda a aplicação.
export const ThemeProvider = ({ children }) => {

  // Controla se o tema atual é escuro ou claro.
  // true = escuro
  // false = claro
  const [dark, setDark] = useState(true);

  // Função responsável por alternar os temas.
  const toggleTheme = () => setDark(!dark);

  // Define qual conjunto de cores será utilizado.
  const theme = dark
    ? darkTheme
    : lightTheme;

  return (

    // Disponibiliza os dados do tema para toda a aplicação.
    <ThemeContext.Provider
      value={{

        // Indica se o tema atual é escuro.
        dark,

        // Função para alternar tema.
        toggleTheme,

        // Objeto contendo todas as cores do tema atual.
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para acessar o contexto.
// Assim qualquer tela pode usar:
//
// const { theme } = useTheme();
//
// ou
//
// const { toggleTheme } = useTheme();
export const useTheme = () => useContext(ThemeContext);