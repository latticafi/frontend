import { usePrivy } from "@privy-io/react-auth";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { WalletModal } from "@/components/WalletModal";

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
	const { user } = usePrivy();

	const wallet = user?.wallet;
	const displayAddress = wallet ? truncateAddress(wallet.address) : "No wallet";
	const avatarColor = wallet
		? colorFromAddress(wallet.address)
		: "hsl(210, 15%, 40%)";

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-[#1e1e1e] py-1 pr-3 pl-1 transition-colors hover:bg-[#262626]"
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
