import CreateIssueDialog from "@/components/create-issue-dialog";
import {getAllUserProjects} from "@/actions/projectActions";
import {getUser} from "@/actions/userActions";
import {getLoggedInUser} from "@/actions/authActions";

export const CreateIssueLink = async () => {
	const loggedInUser =  await getLoggedInUser();
	const allUserProject = await getAllUserProjects(loggedInUser?.id);
	if (!loggedInUser) {
		<div>Error</div>;
	}
	const users = await getUser();

	const sprints = allUserProject.flatMap(p => p.project.Sprints);

	return (

	<div className="m-3">
		<CreateIssueDialog
			projects={allUserProject}
			trigger={
				<button
					className="flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95">
					Create issue
				</button>
			}
			sprints={sprints.map(s => s)}
		/>
	</div>
	)
}