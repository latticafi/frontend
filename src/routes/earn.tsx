import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowDown,
	ChevronDown,
	Expand,
	Info,
	Search,
	Settings,
	SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CoinIcon } from "@/components/CoinIcon";
import { ValueChip } from "@/components/ValueChip";
import { VAULTS } from "@/data/placeholder";
import type { Vault } from "@/types";

export const Route = createFileRoute("/earn")({
	component: EarnPage,
});

const COLUMN_CLASS =
	"grid grid-cols-[minmax(260px,1.6fr)_minmax(160px,1fr)_minmax(200px,1.1fr)_minmax(120px,0.7fr)_minmax(160px,1fr)] gap-6 items-center";

function VaultRow({ vault }: { vault: Vault }) {
	return (
		<div
			className={`${COLUMN_CLASS} border-t border-white/[0.04] px-8 py-5 text-[14px] transition-colors hover:bg-white/[0.02]`}
		>
			<div className="flex items-center gap-3">
				<CoinIcon token={vault.asset} size="lg" />
				<div className="flex flex-col leading-tight">
					<span className="font-semibold text-foreground">{vault.name}</span>
					<span className="text-[12px] text-muted-foreground">
						{vault.asset.symbol}
					</span>
				</div>
			</div>

			<div className="font-medium text-foreground/90">{vault.curator}</div>

			<div className="flex flex-col gap-1">
				<span className="font-semibold text-foreground">
					{vault.totalSupply}
				</span>
				<ValueChip>{vault.asset.symbol}</ValueChip>
			</div>

			<div className="font-semibold text-positive">{vault.apy.toFixed(2)}%</div>

			<div className="flex -space-x-1.5">
				{vault.collateralTokens.map((token) => (
					<CoinIcon key={token.symbol} token={token} size="md" />
				))}
			</div>
		</div>
	);
}

function HeaderCell({
	label,
	sortable = false,
}: {
	label: string;
	sortable?: boolean;
}) {
	return (
		<button
			type="button"
			className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wider text-muted-foreground/70 transition-colors hover:text-foreground"
		>
			{label}
			{sortable && <ArrowDown className="size-3" />}
		</button>
	);
}

function EarnPage() {
	const [search, setSearch] = useState("");
	const [inWallet, setInWallet] = useState(false);

	const filtered = useMemo(() => {
		if (!search) return VAULTS;
		const q = search.toLowerCase();
		return VAULTS.filter(
			(v) =>
				v.name.toLowerCase().includes(q) || v.curator.toLowerCase().includes(q),
		);
	}, [search]);

	return (
		<div>
			<div className="mb-8 flex items-center gap-3">
				<h1 className="text-[40px] font-semibold tracking-tight text-foreground">
					Vaults
				</h1>
				<Info className="size-5 text-muted-foreground/60" />
			</div>

			<div className="overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#101011]">
				<div className="flex flex-wrap items-center gap-4 border-b border-white/[0.04] px-8 py-5">
					<label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-foreground">
						<span>In Wallet:</span>
						<button
							type="button"
							role="switch"
							aria-checked={inWallet}
							onClick={() => setInWallet((prev) => !prev)}
							className={`relative h-5 w-9 rounded-full transition-colors ${
								inWallet ? "bg-primary" : "bg-[#2a2a2a]"
							}`}
						>
							<span
								className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
									inWallet ? "translate-x-[18px]" : "translate-x-0.5"
								}`}
							/>
						</button>
					</label>

					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-white/[0.04]"
					>
						<SlidersHorizontal className="size-4" />
						Filter
					</button>

					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-white/[0.04]"
					>
						<ArrowDown className="size-4" />
						Sort by APY
						<ChevronDown className="size-3.5 text-muted-foreground" />
					</button>

					<div className="ml-auto flex items-center gap-3">
						<div className="relative">
							<Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Filter vaults"
								className="h-10 w-[260px] rounded-full border border-white/[0.06] bg-[#1a1a1a] pr-4 pl-10 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-white/[0.12] focus:outline-none"
							/>
						</div>
						<button
							type="button"
							className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
						>
							<Settings className="size-4" />
						</button>
						<button
							type="button"
							className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
						>
							<Expand className="size-4" />
						</button>
					</div>
				</div>

				<div className={`${COLUMN_CLASS} px-8 py-4`}>
					<HeaderCell label="Vault" />
					<HeaderCell label="Curator" />
					<HeaderCell label="Total Supply" sortable />
					<HeaderCell label="APY" />
					<HeaderCell label="Collateral" />
				</div>

				<div>
					{filtered.map((vault) => (
						<VaultRow key={vault.id} vault={vault} />
					))}
					{filtered.length === 0 && (
						<div className="px-8 py-16 text-center text-sm text-muted-foreground">
							No vaults match your filter.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
