import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Copy, Info } from "lucide-react";
import { useState } from "react";
import { CoinIcon } from "@/components/CoinIcon";
import { CollateralAvatar } from "@/components/CollateralAvatar";
import { MARKETS } from "@/data/placeholder";
import { cn } from "@/lib/utils";
import type { Market } from "@/types";

export const Route = createFileRoute("/market/$marketId")({
	loader: ({ params }) => {
		const market = MARKETS.find((m) => m.slug === params.marketId);
		if (!market) throw notFound();
		return { market };
	},
	component: MarketDetailPage,
});

const DURATION_OPTIONS = ["1h", "4h", "24h", "72h", "168h"] as const;

function StatItem({
	label,
	primary,
	secondary,
	suffix,
}: {
	label: string;
	primary: string;
	secondary?: string;
	suffix?: string;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-center gap-1.5">
				<span className="text-[13px] font-medium text-muted-foreground">
					{label}
				</span>
				<Info className="size-3.5 text-muted-foreground/50" />
			</div>
			<div className="flex items-baseline gap-1">
				<span className="text-[34px] font-semibold leading-none tracking-tight text-foreground">
					{primary}
				</span>
				{suffix && (
					<span className="text-[22px] font-medium text-muted-foreground">
						{suffix}
					</span>
				)}
			</div>
			{secondary && (
				<span className="text-[13px] text-muted-foreground">{secondary}</span>
			)}
		</div>
	);
}

function SummaryRow({
	label,
	value,
	highlight = false,
}: {
	label: string;
	value: string;
	highlight?: boolean;
}) {
	return (
		<div className="flex items-center justify-between py-2 text-[13px]">
			<span className="text-muted-foreground">{label}</span>
			<span
				className={cn(
					"font-semibold",
					highlight ? "text-foreground" : "text-foreground/90",
				)}
			>
				{value}
			</span>
		</div>
	);
}

function AmountInputCard({
	label,
	value,
	usdValue,
	available,
	token,
	collateralName,
	onChange,
}: {
	label: string;
	value: string;
	usdValue: string;
	available: string;
	token?: Market["loanAsset"];
	collateralName?: string;
	onChange: (next: string) => void;
}) {
	return (
		<div className="rounded-[24px] border border-white/[0.06] bg-[#141415] p-5">
			<div className="mb-3 flex items-center justify-between">
				<span className="text-[14px] font-semibold text-foreground/90">
					{label}
				</span>
				{token ? (
					<CoinIcon token={token} size="lg" />
				) : collateralName ? (
					<CollateralAvatar name={collateralName} size="md" />
				) : null}
			</div>
			<input
				type="text"
				inputMode="decimal"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full bg-transparent text-[38px] font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40"
				placeholder="0.00"
			/>
			<div className="mt-2 flex items-center justify-between">
				<span className="text-[13px] text-muted-foreground">{usdValue}</span>
				<div className="flex items-center gap-2 text-[13px] text-muted-foreground">
					<span>{available}</span>
					<button
						type="button"
						onClick={() => {
							const numeric = available.match(/[\d.]+/)?.[0] ?? "0";
							onChange(numeric);
						}}
						className="rounded-md border border-white/[0.06] bg-[#1f1f20] px-2 py-0.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
					>
						MAX
					</button>
				</div>
			</div>
		</div>
	);
}

