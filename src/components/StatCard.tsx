import { cn } from "@/lib/utils";

export interface StatCardProps {
	label: string;
	value: string;
	subValue?: string;
	variant?: "default" | "positive" | "warning";
}

const variantColor: Record<NonNullable<StatCardProps["variant"]>, string> = {
	default: "text-foreground",
	positive: "text-positive",
	warning: "text-warning",
};

export function StatCard({
	label,
	value,
	subValue,
	variant = "default",
}: StatCardProps) {
	return (
		<div className="rounded-2xl border border-white/6 bg-[#262626] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
			<p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
				{label}
			</p>
			<p
				className={cn(
					"mt-2 text-2xl font-bold tracking-tight",
					variantColor[variant],
				)}
			>
				{value}
			</p>
			{subValue && (
				<p className="mt-1 text-sm text-muted-foreground">{subValue}</p>
			)}
		</div>
	);
}
