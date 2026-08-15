const SESSION_KEY = "truepath.session";
export const getSession = () => typeof window === "undefined" ? null : localStorage.getItem(SESSION_KEY);
export const setSession = (token: string) => localStorage.setItem(SESSION_KEY, token);
export const clearSession = () => localStorage.removeItem(SESSION_KEY);

