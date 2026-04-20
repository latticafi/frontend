import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ValueChipProps {
	children: ReactNode;
	className?: string;
}

export function ValueChip({ children, className }: ValueChipProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full bg-[#262626] px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
				className,
			)}
		>
			{children}
		</span>
	);
}
