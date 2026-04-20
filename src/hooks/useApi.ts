import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import type {
	ApprovalStatus,
	HistoryEvent,
	LenderBalance,
	Loan,
	Market,
	PoolSnapshot,
	PriceData,
	QuoteRejection,
	QuoteResponse,
	TxResponse,
	User,
} from "@/types";

export function usePool() {
	return useQuery({
		queryKey: ["pool"],
		queryFn: () => api.get<PoolSnapshot>("/pool"),
		refetchInterval: 15_000,
	});
}

export function useMarkets() {
	return useQuery({
		queryKey: ["markets"],
		queryFn: () => api.get<Market[]>("/markets"),
	});
}

export function useMarket(conditionId: string) {
	return useQuery({
		queryKey: ["market", conditionId],
		queryFn: () => api.get<Market>(`/markets/${conditionId}`),
		enabled: !!conditionId,
	});
}

export function usePrice(conditionId: string) {
	return useQuery({
		queryKey: ["price", conditionId],
		queryFn: () => api.get<PriceData>(`/prices/${conditionId}`),
		enabled: !!conditionId,
		refetchInterval: 5_000,
	});
}

export function useUser() {
	const { token } = useAuth();
	return useQuery({
		queryKey: ["user", "me"],
		queryFn: () => api.get<User>("/users/me"),
		enabled: !!token,
	});
}

export function useLenderBalance() {
	const { token } = useAuth();
	return useQuery({
		queryKey: ["pool", "balance"],
		queryFn: () => api.get<LenderBalance>("/pool/balance"),
		enabled: !!token,
		refetchInterval: 15_000,
	});
}

export function useLoans(status?: string) {
	const { token } = useAuth();
	const params = status ? `?status=${status}` : "";
	return useQuery({
		queryKey: ["loans", status],
		queryFn: () => api.get<Loan[]>(`/users/me/loans${params}`),
		enabled: !!token,
	});
}

export function useLoan(loanId: string) {
	const { token } = useAuth();
	return useQuery({
		queryKey: ["loan", loanId],
		queryFn: () => api.get<Loan>(`/users/me/loans/${loanId}`),
		enabled: !!token && !!loanId,
		refetchInterval: 10_000,
	});
}

export function useHistory() {
	const { token } = useAuth();
	return useQuery({
		queryKey: ["history"],
		queryFn: () => api.get<HistoryEvent[]>("/users/me/history"),
		enabled: !!token,
	});
}

export function useApprovalStatus() {
	const { token } = useAuth();
	return useQuery({
		queryKey: ["approvals"],
		queryFn: () => api.get<ApprovalStatus>("/approvals/status"),
		enabled: !!token,
	});
}

export function useRequestQuote() {
	return useMutation({
		mutationFn: (params: {
			conditionId: string;
			borrowAmount: number;
			collateralAmount: number;
			epochLength: number;
		}) => api.post<QuoteResponse | QuoteRejection>("/quotes", params),
	});
}

export function usePrepareDeposit() {
	return useMutation({
		mutationFn: (params: { amount: string }) =>
			api.post<TxResponse>("/pool/deposit/prepare", params),
	});
}

export function usePrepareWithdraw() {
	return useMutation({
		mutationFn: (params: { shares: string }) =>
			api.post<TxResponse>("/pool/withdraw/prepare", params),
	});
}

export function usePrepareBorrow() {
	return useMutation({
		mutationFn: (params: {
			conditionId: string;
			collateralAmount: string;
			borrowAmount: string;
			epochLength: string;
			premiumBps: number;
			deadline: number;
			nonce: number;
			signature: string;
			price: string;
			priceTimestamp: number;
			priceDeadline: number;
			priceSignature: string;
		}) => api.post<TxResponse>("/loans/borrow/prepare", params),
	});
}

export function usePrepareRepay() {
	return useMutation({
		mutationFn: (params: { loanId: string }) =>
			api.post<TxResponse>("/loans/repay/prepare", params),
	});
}

export function usePrepareApproval() {
	return useMutation({
		mutationFn: (params: { token: "usdc" | "ctf" }) =>
			api.post<TxResponse>("/approvals/prepare", params),
	});
}
