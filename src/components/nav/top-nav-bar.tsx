import { CreateIssueLink } from '@/components/create-issue-link';
import { CreateProjectLink } from '@/components/create-project-link';
import { getLoggedInUser } from '@/actions/authActions';

import { PageLink } from './page-link';
import NavButton from './nav-button';

export default async function TopNavBar() {
	const loggedInUser = await getLoggedInUser();
	const isUserLoggedIn = !!loggedInUser;

	return (
		<div className="mb-5 bg-slate-300">
			<div className="mx-auto flex w-full max-w-7xl justify-between p-3">
				<div className="flex space-x-4">
					<PageLink
						className="p-2 hover:rounded-md hover:bg-slate-400"
						href="/"
					>
						Overview
					</PageLink>
					{isUserLoggedIn && <CreateIssueLink />}
					{isUserLoggedIn && <CreateProjectLink />}
					{isUserLoggedIn && (
						<PageLink
							className="p-2 hover:rounded-md hover:bg-slate-400"
							href="/profile"
						>
							Profile
						</PageLink>
					)}
				</div>
				<div className="flex space-x-4">
					{!isUserLoggedIn ? (
						<>
							<PageLink
								className="p-2 hover:rounded-md hover:bg-slate-400"
								href="/login"
							>
								Log In
							</PageLink>
							<PageLink
								className="p-2 hover:rounded-md hover:bg-slate-400"
								href="/signup"
							>
								Sign Up
							</PageLink>
						</>
					) : (
						<NavButton name="Log Out" />
					)}
				</div>
			</div>
		</div>
	);
}
