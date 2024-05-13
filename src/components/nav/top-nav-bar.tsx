import { eq } from 'drizzle-orm';

import { getAllUserProjects } from '@/actions/projectActions';
import { getUser } from '@/actions/userActions';

import CreateIssueDialog from '../create-issue-dialog';
import { user } from '../../../db/schema';
import CreateProjectDialog from '../create-project-dialog';

import { PageLink } from './page-link';
import { getSession } from 'next-auth/react';
import { session } from '@auth/core/lib/actions';
import { cookies } from 'next/headers';
import { auth } from '@/auth';

export default async function TopNavBar() {
	const session = await auth();
	const loggedInUser = session?.user;
	const allUserProject = await getAllUserProjects(loggedInUser?.id);
	console.log(`AllUserProject: ${allUserProject}`);
	console.log(`LoggedInUser: ${loggedInUser?.id}`);
	if (!loggedInUser) {
		<div>Error</div>;
	}
	const users = await getUser();

	const sprints = allUserProject.flatMap(p => p.project.Sprints);
	return (
		<div className="mb-5 flex flex-row gap-2 bg-slate-300">
			<div className="m-3">
				<PageLink className="p-2 hover:rounded-md hover:bg-slate-400" href="/">
					Overview
				</PageLink>
			</div>
			<div className="m-3">
				<CreateIssueDialog
					projects={allUserProject}
					trigger={
						<button className="flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95">
							Create issue
						</button>
					}
					sprints={sprints.map(s => s)}
				/>
			</div>
			<div className="m-3">
				<CreateProjectDialog
					trigger={
						<button className="flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95">
							Create project
						</button>
					}
					users={users}
				/>
			</div>
			<div className="m-3">
				<PageLink
					className="p-2 hover:rounded-md hover:bg-slate-400"
					href="profile"
				>
					Profile
				</PageLink>
				<p className="text-white">{loggedInUser?.name}</p>
			</div>
		</div>
	);
}
