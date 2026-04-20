import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useConnection, useSendTransaction } from "wagmi";
import {
	useApprovalStatus,
	useMarket,
	usePrepareApproval,
	usePrepareBorrow,
	usePrice,
	useRequestQuote,
} from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import type { QuoteRejection, QuoteResponse } from "@/types";
export const Route = createFileRoute("/market/$conditionId")({
	component: MarketDetailPage,
});
const EPOCH_OPTIONS = [
	{ label: "1h", seconds: 3600 },
	{ label: "4h", seconds: 14400 },
	{ label: "24h", seconds: 86400 },
	{ label: "3d", seconds: 259200 },
	{ label: "7d", seconds: 604800 },
] as const;
function formatUsdc(raw: number): string {
	return `$${(raw / 1e6).toFixed(2)}`;
}
function formatDate(ts: string): string {
	const n = Number(ts);
	if (!n) return "—";
	return new Date(n * 1000).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}
function isRejection(
	res: QuoteResponse | QuoteRejection,
): res is QuoteRejection {
	return "rejected" in res && res.rejected === true;
}
function MarketDetailPage() {
	const { conditionId } = Route.useParams();
	const { token } = useAuth();
	const { isConnected } = useConnection();
	const sendTx = useSendTransaction();
	const { data: market, isLoading: marketLoading } = useMarket(conditionId);
	const { data: price } = usePrice(conditionId);
	const { data: approvals } = useApprovalStatus();
	const requestQuote = useRequestQuote();
	const prepareBorrow = usePrepareBorrow();
	const prepareApproval = usePrepareApproval();
	const [collateral, setCollateral] = useState("");
	const [borrowAmt, setBorrowAmt] = useState("");
	const [epoch, setEpoch] = useState<number>(EPOCH_OPTIONS[2].seconds);
	const [quote, setQuote] = useState<QuoteResponse | null>(null);
	const [rejection, setRejection] = useState<string | null>(null);
	const [txPending, setTxPending] = useState(false);
	const handleQuote = async () => {
		if (!collateral || !borrowAmt) return;
		setQuote(null);
		setRejection(null);
		try {
			const res = await requestQuote.mutateAsync({
				conditionId,
				collateralAmount: Math.floor(Number(collateral) * 1e6),
				borrowAmount: Math.floor(Number(borrowAmt) * 1e6),
				epochLength: epoch,
			});
			if (isRejection(res)) {
				setRejection(res.reason);
			} else {
				setQuote(res);
			}
		} catch (err) {
			console.error("Quote failed:", err);
			setRejection("Failed to get quote");
		}
	};
	const handleBorrow = async () => {
		if (!quote || txPending) return;
		setTxPending(true);
		try {
			if (approvals && !approvals.ctf.approved) {
				const approveTx = await prepareApproval.mutateAsync({
					token: "ctf",
				});
				await sendTx.mutateAsync({
					to: approveTx.to as `0x${string}`,
					data: approveTx.data as `0x${string}`,
				});
			}
			const tx = await prepareBorrow.mutateAsync({
				conditionId,
				collateralAmount: String(quote.collateralAmount),
				borrowAmount: String(quote.amount),
				epochLength: String(quote.epochLength),
				premiumBps: quote.premiumBps,
				deadline: quote.deadline,
				nonce: quote.nonce,
				signature: quote.signature,
				price: quote.priceAttestation.price,
				priceTimestamp: quote.priceAttestation.timestamp,
				priceDeadline: quote.priceAttestation.deadline,
				priceSignature: quote.priceAttestation.signature,
			});
			await sendTx.mutateAsync({
				to: tx.to as `0x${string}`,
				data: tx.data as `0x${string}`,
			});
			setQuote(null);
			setCollateral("");
			setBorrowAmt("");
		} catch (err) {
			console.error("Borrow failed:", err);
		} finally {
			setTxPending(false);
		}
	};
	if (marketLoading) {
		return (
			<div className="py-16 text-center text-muted-foreground">
				Loading market...
			</div>
		);
	}
	if (!market) {
		return (
			<div className="py-16 text-center text-muted-foreground">
				Market not found.
			</div>
		);
	}
	return (
		<div className="pb-12">
			<Link
				to="/borrow"
				className="mb-6 inline-flex text-[13px] font-medium text-muted-foreground hover:text-foreground"
			>
				← Markets
			</Link>
			<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px]">
				<div>
					<h1 className="text-[38px] font-semibold leading-[1.05] tracking-tight text-foreground">
						{market.name ?? `${conditionId.slice(0, 16)}...`}
					</h1>
					{market.category && (
						<span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#1a1f3a] px-2.5 py-1 text-[12px] font-medium text-[#8b9cff]">
							<span className="size-1.5 rounded-full bg-[#8b9cff]" />
							{market.category}
						</span>
					)}
					<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
						<div className="flex flex-col gap-1.5">
							<span className="text-[13px] font-medium text-muted-foreground">
								Current Price
							</span>
							<span className="text-[28px] font-semibold tracking-tight text-foreground">
								{price ? `$${price.mid.toFixed(3)}` : "—"}
							</span>
							{price && (
								<span className="text-[12px] text-muted-foreground">
									{price.bid.toFixed(3)} / {price.ask.toFixed(3)}
								</span>
							)}
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-[13px] font-medium text-muted-foreground">
								Max LTV
							</span>
							<span className="text-[28px] font-semibold tracking-tight text-foreground">
								{(market.maxLtvBps / 100).toFixed(0)}%
							</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-[13px] font-medium text-muted-foreground">
								Resolution
							</span>
							<span className="text-[20px] font-semibold tracking-tight text-foreground">
								{formatDate(market.resolutionTime)}
							</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-[13px] font-medium text-muted-foreground">
								Origination Cutoff
							</span>
							<span className="text-[20px] font-semibold tracking-tight text-foreground">
								{formatDate(market.originationCutoff)}
							</span>
						</div>
					</div>
				</div>
				<aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
					<div className="rounded-[24px] border border-white/6 bg-[#141415] p-5">
						<span className="text-[14px] font-semibold text-foreground/90">
							Collateral (shares)
						</span>
						<input
							type="text"
							inputMode="decimal"
							value={collateral}
							onChange={(e) => setCollateral(e.target.value)}
							className="mt-2 w-full bg-transparent text-[32px] font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40"
							placeholder="0.00"
						/>
					</div>
					<div className="rounded-[24px] border border-white/6 bg-[#141415] p-5">
						<span className="text-[14px] font-semibold text-foreground/90">
							Borrow (USDC)
						</span>
						<input
							type="text"
							inputMode="decimal"
							value={borrowAmt}
							onChange={(e) => setBorrowAmt(e.target.value)}
							className="mt-2 w-full bg-transparent text-[32px] font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40"
							placeholder="0.00"
						/>
					</div>
					<div className="rounded-[24px] border border-white/6 bg-[#141415] p-5">
						<div className="flex items-center justify-between text-[13px]">
							<span className="text-muted-foreground">Duration</span>
							<div className="flex items-center gap-1">
								{EPOCH_OPTIONS.map((opt) => (
									<button
										key={opt.seconds}
										type="button"
										onClick={() => setEpoch(opt.seconds)}
										className={cn(
											"rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
											epoch === opt.seconds
												? "border-primary/40 bg-primary/15 text-primary"
												: "border-white/6 text-muted-foreground hover:text-foreground",
										)}
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>
						{quote && (
							<div className="mt-4 space-y-2 border-t border-white/6 pt-4">
								<div className="flex justify-between text-[13px]">
									<span className="text-muted-foreground">Premium</span>
									<span className="font-semibold text-foreground">
										{quote.premiumBps} bps
									</span>
								</div>
								<div className="flex justify-between text-[13px]">
									<span className="text-muted-foreground">Premium Cost</span>
									<span className="font-semibold text-foreground">
										{formatUsdc((quote.amount * quote.premiumBps) / 10000)}
									</span>
								</div>
								<div className="flex justify-between text-[13px]">
									<span className="text-muted-foreground">You Receive</span>
									<span className="font-semibold text-foreground">
										{formatUsdc(quote.amount)}
									</span>
								</div>
								<div className="flex justify-between text-[13px]">
									<span className="text-muted-foreground">Expires</span>
									<span className="font-semibold text-foreground">
										{new Date(quote.deadline * 1000).toLocaleTimeString()}
									</span>
								</div>
							</div>
						)}
						{rejection && (
							<div className="mt-4 rounded-lg bg-destructive/10 p-3 text-[13px] text-destructive">
								{rejection}
							</div>
						)}
						{!isConnected && (
							<div className="mt-4 text-center text-[13px] text-muted-foreground">
								Connect wallet to borrow.
							</div>
						)}
						{isConnected && !token && (
							<div className="mt-4 text-center text-[13px] text-muted-foreground">
								Sign in to borrow.
							</div>
						)}
						{isConnected && token && !quote && (
							<button
								type="button"
								onClick={handleQuote}
								disabled={!collateral || !borrowAmt || requestQuote.isPending}
								className="mt-4 w-full rounded-xl bg-primary py-3 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
							>
								{requestQuote.isPending ? "Getting Quote..." : "Get Quote"}
							</button>
						)}
						{isConnected && token && quote && (
							<button
								type="button"
								onClick={handleBorrow}
								disabled={txPending}
								className="mt-4 w-full rounded-xl bg-primary py-3 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
							>
								{txPending
									? "Confirming..."
									: `Borrow ${formatUsdc(quote.amount)}`}
							</button>
						)}
					</div>
				</aside>
			</div>
		</div>
	);
}
