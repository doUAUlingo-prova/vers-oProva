// Importa funções do React para trabalhar com Context API.
// createContext cria um contexto global.
// useContext permite acessar o contexto.
// useState armazena o avatar atualmente selecionado.
import {
  createContext,
  useContext,
  useState,
} from "react";

// Cria o contexto de avatar.
// Inicialmente recebe null.
const AvatarContext = createContext(null);

// Provider responsável por disponibilizar o avatar
// para toda a aplicação.
export function AvatarProvider({ children }) {

  // Armazena o avatar atualmente selecionado.
  // A coruja é o avatar padrão quando o usuário entra pela primeira vez.
  const [selectedAnimal, setSelectedAnimal] = useState("🦉");

  return (

    // Disponibiliza o avatar e a função de alteração
    // para qualquer componente da aplicação.
    <AvatarContext.Provider
      value={{

        // Avatar atual.
        selectedAnimal,

        // Função para trocar avatar.
        setSelectedAnimal,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

// Hook personalizado para acessar o contexto.
export function useAvatar() {

  // Obtém os dados do contexto.
  const context = useContext(AvatarContext);

  // Proteção para evitar uso fora do Provider.
  if (!context) {
    throw new Error(
      "useAvatar precisa estar dentro do AvatarProvider"
    );
  }

  // Retorna os dados do contexto.
  return context;
}