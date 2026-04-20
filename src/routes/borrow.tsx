import { createFileRoute, Link } from "@tanstack/react-router";
import { Info, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useMarkets } from "@/hooks/useApi";
import type { Market } from "@/types";

export const Route = createFileRoute("/borrow")({
	component: BorrowPage,
});

// function formatPrice(mid: number): string {
// 	return `$${mid.toFixed(3)}`;
// }

function formatDate(ts: string): string {
	const n = Number(ts);
	if (!n) return "—";
	return new Date(n * 1000).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function MarketRow({ market }: { market: Market }) {
	return (
		<Link
			to="/market/$conditionId"
			params={{ conditionId: market.conditionId }}
			className="grid grid-cols-[minmax(240px,1.4fr)_minmax(100px,0.7fr)_minmax(100px,0.7fr)_minmax(160px,1fr)_minmax(100px,0.7fr)] gap-6 items-center border-t border-white/4 px-8 py-5 text-[14px] transition-colors hover:bg-white/2"
		>
			<div className="flex flex-col leading-tight">
				<span className="font-semibold text-foreground">
					{market.name ?? `${market.conditionId.slice(0, 12)}...`}
				</span>
				{market.category && (
					<span className="text-[12px] text-muted-foreground">
						{market.category}
					</span>
				)}
			</div>

			<div className="font-semibold text-foreground">
				{(market.maxLtvBps / 100).toFixed(0)}%
			</div>

			<div className="font-semibold text-foreground">
				{(market.minLtvBps / 100).toFixed(0)}%
			</div>

			<div className="font-medium text-foreground/90">
				{formatDate(market.resolutionTime)}
			</div>

			<div className="font-medium text-foreground/90">
				{formatDate(market.originationCutoff)}
			</div>
		</Link>
	);
}

function BorrowPage() {
	const [search, setSearch] = useState("");
	const { data: markets, isLoading } = useMarkets();

	const filtered = useMemo(() => {
		if (!markets) return [];
		if (!search) return markets;
		const q = search.toLowerCase();
		return markets.filter(
			(m) =>
				(m.name?.toLowerCase().includes(q) ?? false) ||
				(m.category?.toLowerCase().includes(q) ?? false) ||
				m.conditionId.toLowerCase().includes(q),
		);
	}, [markets, search]);

	return (
		<div>
			<div className="mb-8 flex items-center gap-3">
				<h1 className="text-[40px] font-semibold tracking-tight text-foreground">
					Markets
				</h1>
				<Info className="size-5 text-muted-foreground/60" />
			</div>

			<div className="overflow-hidden rounded-[28px] border border-white/6 bg-[#101011]">
				<div className="flex items-center gap-4 border-b border-white/4 px-8 py-5">
					<div className="relative ml-auto">
						<Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Filter markets"
							className="h-10 w-[260px] rounded-full border border-white/6 bg-[#1a1a1a] pr-4 pl-10 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-white/12 focus:outline-none"
						/>
					</div>
				</div>

				<div className="grid grid-cols-[minmax(240px,1.4fr)_minmax(100px,0.7fr)_minmax(100px,0.7fr)_minmax(160px,1fr)_minmax(100px,0.7fr)] gap-6 items-center px-8 py-4">
					<span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70">
						Market
					</span>
					<span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70">
						Max LTV
					</span>
					<span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70">
						Min LTV
					</span>
					<span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70">
						Resolution
					</span>
					<span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70">
						Cutoff
					</span>
				</div>

				<div>
					{isLoading && (
						<div className="px-8 py-16 text-center text-sm text-muted-foreground">
							Loading markets...
						</div>
					)}
					{!isLoading &&
						filtered.map((market) => (
							<MarketRow key={market.conditionId} market={market} />
						))}
					{!isLoading && filtered.length === 0 && (
						<div className="px-8 py-16 text-center text-sm text-muted-foreground">
							No markets match your filter.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
