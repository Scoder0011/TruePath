export type CookieOptions = {
  path?: string;
  domain?: string;
  expires?: Date | number;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none' | boolean;
  httpOnly?: boolean;
};

export type Cookie = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export type CookieStore = {
  getAll: () => Array<{ name: string; value: string; options?: CookieOptions }>;
  setAll: (cookiesToSet: Array<Cookie>) => void;
};

export type AuthResult = {
  data: null | Record<string, unknown>;
  error: null | { message: string };
};

export type UserResult = {
  data: { user: null | Record<string, unknown> };
  error: null | { message: string };
};

export type SessionResult = {
  data: { session: null | Record<string, unknown> };
  error: null | { message: string };
};

export type BrowserClient = {
  auth: {
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<AuthResult>;
    signUp: (credentials: { email: string; password: string; options?: { emailRedirectTo?: string } }) => Promise<AuthResult>;
    resetPasswordForEmail: (email: string, options?: { redirectTo?: string }) => Promise<AuthResult>;
    signInWithOAuth: (params: { provider: string; options?: { redirectTo?: string } }) => Promise<AuthResult>;
    exchangeCodeForSession: (code: string) => Promise<AuthResult>;
    updateUser: (attributes: { password?: string }) => Promise<AuthResult>;
    signOut: () => Promise<{ error: null | { message: string } }>;
    getSession: () => Promise<SessionResult>;
    getUser: () => Promise<UserResult>;
    signInWithOtp: (credentials: { email: string; options?: { emailRedirectTo?: string } }) => Promise<AuthResult>;
  };
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: string | number | boolean | null) => {
        maybeSingle: () => Promise<{ data: null | Record<string, unknown>; error: null | { message: string } }>;
        single: () => Promise<{ data: null | Record<string, unknown>; error: null | { message: string } }>;
      };
    };
  };
};

export function createBrowserClient(url: string, key: string): BrowserClient;

export function createServerClient(
  url: string,
  key: string,
  options?: {
    cookies?: CookieStore;
  }
): BrowserClient & { cookies: CookieStore };
