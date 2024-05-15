import { eq } from 'drizzle-orm';

import { getIssuesJoined } from '@/actions/issueActions';
import { getLabels, getStatuses } from '@/lib/utils';
import { getUsersOfTheProject } from '@/actions/userProjectActions';

import { project } from '../../../../../db/schema';

import AllIssuesComponent from './all-issues-component';

type ProjectOverviewPageProps = {
	params: {
		id: number;
	};
};

export default async function AllIsues({ params }: ProjectOverviewPageProps) {
	const issues = await getIssuesJoined([eq(project.ID, params.id)]);
	const users = (await getUsersOfTheProject(params.id)).map(u => u.user);

	return (
		<AllIssuesComponent
			issues={issues}
			users={users}
			labels={getLabels()}
			statuses={getStatuses()}
		/>
	);
}
