import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";

export const useDashboardLoader = routeLoader$(
	async ({ redirect, sharedMap }) => {
		if (sharedMap.has("user")) {
			return sharedMap.get("user");
		}
		throw redirect(302, "/signin?get-auth-token-not-found");
	},
);

export default component$(() => {
	const dashboardData = useDashboardLoader();

	return (
		<div class="min-h-screen bg-base-100">
			{/* Header */}
			<div class="navbar bg-base-200 shadow-sm">
				<div class="navbar-start">
					<h1 class="text-xl font-bold text-base-content">Dashboard</h1>
				</div>
				<div class="navbar-end">
					<div class="dropdown dropdown-end">
						<button
							tabIndex={0}
							type="button"
							class="btn btn-ghost btn-circle avatar"
						>
							<div class="w-10 rounded-full bg-primary/20 flex items-center justify-center">
								<span class="text-primary font-medium">
									{dashboardData.value?.name?.[0]?.toUpperCase() || "U"}
								</span>
							</div>
						</button>
						<ul
							// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
							tabIndex={0}
							class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
						>
							<li>
								<span class="text-base-content/70">
									{dashboardData.value?.email}
								</span>
							</li>
							<li>
								<a>Profile</a>
							</li>
							<li>
								<a>Settings</a>
							</li>
							<li>
								<a>Sign Out</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div class="container mx-auto p-6 max-w-7xl">
				{/* Welcome Section */}
				<div class="mb-8">
					<div class="hero bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
						<div class="hero-content text-center py-12">
							<div class="max-w-md">
								<h1 class="text-4xl font-bold text-base-content mb-4">
									Welcome back, {dashboardData.value?.name?.split(" ")[0]}!
								</h1>
								<div class="flex items-center justify-center space-x-2 mb-4">
									{dashboardData.value?.accountType === "personal" ? (
										<>
											<div class="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-5 w-5 text-secondary"
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
											<span class="text-lg font-medium text-base-content">
												Personal Account
											</span>
										</>
									) : (
										<>
											<div class="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-5 w-5 text-primary"
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
											<span class="text-lg font-medium text-base-content">
												{dashboardData?.value?.membership?.organization?.name ||
													"Not set"}
											</span>
										</>
									)}
								</div>
								<p class="text-base-content/70">
									{dashboardData.value?.is_personal_account
										? "Your personal workspace is ready to use"
										: `Welcome to your ${dashboardData.value?.membership?.organization?.name || "Not set"} workspace`}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					<div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
						<div class="card-body">
							<div class="flex items-center space-x-3">
								<div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
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
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>
								</div>
								<div>
									<h3 class="font-semibold text-base-content">New Document</h3>
									<p class="text-sm text-base-content/70">
										Create a new document
									</p>
								</div>
							</div>
						</div>
					</div>

					<div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
						<div class="card-body">
							<div class="flex items-center space-x-3">
								<div class="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
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
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<div>
									<h3 class="font-semibold text-base-content">
										View Documents
									</h3>
									<p class="text-sm text-base-content/70">
										Browse all documents
									</p>
								</div>
							</div>
						</div>
					</div>

					<div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
						<div class="card-body">
							<div class="flex items-center space-x-3">
								<div class="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6 text-accent"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								</div>
								<div>
									<h3 class="font-semibold text-base-content">Settings</h3>
									<p class="text-sm text-base-content/70">
										Configure your account
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Account Information */}
				<div class="card bg-base-200 shadow-sm">
					<div class="card-body">
						<h2 class="card-title text-base-content mb-4">
							Account Information
						</h2>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 class="font-medium text-base-content mb-2">
									Personal Details
								</h3>
								<div class="space-y-2">
									<div class="flex justify-between">
										<span class="text-base-content/70">Name:</span>
										<span class="text-base-content">
											{dashboardData.value?.name}
										</span>
									</div>
									<div class="flex justify-between">
										<span class="text-base-content/70">Email:</span>
										<span class="text-base-content">
											{dashboardData.value?.email}
										</span>
									</div>
								</div>
							</div>
							<div>
								<h3 class="font-medium text-base-content mb-2">Account Type</h3>
								<div class="space-y-2">
									<div class="flex justify-between">
										<span class="text-base-content/70">Type:</span>
										<span class="text-base-content">
											{dashboardData.value?.accountType === "personal"
												? "Personal Account"
												: "Organization Account"}
										</span>
									</div>
									{dashboardData.value?.organizationName && (
										<div class="flex justify-between">
											<span class="text-base-content/70">Organization:</span>
											<span class="text-base-content">
												{dashboardData.value.organizationName}
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export const head: DocumentHead = {
	title: "Dashboard",
	meta: [
		{
			name: "description",
			content: "Your main dashboard",
		},
	],
};
