import { eq } from 'drizzle-orm';

import { getAllUserProjects } from '@/actions/projectActions';
import { getUser } from '@/actions/userActions';

import CreateIssueDialog from '../create-issue-dialog';
import { user } from '../../../db/schema';
import CreateProjectDialog from '../create-project-dialog';

import { PageLink } from './page-link';
import { getSession } from 'next-auth/react';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { CreateIssueLink } from '@/components/create-issue-link';
import { CreateProjectLink } from '@/components/create-project-link';
import { getLoggedInUser } from '@/actions/authActions';

export default async function TopNavBar() {
	const loggedInUser = await getLoggedInUser();
	const isUserLoggedIn = !!loggedInUser;
	if (!isUserLoggedIn) {
		return (
			<div className="mb-5 flex flex-row gap-2 bg-slate-300">
				<div className="m-3">
					<PageLink
						className="p-2 hover:rounded-md hover:bg-slate-400"
						href="/"
					>
						Overview
					</PageLink>
				</div>
				<div className="m-3">
					<PageLink
						className="p-2 hover:rounded-md hover:bg-slate-400"
						href="login"
					>
						Log In
					</PageLink>
				</div>
			</div>
		);
	}

	return (
		<div className="mb-5 flex flex-row gap-2 bg-slate-300">
			<div className="m-3">
				<PageLink className="p-2 hover:rounded-md hover:bg-slate-400" href="/">
					Overview
				</PageLink>
			</div>
			<CreateIssueLink />
			<CreateProjectLink />
			<div className="m-3">
				<PageLink
					className="p-2 hover:rounded-md hover:bg-slate-400"
					href="profile"
				>
					Profile
				</PageLink>
				<p className="text-white">{loggedInUser?.name}</p>
			</div>
			<div className="m-3">
				<PageLink
					className="p-2 hover:rounded-md hover:bg-slate-400"
					href="logout"
				>
					Log Out
				</PageLink>
				<p className="text-white">{loggedInUser?.name}</p>
			</div>
		</div>
	);
}
