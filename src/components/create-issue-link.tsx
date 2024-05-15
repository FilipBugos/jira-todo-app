import CreateIssueDialog from '@/components/create-issue-dialog';
import { getAllUserProjects } from '@/actions/projectActions';
import { getLoggedInUser } from '@/actions/authActions';

export const CreateIssueLink = async () => {
	const loggedInUser = await getLoggedInUser();
	if (!loggedInUser) {
		<div>Error</div>;
	}
	const allUserProject = await getAllUserProjects(loggedInUser.id);

	const sprints = allUserProject.flatMap(p => p.project.Sprints);
	return (
		<div className="flex cursor-pointer items-center justify-between rounded-md bg-gray-600 p-2 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:rounded-md hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95">
			<CreateIssueDialog
				projects={allUserProject}
				trigger={<button>CREATE ISSUE</button>}
				sprints={sprints.map(s => s)}
				user={loggedInUser}
			/>
		</div>
	);
};
