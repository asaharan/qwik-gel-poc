import { $, component$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { generatePKCE } from "~/lib/auth/pkce";

export const getSignUpUrl = server$(function () {
	console.log("getSignUpUrl starts");
	const redirectUrl = new URL("./ui/signup", process.env.GEL_AUTH_BASE_URL);
	const challenge = generatePKCE();
	redirectUrl.searchParams.set("challenge", challenge.challenge);
	this.cookie.set("gel-pkce-verifier", challenge.verifier);
	return redirectUrl.toString();
});

export default component$(() => {
	return (
		<div>
			<button
				class="btn btn-primary"
				type="button"
				onClick$={$(async () => {
					const url = await getSignUpUrl();
					window.location.href = url;
				})}
			>
				Sign Up
			</button>
		</div>
	);
});
