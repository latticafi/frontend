import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
	{ to: "/earn", label: "Lend" },
	{ to: "/borrow", label: "Borrow" },
] as const;

function TabLink({ to, label }: { to: string; label: string }) {
	return (
		<Link
			to={to}
			className="rounded-xl px-5 py-2 text-[15px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
			activeProps={{
				className: cn(
					"rounded-xl px-5 py-2 text-[15px] font-semibold transition-colors",
					"bg-[#212121] text-foreground",
				),
			}}
		>
			{label}
		</Link>
	);
}

export function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 h-16 border-b border-white/4 bg-background/80 backdrop-blur-md">
			<nav className="flex h-full items-center justify-between px-5 md:px-8">
				<div className="flex items-center gap-5">
					<Link
						to="/"
						className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/3"
					>
						<img src="/logo.svg" alt="Lattica" className="h-7 w-7 rounded-md" />
						<span className="text-[17px] font-semibold tracking-tight">
							Lattica
						</span>
					</Link>

					<div className="hidden items-center gap-1 md:flex">
						{NAV_LINKS.map((link) => (
							<TabLink key={link.to} to={link.to} label={link.label} />
						))}
					</div>
				</div>

				<div className="flex items-center gap-4">
					<WalletButton />
					<button
						type="button"
						className="p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
						onClick={() => setMobileMenuOpen((prev) => !prev)}
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<X className="size-5" />
						) : (
							<Menu className="size-5" />
						)}
					</button>
				</div>
			</nav>

			{mobileMenuOpen && (
				<div className="flex flex-col gap-1 border-b border-white/4 bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden">
					{NAV_LINKS.map((link) => (
						<TabLink key={link.to} to={link.to} label={link.label} />
					))}
				</div>
			)}
		</header>
	);
}
