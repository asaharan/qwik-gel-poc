import e from "~/lib/dbschema";
import { getCurrentUser, getUserClient } from "../auth";

export const createOrganization = async (
	token: string,
	data: { organizationName: string },
) => {
	const client = getUserClient(token);
	const user = await getCurrentUser(token);
	const insertQuery = e.insert(e.Organization, {
		name: data.organizationName,
	});
	const userQuery = e.assert_single(
		e.select(e.User, () => ({
			filter_single: {
				id: e.uuid(user.id),
			},
			name: true,
		})),
	);

	const membershipCreateQuery = e.insert(e.OrgMember, {
		user: userQuery,
		organization: insertQuery,
		role: "Owner",
	});
	await membershipCreateQuery.run(client);
};
