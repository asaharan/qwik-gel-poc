import { component$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import Signup from "~/components/auth/signup";
import { getCurrentUser } from "~/lib/auth";

export default component$(() => {
	const addUser = server$(async function () {
		console.log("addUser");
		const token = this.cookie.get("gel-auth-token")?.value;
		console.log("token", token);
		if (!token) return null;
		return await getCurrentUser(token);
	});
	return (
		<div>
			<button
				type="button"
				onClick$={async () => {
					const re = await addUser();
					console.log(re);
				}}
			>
				Server action
			</button>
			<Signup />
		</div>
	);
});
