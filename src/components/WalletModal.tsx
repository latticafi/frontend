import { Check, Copy, LogOut, Wallet } from "lucide-react";
import { useState } from "react";
import { useConnection, useDisconnect } from "wagmi";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/AuthProvider";

export function WalletModal() {
	const { address } = useConnection();
	const disconnect = useDisconnect();
	const { logout } = useAuth();
	const [copied, setCopied] = useState(false);

	const copyAddress = async () => {
		if (!address) return;
		await navigator.clipboard.writeText(address);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const handleDisconnect = () => {
		logout();
		disconnect.mutate();
	};

	return (
		<DialogContent className="sm:max-w-sm overflow-hidden">
			<DialogHeader>
				<DialogTitle className="flex items-center gap-2">
					<Wallet className="size-5" />
					Wallet
				</DialogTitle>
			</DialogHeader>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Address
					</span>
					<div className="flex items-center justify-between gap-2 rounded-lg bg-secondary border border-white/6 px-3 py-2.5">
						<span className="text-sm font-mono text-foreground break-all">
							{address ?? "—"}
						</span>
						<button
							type="button"
							onClick={copyAddress}
							className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
							aria-label="Copy address"
						>
							{copied ? (
								<Check className="size-4 text-positive" />
							) : (
								<Copy className="size-4" />
							)}
						</button>
					</div>
				</div>

				<button
					type="button"
					onClick={handleDisconnect}
					className="flex items-center justify-center gap-2 rounded-lg border border-white/6 px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors mt-1"
				>
					<LogOut className="size-4" />
					<span>Disconnect</span>
				</button>
			</div>
		</DialogContent>
	);
}
