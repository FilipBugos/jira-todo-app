import { and, eq, isNull } from 'drizzle-orm';

import { getIssuesJoined, type IssueJoined } from '@/actions/issueActions';
import { getUsersOfTheProject } from '@/actions/userProjectActions';
import { getLabels, getStatuses } from '@/lib/utils';
import { getLoggedInUser } from '@/actions/authActions';
import { getSprint } from '@/actions/sprintActions';
import { cn } from '@/lib/cn';

import { issue, project, sprint } from '../../../../../db/schema';

import SprintsComponent from './sprints-component';
import CreateIssueDialog from './create-sprint-dialog';

type ProjectOverviewPageProps = {
	params: {
		id: number;
	};
};

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export default async function Backlog({ params }: ProjectOverviewPageProps) {
	const projectId = params.id;
	const user = await getLoggedInUser();
	const issues = await getIssuesJoined([
		and(eq(project.ID, params.id), isNull(issue.SprintID))
	]);
	const users = (await getUsersOfTheProject(params.id)).map(u => u.user);
	const currentSprints = await getSprint([eq(sprint.Project, projectId)]);
	const newSprintNumber = currentSprints.length + 1;
	const disableAddingSprint =
		currentSprints.filter(s => s.EndDate > new Date()).length > 0;

	const grouped = issues.reduce(
		(acc: { [key: string | number]: IssueJoined[] }, issue) => {
			acc[issue.SprintID ?? 'none'] = acc[issue.SprintID ?? 'none'] || [];
			acc[issue.SprintID ?? 'none'].push(issue);
			return acc;
		},
		{}
	);
	return (
		<div className="flex flex-col">
			<div className="flex flex-row">
				<CreateIssueDialog
					trigger={
						<button
							disabled={disableAddingSprint}
							className={cn(
								'ml-4 flex cursor-pointer items-center justify-between rounded-md px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95',
								disableAddingSprint ? 'bg-slate-200' : 'bg-gray-600'
							)}
						>
							New Sprint
						</button>
					}
					issues={issues}
					user={user}
					projectId={projectId}
					newSprintNumber={Number(newSprintNumber)}
				/>
				{disableAddingSprint && (
					<p className="ml-4 mt-2">
						There is an ongoing sprint in this project. You cannot create new
						one
					</p>
				)}
			</div>
			<SprintsComponent
				issues={grouped}
				users={users}
				labels={getLabels()}
				statuses={getStatuses()}
			/>
		</div>
	);
}
