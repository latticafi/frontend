import { cn } from "@/lib/utils";

const sizeClasses = {
	sm: "size-9 text-[11px]",
	md: "size-11 text-[13px]",
	lg: "size-14 text-[15px]",
	xl: "size-[72px] text-lg",
} as const;

interface CollateralAvatarProps {
	name: string;
	size?: keyof typeof sizeClasses;
	className?: string;
}

function hashString(input: string): number {
	let hash = 0;
	for (let i = 0; i < input.length; i += 1) {
		hash = (hash << 5) - hash + input.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

function gradientFromName(name: string): string {
	const hash = hashString(name);
	const h1 = hash % 360;
	const h2 = (h1 + 60) % 360;
	return `linear-gradient(135deg, hsl(${h1}, 64%, 52%), hsl(${h2}, 60%, 38%))`;
}

export function CollateralAvatar({
	name,
	size = "md",
	className,
}: CollateralAvatarProps) {
	const initials = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");

	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white/90 shadow-sm ring-1 ring-white/10",
				sizeClasses[size],
				className,
			)}
			style={{ background: gradientFromName(name) }}
			aria-hidden
		>
			{initials}
		</span>
	);
}
