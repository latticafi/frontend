import { createConfig, http } from "wagmi";
import { polygon } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
	chains: [polygon],
	connectors: [injected()],
	transports: {
		[polygon.id]: http(),
	},
});

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}
