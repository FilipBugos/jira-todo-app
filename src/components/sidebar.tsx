import React from 'react';
import { Settings } from 'lucide-react';

import UpdateProjectDialog from '@/components/update-project-dialog';
import { getLoggedInUser } from '@/actions/authActions';
import { getProjectByID } from '@/actions/projectActions';
import { getUser } from '@/actions/userActions';

import { PageLink } from './nav/page-link';

type SidebarType = {
	projectId: number;
};

const Sidebar = async ({ projectId }: SidebarType) => {
	const loggedInUser = await getLoggedInUser();

	const project = await getProjectByID(projectId);
	const users = await getUser();
	if (!project) {
		return <div>Error</div>;
	}

	if (!loggedInUser) {
		return <div>Error</div>;
	}

	return (
		<div className="flex flex-grow flex-col bg-gray-800 text-white">
			<div className="flex flex-grow flex-col space-y-2 p-4">
				<h1 className="mb-6 text-2xl font-bold">Project: {project.Name}</h1>
				<PageLink href="./backlog">Backlog</PageLink>
				<PageLink href="./active-sprint"> Active sprint</PageLink>
				<PageLink href="./all-issues"> All issues</PageLink>
			</div>
			<div className="justify flex justify-center justify-self-end">
				<UpdateProjectDialog
					users={users}
					trigger={
						<button className="flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95">
							<Settings />
						</button>
					}
					loggedInUser={loggedInUser}
					project={project}
				/>
			</div>
		</div>
	);
};

export default Sidebar;
