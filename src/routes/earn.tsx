import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useState } from "react";
import { useConnection, useSendTransaction } from "wagmi";
import {
	useApprovalStatus,
	useLenderBalance,
	usePool,
	usePrepareApproval,
	usePrepareDeposit,
	usePrepareWithdraw,
} from "@/hooks/useApi";
import { useAuth } from "@/providers/AuthProvider";

export const Route = createFileRoute("/earn")({
	component: EarnPage,
});

function formatUsdc(raw: string): string {
	const n = Number(raw) / 1e6;
	if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
	if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
	if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
	return `$${n.toFixed(2)}`;
}

function formatBps(raw: string): string {
	return `${(Number(raw) / 100).toFixed(2)}%`;
}

function formatUtil(raw: string): string {
	return `${(Number(raw) / 100).toFixed(1)}%`;
}

function StatCard({
	label,
	value,
	sub,
}: {
	label: string;
	value: string;
	sub?: string;
}) {
	return (
		<div className="flex flex-col gap-1.5 rounded-[20px] border border-white/6 bg-[#141415] p-5">
			<div className="flex items-center gap-1.5">
				<span className="text-[13px] font-medium text-muted-foreground">
					{label}
				</span>
				<Info className="size-3.5 text-muted-foreground/50" />
			</div>
			<span className="text-[28px] font-semibold tracking-tight text-foreground">
				{value}
			</span>
			{sub && <span className="text-[12px] text-muted-foreground">{sub}</span>}
		</div>
	);
}

function EarnPage() {
	const { token } = useAuth();
	const { isConnected } = useConnection();
	const sendTx = useSendTransaction();

	const { data: pool, isLoading: poolLoading } = usePool();
	const { data: balance } = useLenderBalance();
	const { data: approvals } = useApprovalStatus();

	const prepareDeposit = usePrepareDeposit();
	const prepareWithdraw = usePrepareWithdraw();
	const prepareApproval = usePrepareApproval();

	const [depositAmt, setDepositAmt] = useState("");
	const [withdrawAmt, setWithdrawAmt] = useState("");
	const [txPending, setTxPending] = useState(false);

	const handleDeposit = async () => {
		if (!depositAmt || txPending) return;
		setTxPending(true);

		try {
			if (approvals && !approvals.usdc.sufficient) {
				const approveTx = await prepareApproval.mutateAsync({
					token: "usdc",
				});
				await sendTx.mutateAsync({
					to: approveTx.to as `0x${string}`,
					data: approveTx.data as `0x${string}`,
				});
			}

			const raw = String(Math.floor(Number(depositAmt) * 1e6));
			const tx = await prepareDeposit.mutateAsync({ amount: raw });
			await sendTx.mutateAsync({
				to: tx.to as `0x${string}`,
				data: tx.data as `0x${string}`,
			});
			setDepositAmt("");
		} catch (err) {
			console.error("Deposit failed:", err);
		} finally {
			setTxPending(false);
		}
	};

	const handleWithdraw = async () => {
		if (!withdrawAmt || txPending) return;
		setTxPending(true);

		try {
			const raw = String(Math.floor(Number(withdrawAmt) * 1e6));
			const tx = await prepareWithdraw.mutateAsync({ shares: raw });
			await sendTx.mutateAsync({
				to: tx.to as `0x${string}`,
				data: tx.data as `0x${string}`,
			});
			setWithdrawAmt("");
		} catch (err) {
			console.error("Withdraw failed:", err);
		} finally {
			setTxPending(false);
		}
	};

	return (
		<div>
			<div className="mb-8 flex items-center gap-3">
				<h1 className="text-[40px] font-semibold tracking-tight text-foreground">
					Lend
				</h1>
				<Info className="size-5 text-muted-foreground/60" />
			</div>

			{poolLoading ? (
				<div className="py-16 text-center text-muted-foreground">
					Loading pool data...
				</div>
			) : pool ? (
				<>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<StatCard
							label="Total Assets"
							value={formatUsdc(pool.totalAssets)}
						/>
						<StatCard
							label="Available Liquidity"
							value={formatUsdc(pool.availableLiquidity)}
						/>
						<StatCard
							label="Utilization"
							value={formatUtil(pool.utilization)}
						/>
						{/* <StatCard */}
						{/* 	label="Current Rate" */}
						{/* 	value={formatBps(pool.currentRate)} */}
						{/* 	sub="APY on deposits" */}
						{/* /> */}
					</div>

					{token && balance && (
						<div className="mt-6 rounded-[20px] border border-white/6 bg-[#141415] p-6">
							<h2 className="mb-1 text-[16px] font-semibold text-foreground">
								Your Position
							</h2>
							<p className="text-[13px] text-muted-foreground">
								{formatUsdc(balance.value)} deposited ·{" "}
								{Number(balance.shares).toLocaleString()} shares
							</p>
						</div>
					)}

					{isConnected && token && (
						<div className="mt-6 grid gap-4 md:grid-cols-2">
							<div className="rounded-[24px] border border-white/6 bg-[#141415] p-5">
								<span className="text-[14px] font-semibold text-foreground/90">
									Deposit USDC
								</span>
								<input
									type="text"
									inputMode="decimal"
									value={depositAmt}
									onChange={(e) => setDepositAmt(e.target.value)}
									className="mt-3 w-full bg-transparent text-[32px] font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40"
									placeholder="0.00"
								/>
								<button
									type="button"
									onClick={handleDeposit}
									disabled={txPending || !depositAmt}
									className="mt-4 w-full rounded-xl bg-primary py-3 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
								>
									{txPending ? "Confirming..." : "Deposit"}
								</button>
							</div>

							<div className="rounded-[24px] border border-white/6 bg-[#141415] p-5">
								<span className="text-[14px] font-semibold text-foreground/90">
									Withdraw
								</span>
								<input
									type="text"
									inputMode="decimal"
									value={withdrawAmt}
									onChange={(e) => setWithdrawAmt(e.target.value)}
									className="mt-3 w-full bg-transparent text-[32px] font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40"
									placeholder="0.00"
								/>
								<button
									type="button"
									onClick={handleWithdraw}
									disabled={txPending || !withdrawAmt}
									className="mt-4 w-full rounded-xl bg-[#1e1e1e] py-3 text-[14px] font-semibold text-foreground transition-colors hover:bg-[#262626] disabled:opacity-50"
								>
									{txPending ? "Confirming..." : "Withdraw"}
								</button>
							</div>
						</div>
					)}

					{isConnected && !token && (
						<div className="mt-6 rounded-[20px] border border-dashed border-white/6 bg-[#101011] p-10 text-center text-[15px] text-muted-foreground">
							Sign in to deposit or withdraw.
						</div>
					)}
				</>
			) : (
				<div className="py-16 text-center text-muted-foreground">
					Failed to load pool data.
				</div>
			)}
		</div>
	);
}
