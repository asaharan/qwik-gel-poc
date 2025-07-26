import { component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { getUserClient } from "~/lib/auth";
import e from "~/lib/dbschema";

export const onGet: RequestHandler = async ({
	query,
	json,
	cookie,
	redirect,
}) => {
	const code = query.get("code");
	console.log("callback ");
	if (!code) {
		throw json(422, { error: "Missing code parameter" });
	}
	console.log("code found");

	const verifier = cookie.get("gel-pkce-verifier");
	if (!verifier?.value) {
		throw json(400, {
			error: `Could not find 'verifier' in the cookie store. Is this the \
same user agent/browser that started the authorization flow?`,
		});
	}

	const codeExchangeUrl = new URL("token", process.env.GEL_AUTH_BASE_URL);
	codeExchangeUrl.searchParams.set("code", code);
	codeExchangeUrl.searchParams.set("verifier", verifier.value);
	const codeExchangeResponse = await fetch(codeExchangeUrl.href, {
		method: "GET",
	});

	if (!codeExchangeResponse.ok) {
		const text = await codeExchangeResponse.text();
		throw json(400, { error: `Error from the auth server: ${text}` });
	}

	const { auth_token, ...other } = await codeExchangeResponse.json();
	console.log(auth_token);
	console.log(other);
	cookie.set("gel-auth-token", auth_token, {
		path: "/",
		httpOnly: true,
		sameSite: "Strict",
		secure: process.env.NODE_ENV === "production",
	});
	const client = getUserClient(auth_token);
	const emailSignUpEmail = e.assert_single(
		e.select(e.ext.auth.EmailPasswordFactor, (emailFactor) => ({
			email: emailFactor.email,
			filter_single: e.op(
				emailFactor.identity,
				"=",
				e.ext.auth.global.ClientTokenIdentity,
			),
		})),
	);
	const email = await emailSignUpEmail.run(client);
	console.log({ email: email.email });
	const insertQuery = e.insert(e.User, {
		email: email.email,
		identity: e.ext.auth.global.ClientTokenIdentity,
	});
	console.log("insertQuery", insertQuery);
	await insertQuery.run(getUserClient(auth_token));
	console.log("inserted Query", insertQuery);

	throw redirect(302, "/dashboard");
};

export default component$(() => {
	return <div>Handle callback</div>;
});
