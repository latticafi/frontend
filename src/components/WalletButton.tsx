import { useConnect, useConnection, useConnectors } from "wagmi";
import { injected } from "wagmi/connectors";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { WalletModal } from "@/components/WalletModal";
import { useAuth } from "@/providers/AuthProvider";

function truncateAddress(address: string): string {
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function colorFromAddress(address: string): string {
	const hash = address
		.toLowerCase()
		.replace(/^0x/, "")
		.split("")
		.reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
	const hue = hash % 360;
	return `hsl(${hue}, 72%, 58%)`;
}

export function WalletButton() {
	const { address, isConnected } = useConnection();
	const connect = useConnect();
	const connectors = useConnectors();
	const { token, authenticate, isAuthenticating } = useAuth();

	if (!isConnected) {
		return (
			<button
				type="button"
				onClick={() =>
					connect.mutate({ connector: connectors[0] ?? injected() })
				}
				className="rounded-full border border-white/6 bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
			>
				Connect Wallet
			</button>
		);
	}

	if (!token) {
		return (
			<button
				type="button"
				onClick={() => authenticate()}
				disabled={isAuthenticating}
				className="rounded-full border border-white/6 bg-[#1e1e1e] px-4 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-[#262626] disabled:opacity-50"
			>
				{isAuthenticating ? "Signing..." : "Sign In"}
			</button>
		);
	}

	const displayAddress = address ? truncateAddress(address) : "Connected";
	const avatarColor = address
		? colorFromAddress(address)
		: "hsl(210, 15%, 40%)";

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-2.5 rounded-full border border-white/6 bg-[#1e1e1e] py-1 pr-3 pl-1 transition-colors hover:bg-[#262626]"
				>
					<span
						className="size-7 rounded-full"
						style={{
							background: `linear-gradient(135deg, ${avatarColor}, hsl(260, 70%, 55%))`,
						}}
					/>
					<span className="text-[13px] font-medium text-foreground">
						{displayAddress}
					</span>
				</button>
			</DialogTrigger>
			<WalletModal />
		</Dialog>
	);
}
