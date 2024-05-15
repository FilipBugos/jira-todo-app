import { and, eq, isNotNull } from 'drizzle-orm';

import { getIssuesJoined, type IssueJoined } from '@/actions/issueActions';
import { getLabels, getStatuses } from '@/lib/utils';
import { getUsersOfTheProject } from '@/actions/userProjectActions';

import { issue, project } from '../../../../../db/schema';

import StatusesComponent from './statuses-component';
import { getUser } from '@/actions/userActions';
import { getActiveUserSprint } from '@/actions/sprintActions';

type ProjectOverviewPageProps = {
	params: {
		id: number;
	};
};

const backlogSprintName = 'Backlog';
export default async function ProjectOverview({
	params
}: ProjectOverviewPageProps) {
	const sprint = await getActiveUserSprint();
	const issues = await getIssuesJoined([
		and(eq(project.ID, params.id), eq(issue.SprintID, sprint?.ID))
	]);
	const users = await getUsersOfTheProject(params.id);

	const grouped = issues.reduce(
		(acc: { [key: string | number]: IssueJoined[] }, issue) => {
			acc[issue.Status ?? 'none'] = acc[issue.Status ?? 'none'] || [];
			acc[issue.Status ?? 'none'].push(issue);
			return acc;
		},
		{}
	);
	return (
		<StatusesComponent
			issues={grouped}
			users={users.map(u => u.user)}
			labels={getLabels()}
			statuses={getStatuses()}
		/>
	);
}
