declare module "next-themes" {
  export type Theme = "dark" | "light" | "system" | string;

  export interface ThemeContextValue {
    theme?: Theme;
    setTheme: (theme: Theme) => void;
    forcedTheme?: Theme;
    resolvedTheme?: Theme;
    systemTheme?: "dark" | "light";
  }

  export function ThemeProvider(props: {
    children: React.ReactNode;
    attribute?: string | "class" | string[];
    defaultTheme?: Theme;
    enableSystem?: boolean;
    forcedTheme?: Theme;
    disableTransitionOnChange?: boolean;
    storageKey?: string;
  }): JSX.Element;

  export function useTheme(): ThemeContextValue;
}
