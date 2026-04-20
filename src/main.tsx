import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { AuthProvider } from "@/providers/AuthProvider";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	scrollRestoration: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const queryClient = new QueryClient();

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<RouterProvider router={router} />
				</AuthProvider>
			</QueryClientProvider>
		</WagmiProvider>,
	);
}
