import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

import "../styles.css";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main className="mx-auto w-full max-w-[1500px] px-4 py-8 md:px-6 lg:px-10">
				<Outlet />
			</main>
		</div>
	);
}
