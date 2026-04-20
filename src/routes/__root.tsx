import { usePrivy } from "@privy-io/react-auth";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuthUser } from "@/hooks/useAuthUser";

import "../styles.css";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const { ready, authenticated, login } = usePrivy();
	const { isLoading: isUserSyncing } = useAuthUser();

	useEffect(() => {
		if (ready && !authenticated) {
			login();
		}
	}, [ready, authenticated, login]);

	if (!ready || !authenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background" />
		);
	}

	if (isUserSyncing) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background" />
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main className="mx-auto w-full max-w-[1500px] px-4 py-8 md:px-6 lg:px-10">
				<Outlet />
			</main>
			<TanStackDevtools
				config={{ position: "bottom-right" }}
				plugins={[
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</div>
	);
}
