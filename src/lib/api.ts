const BASE_URL = import.meta.env.VITE_API_URL ?? "";

let _token: string | null = null;

export function setToken(token: string | null) {
	_token = token;
}

export function getToken(): string | null {
	return _token;
}

export class ApiError extends Error {
	constructor(
		public status: number,
		public body: unknown,
	) {
		super(`API error ${status}`);
	}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...((options.headers as Record<string, string>) ?? {}),
	};

	if (_token) {
		headers.Authorization = `Bearer ${_token}`;
	}

	const response = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		const body = await response.json().catch(() => null);
		throw new ApiError(response.status, body);
	}

	return response.json() as Promise<T>;
}

export const api = {
	get: <T>(path: string) => request<T>(path),

	post: <T>(path: string, body?: unknown) =>
		request<T>(path, {
			method: "POST",
			body: body ? JSON.stringify(body) : undefined,
		}),

	patch: <T>(path: string, body: unknown) =>
		request<T>(path, {
			method: "PATCH",
			body: JSON.stringify(body),
		}),
};
