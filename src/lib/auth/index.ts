import type { RequestHandler } from "@builder.io/qwik-city";
import e, { createClient } from "~/lib/dbschema";

export const getUserClient = (token: string) => {
	return createClient().withGlobals({
		"ext::auth::client_token": token,
	});
};

export const getCurrentUser = async (token: string) => {
	const client = createClient().withGlobals({
		"ext::auth::client_token": token,
	});

	const query = e.assert_single(
		e.select(e.User, (user) => ({
			filter_single: e.op(
				user.identity,
				"=",
				e.ext.auth.global.ClientTokenIdentity,
			),
			id: true,
			name: true,
			email: true,
			is_personal_account: true,
			personal_details_complete: true,
			membership: {
				role: true,
				organization: {
					name: true,
				},
			},
		})),
	);
	const user = await query.run(client);

	return user;
};

const createUserRequest: (config: {
	requireCompleteProfile: boolean;
	requireOrgSetup: boolean;
	requireAuth: boolean;
}) => RequestHandler =
	(config) =>
	async ({ cookie, sharedMap, next, redirect }) => {
		const authCookie = cookie.get("gel-auth-token");
		const isLogged = !!authCookie?.value;
		console.log("user is", isLogged);
		if (!isLogged) {
			throw redirect(302, "/?auth=failed");
		}
		const user = await getCurrentUser(authCookie?.value);
		if (!user) {
			if (config.requireAuth)
				throw redirect(302, "/?auth=failed&reason=user_not_found");
			return await next();
		}
		if (!user.personal_details_complete && config.requireCompleteProfile) {
			throw redirect(302, "/onboarding/personal-details");
		}
		if (
			!user.membership &&
			!user.is_personal_account &&
			config.requireOrgSetup
		) {
			throw redirect(302, "/onboarding/organization");
		}
		sharedMap.set("user", user);
		console.log(user);
		return await next();
	};

export const onDashboardRequest = createUserRequest({
	requireAuth: true,
	requireCompleteProfile: true,
	requireOrgSetup: true,
});

export const onProfileOnboardingRequest = createUserRequest({
	requireAuth: true,
	requireCompleteProfile: false,
	requireOrgSetup: false,
});
export const onOrgOnboardingRequest = createUserRequest({
	requireAuth: true,
	requireCompleteProfile: true,
	requireOrgSetup: false,
});
