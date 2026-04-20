import { cn } from "@/lib/utils";
import type { Token } from "@/types";

const sizeClasses = {
	sm: "size-5 text-[9px]",
	md: "size-6 text-[10px]",
	lg: "size-8 text-[11px]",
} as const;

interface CoinIconProps {
	token: Token;
	size?: keyof typeof sizeClasses;
	className?: string;
}

export function CoinIcon({ token, size = "md", className }: CoinIconProps) {
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-1 ring-black/30",
				sizeClasses[size],
				className,
			)}
			style={{ backgroundColor: token.color }}
			aria-hidden
		>
			{token.symbol.charAt(0)}
		</span>
	);
}