function MarketDetailPage() {
	const { market } = Route.useLoaderData();
	const [tab, setTab] = useState<"overview" | "position">("overview");
	const [duration, setDuration] =
		useState<(typeof DURATION_OPTIONS)[number]>("24h");
	const [supply, setSupply] = useState("100.00");
	const [borrow, setBorrow] = useState("25.00");
	const [copied, setCopied] = useState(false);

	const borrowUsd = Number.parseFloat(borrow || "0").toFixed(0);
	const supplyUsd = Number.parseFloat(supply || "0").toFixed(0);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(market.collateralAddress);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

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
					<div className="flex items-start gap-5">
						<CollateralAvatar name={market.collateralName} size="xl" />
						<div className="flex flex-col gap-2">
							<h1 className="text-[38px] font-semibold leading-[1.05] tracking-tight text-foreground">
								{market.collateralName.replace(/\s+YES$/i, "YES")}/
								{market.loanAsset.symbol}
							</h1>
							<div className="flex flex-wrap items-center gap-2 text-[13px]">
								<button
									type="button"
									onClick={handleCopy}
									className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
								>
									<span className="font-mono">{market.collateralAddress}</span>
									{copied ? (
										<Check className="size-3.5 text-positive" />
									) : (
										<Copy className="size-3.5" />
									)}
								</button>
								<span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1f3a] px-2.5 py-1 text-[12px] font-medium text-[#8b9cff]">
									<span className="size-1.5 rounded-full bg-[#8b9cff]" />
									{market.source}
								</span>
							</div>
						</div>
					</div>

					<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
						<StatItem
							label="Total Market Size"
							primary={market.totalMarketSizeUsd}
							secondary={market.totalMarketSize}
						/>
						<StatItem
							label="Total Liquidity"
							primary={market.availableLiquidityUsd.replace(/M$/, "")}
							suffix="M"
							secondary={market.availableLiquidity}
						/>
						<StatItem
							label="Rate"
							primary={market.currentRate.toFixed(2)}
							suffix="%"
						/>
						<StatItem label="Pool Closure" primary={market.poolClosure} />
					</div>

					<div className="mt-12 border-b border-white/[0.06]">
						<div className="flex items-center gap-6">
							{(
								[
									{ id: "overview", label: "Overview" },
									{ id: "position", label: "Your Position" },
								] as const
							).map((t) => (
								<button
									key={t.id}
									type="button"
									onClick={() => setTab(t.id)}
									className={cn(
										"relative pb-3 text-[15px] font-semibold transition-colors",
										tab === t.id
											? "text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									{t.label}
									{tab === t.id && (
										<span className="absolute inset-x-0 -bottom-px h-px bg-foreground" />
									)}
								</button>
							))}
						</div>
					</div>

					<div className="mt-10 rounded-[28px] border border-dashed border-white/[0.06] bg-[#101011] p-10">
						{tab === "overview" ? (
							<div className="flex min-h-[360px] items-center justify-center">
								<h2 className="text-center text-[54px] font-semibold leading-tight tracking-tight text-foreground md:text-[72px]">
									Live Polymarket Feed
								</h2>
							</div>
						) : (
							<div className="flex min-h-[360px] flex-col items-center justify-center gap-2 text-muted-foreground">
								<span className="text-[15px]">
									No position in this market yet.
								</span>
								<span className="text-[13px]">
									Supply collateral to start borrowing.
								</span>
							</div>
						)}
					</div>
				</div>

				<aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
					<div className="flex items-center">
						<button
							type="button"
							className="rounded-xl bg-[#1e1e1e] px-4 py-2 text-[14px] font-semibold text-foreground"
						>
							Borrow
						</button>
					</div>

					<AmountInputCard
						label={`Supply ${market.collateralName.split(" ")[0]}${
							market.collateralName.includes("YES") ? "YES" : ""
						}`}
						value={supply}
						usdValue={`$${supplyUsd}`}
						available={`200.00 ${market.collateralName.split(" ")[0]}YES`}
						collateralName={market.collateralName}
						onChange={setSupply}
					/>

					<AmountInputCard
						label={`Borrow ${market.loanAsset.symbol}`}
						value={borrow}
						usdValue={`$${borrowUsd}`}
						available={`85.00 ${market.loanAsset.symbol}`}
						token={market.loanAsset}
						onChange={setBorrow}
					/>

					<div className="rounded-[24px] border border-white/[0.06] bg-[#141415] p-5">
						<SummaryRow label="LTV" value="50%" />
						<SummaryRow label="Liquidation LTV" value="85%" />
						<SummaryRow label="Liquidation Price" value="$0.425" />

						<div className="mt-3 flex items-center justify-between gap-3 py-2 text-[13px]">
							<span className="text-muted-foreground">Duration</span>
							<div className="flex items-center gap-1">
								{DURATION_OPTIONS.map((option) => (
									<button
										key={option}
										type="button"
										onClick={() => setDuration(option)}
										className={cn(
											"rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
											duration === option
												? "border-primary/40 bg-primary/15 text-primary"
												: "border-white/[0.06] text-muted-foreground hover:text-foreground",
										)}
									>
										{option}
									</button>
								))}
							</div>
						</div>

						<SummaryRow label="Premium" value="$1" />
						<SummaryRow
							label="APR"
							value={`${market.currentRate.toFixed(2)}%`}
							highlight
						/>

						<button
							type="button"
							className="mt-4 w-full rounded-xl bg-primary py-3 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Borrow ${borrowUsd} {market.loanAsset.symbol}
						</button>
					</div>
				</aside>
			</div>
		</div>
	);
}
