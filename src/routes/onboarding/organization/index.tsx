import { $, component$, useSignal } from "@builder.io/qwik";
import {
	type DocumentHead,
	Form,
	server$,
	useNavigate,
} from "@builder.io/qwik-city";
import { getUserClient } from "~/lib/auth";
import e from "~/lib/dbschema";
import { createOrganization } from "~/lib/organization/create";

export const createOrganizationAction = server$(async function (data: {
	organizationName: string;
}) {
	try {
		console.log(data);
		const authCookie = this.cookie.get("gel-auth-token");
		if (!authCookie?.value) {
			return {
				success: false,
				error: "Not authenticated",
			};
		}
		await createOrganization(authCookie.value, data);

		return {
			success: true,
		};
	} catch (error) {
		console.error(error);
		if (error instanceof Response) {
			throw error; // Re-throw redirects
		}
		return {
			success: false,
			error: "Failed to create organization. Please try again.",
		};
	}
});

export const skipOrganization = server$(async function () {
	try {
		const authCookie = this.cookie.get("gel-auth-token");
		if (!authCookie?.value) {
			return {
				success: false,
				error: "Not authenticated",
			};
		}
		const client = getUserClient(authCookie.value);
		const updateQuery = e.update(e.User, (user) => ({
			filter_single: e.op(
				user.identity,
				"=",
				e.ext.auth.global.ClientTokenIdentity,
			),
			set: {
				is_personal_account: true,
			},
		}));
		await updateQuery.run(client);
		console.log("marked account as personal");
		return {
			success: true,
		};
	} catch (error) {
		if (error instanceof Response) {
			console.error(error);
		}
		return {
			success: false,
			error: "Failed to set up personal account. Please try again.",
		};
	}
});

export default component$(() => {
	const showCreateForm = useSignal(false);
	const skipOrgAction = useSignal(false);
	const createOrgAction = useSignal(false);
	const organizationName = useSignal("");
	const navigate = useNavigate();

	return (
		<div class="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
			<div class="card w-full max-w-md bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="text-center mb-6">
						<h1 class="text-3xl font-bold text-base-content">
							Organization Setup
						</h1>
						<p class="text-base-content/70 mt-2">
							Set up your workspace or continue with a personal account
						</p>
					</div>

					{!showCreateForm.value ? (
						<div class="space-y-4">
							{/* Create Organization Option */}
							<div
								class="card bg-base-200/50 cursor-pointer hover:bg-base-200 transition-colors"
								onClick$={$(() => {
									showCreateForm.value = true;
								})}
							>
								<div class="card-body p-4">
									<div class="flex items-center space-x-3">
										<div class="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-6 w-6 text-primary"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
												/>
											</svg>
										</div>
										<div class="flex-1">
											<h3 class="font-semibold text-base-content">
												Create Organization
											</h3>
											<p class="text-sm text-base-content/70">
												Set up a workspace for your team
											</p>
										</div>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 text-base-content/50"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</div>
								</div>
							</div>

							{/* Personal Account Option */}
							<button
								type="button"
								onClick$={$(async () => {
									await skipOrganization();
									navigate("/dashboard");
								})}
								class="card bg-base-200/50 cursor-pointer hover:bg-base-200 transition-colors w-full text-left"
							>
								<div class="card-body p-4">
									<div class="flex items-center space-x-3">
										<div class="flex-shrink-0 w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-6 w-6 text-secondary"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
										</div>
										<div class="flex-1">
											<h3 class="font-semibold text-base-content">
												Personal Account
											</h3>
											<p class="text-sm text-base-content/70">
												Continue with individual usage
											</p>
										</div>
										{skipOrgAction.value ? (
											<span class="loading loading-spinner loading-sm"></span>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5 text-base-content/50"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 5l7 7-7 7"
												/>
											</svg>
										)}
									</div>
								</div>
							</button>
						</div>
					) : (
						<div class="space-y-4">
							{/* Back Button */}
							<button
								type="button"
								class="btn btn-ghost btn-sm"
								onClick$={$(() => {
									showCreateForm.value = false;
								})}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-label="Back"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								Back
							</button>

							{/* Organization Creation Form */}
							<Form class="space-y-4">
								<div class="form-control">
									<label class="label" for="organizationName">
										<span class="label-text font-medium">
											Organization Name
										</span>
									</label>
									<input
										id="organizationName"
										type="text"
										name="organizationName"
										placeholder="Enter your organization name"
										class="input input-bordered w-full"
										required
										bind:value={organizationName}
									/>
								</div>

								<div class="form-control mt-6">
									<button
										type="button"
										onClick$={$(async () => {
											await createOrganizationAction({
												organizationName: organizationName.value,
											});
											navigate("/dashboard");
										})}
										class={{
											"btn btn-primary w-full": true,
											loading: createOrgAction.value,
										}}
										disabled={createOrgAction.value}
									>
										{createOrgAction.value
											? "Creating..."
											: "Create Organization"}
									</button>
								</div>
							</Form>
						</div>
					)}

					<div class="divider text-base-content/50">Step 2 of 2</div>

					<div class="text-center">
						<div class="flex justify-center space-x-2">
							<div class="w-3 h-3 rounded-full bg-primary"></div>
							<div class="w-3 h-3 rounded-full bg-primary"></div>
						</div>
						<p class="text-sm text-base-content/60 mt-2">Organization Setup</p>
					</div>
				</div>
			</div>
		</div>
	);
});

export const head: DocumentHead = {
	title: "Organization Setup",
	meta: [
		{
			name: "description",
			content: "Set up your organization or continue with a personal account",
		},
	],
};
