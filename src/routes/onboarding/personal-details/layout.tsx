import { component$, Slot } from "@builder.io/qwik";

export { onProfileOnboardingRequest as onRequest } from "~/lib/auth";

export default component$(() => {
	return <Slot />;
});
