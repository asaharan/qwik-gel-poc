import e from "~/lib/dbschema";
import { getUserClient } from "../auth";
export const updateUserDetails = async (
	token: string,
	{ name, phone }: { name: string; phone: string },
) => {
	const client = getUserClient(token);
	const query = e.update(e.User, (user) => ({
		filter_single: e.op(
			user.identity,
			"=",
			e.ext.auth.global.ClientTokenIdentity,
		),
		set: {
			name: name,
			phone: phone,
			personal_details_complete: true,
		},
	}));
	await query.run(client);
};
