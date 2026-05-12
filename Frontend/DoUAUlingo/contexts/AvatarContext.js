import {
  createContext,
  useContext,
  useState,
} from "react";

const AvatarContext = createContext(null);

export function AvatarProvider({ children }) {
  const [selectedAnimal, setSelectedAnimal] = useState("🦉");

  return (
    <AvatarContext.Provider
      value={{
        selectedAnimal,
        setSelectedAnimal,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error(
      "useAvatar precisa estar dentro do AvatarProvider"
    );
  }

  return context;
}