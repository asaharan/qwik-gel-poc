import { component$, Slot } from "@builder.io/qwik";

export { onDashboardRequest as onRequest } from "../../lib/auth";

export default component$(() => {
	return (
		<div class="min-h-screen bg-base-100">
			<Slot />
		</div>
	);
});
