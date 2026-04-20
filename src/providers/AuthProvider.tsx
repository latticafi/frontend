import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { createSiweMessage } from "viem/siwe";
import { useConnection, useSignMessage } from "wagmi";
import { api, setToken } from "@/lib/api";

interface AuthState {
	token: string | null;
	isAuthenticating: boolean;
	error: string | null;
	authenticate: () => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);
const TOKEN_KEY = "lattica_jwt";

export function AuthProvider({ children }: { children: ReactNode }) {
	const { address, chainId, isConnected } = useConnection();
	const signMessage = useSignMessage();
	const [token, setTokenState] = useState<string | null>(() => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(TOKEN_KEY);
	});
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (token) {
			setToken(token);
		}
	}, [token]);

	useEffect(() => {
		if (!isConnected) {
			setTokenState(null);
			setToken(null);
			localStorage.removeItem(TOKEN_KEY);
		}
	}, [isConnected]);

	const authenticate = useCallback(async () => {
		if (!address || !chainId) return;

		setIsAuthenticating(true);
		setError(null);

		try {
			const { nonce } = await api.get<{ nonce: string }>("/auth/nonce");

			const message = createSiweMessage({
				address,
				chainId,
				domain: window.location.host,
				nonce,
				uri: window.location.origin,
				version: "1",
			});

			const signature = await signMessage.mutateAsync({ message });

			const { token: jwt } = await api.post<{ token: string }>("/auth/verify", {
				message,
				signature,
			});

			setTokenState(jwt);
			setToken(jwt);
			localStorage.setItem(TOKEN_KEY, jwt);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Authentication failed";
			setError(msg);
		} finally {
			setIsAuthenticating(false);
		}
	}, [address, chainId, signMessage]);

	const logout = useCallback(() => {
		setTokenState(null);
		setToken(null);
		localStorage.removeItem(TOKEN_KEY);
	}, []);

	const value = useMemo(
		() => ({ token, isAuthenticating, error, authenticate, logout }),
		[token, isAuthenticating, error, authenticate, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be inside AuthProvider");
	return ctx;
}
