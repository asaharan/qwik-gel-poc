import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, server$, useNavigate } from "@builder.io/qwik-city";
import { updateUserDetails } from "~/lib/user/update";

type FormSchema = {
	name: string;
	phone: string;
};

export const updatePersonalDetails = server$(async function (data: FormSchema) {
	try {
		const authCookie = this.cookie.get("gel-auth-token");
		if (!authCookie?.value) {
			return {
				success: false,
				error: "Not authenticated",
			};
		}
		await updateUserDetails(authCookie.value, data);
		return {
			success: true,
		};
	} catch (error) {
		console.log("error occurred in updatePersonalDetails");
		console.log(error);
		return {
			success: false,
			error: "Failed to save personal details. Please try again.",
		};
	}
});

export default component$(() => {
	const name = useSignal("");
	const phone = useSignal("");
	const navigate = useNavigate();

	return (
		<div class="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
			<div class="card w-full max-w-md bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="text-center mb-6">
						<h1 class="text-3xl font-bold text-base-content">
							Complete Your Profile
						</h1>
						<p class="text-base-content/70 mt-2">
							Tell us a bit about yourself to get started
						</p>
					</div>

					<form class="space-y-4">
						<div class="form-control">
							<label for="name" class="label">
								<span class="label-text font-medium">Full Name</span>
							</label>
							<fieldset name="name">
								<input
									name="name"
									type="text"
									required
									class="input w-full"
									bind:value={name}
								/>
							</fieldset>
						</div>

						<div class="form-control">
							<label for="phone" class="label">
								<span class="label-text font-medium">Phone Number</span>
							</label>
							<fieldset>
								<input
									type="text"
									required
									class="input w-full"
									bind:value={phone}
								/>
							</fieldset>
						</div>

						<div class="form-control mt-6">
							<button
								onClick$={$(async () => {
									console.log(
										"submitting personal details",
										name.value,
										phone.value,
									);
									await updatePersonalDetails({
										name: name.value,
										phone: phone.value,
									});
									navigate("/dashboard");
									console.log("Personal details updated");
								})}
								type="button"
								class={{
									"btn btn-primary w-full": true,
									// loading: form.submitting,
								}}
								// disabled={form.submitting}
							>
								Continue
								{/* {form.submitting ? "Saving..." : "Continue"} */}
							</button>
						</div>
					</form>

					<div class="divider text-base-content/50">Step 1 of 2</div>

					<div class="text-center">
						<div class="flex justify-center space-x-2">
							<div class="w-3 h-3 rounded-full bg-primary"></div>
							<div class="w-3 h-3 rounded-full bg-base-300"></div>
						</div>
						<p class="text-sm text-base-content/60 mt-2">Personal Details</p>
					</div>
				</div>
			</div>
		</div>
	);
});

export const head: DocumentHead = {
	title: "Complete Your Profile",
	meta: [
		{
			name: "description",
			content: "Complete your personal details to get started",
		},
	],
};
