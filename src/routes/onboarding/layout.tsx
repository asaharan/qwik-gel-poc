import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
	return (
		<div class="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
			{/* Main Content */}
			<div class="flex-1">
				<Slot />
			</div>
		</div>
	);
});
