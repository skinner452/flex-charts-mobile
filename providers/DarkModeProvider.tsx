import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useDarkMode = () => {
  const { darkMode, toggleDarkMode } = React.useContext(DarkModeContext);
  return { darkMode, toggleDarkMode };
};

export const DarkModeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("darkMode").then((value) => {
      setDarkMode(value === "true");
    });
  }, []);

  const toggleDarkMode = () => {
    AsyncStorage.setItem("darkMode", (!darkMode).toString());
    setDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
