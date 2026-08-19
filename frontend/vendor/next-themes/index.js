const React = require("react");

const ThemeContext = React.createContext({
  theme: "dark",
  setTheme: () => {},
  resolvedTheme: "dark",
});

function applyTheme(theme, attribute) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (attribute === "class") {
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
  } else {
    root.setAttribute(attribute, theme);
  }
}

function ThemeProvider({
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  children,
}) {
  const [theme, setThemeState] = React.useState(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    if (saved) {
      setThemeState(saved);
      return;
    }

    if (enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setThemeState(systemTheme);
      return;
    }

    setThemeState(defaultTheme);
  }, [defaultTheme, enableSystem]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    applyTheme(theme, attribute);
    window.localStorage.setItem("theme", theme);
  }, [attribute, mounted, theme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
      },
      resolvedTheme: theme,
    }),
    [theme]
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
}

function useTheme() {
  const context = React.useContext(ThemeContext);
  return context;
}

module.exports = { ThemeProvider, useTheme };
