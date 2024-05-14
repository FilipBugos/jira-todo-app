import { getIssuesJoined, type IssueJoined } from '@/actions/issueActions';
import { getUser } from '@/actions/userActions';
import { getLabels, getStatuses } from '@/lib/utils';
import PageIssues from '@/app/(overview)/backlog/sprints-component';
import { auth } from '@/auth';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, react/function-component-definition
export default async function Home() {
	const session = await auth();
	console.log(session);
	const issues = await getIssuesJoined();
	const users = await getUser();
	const grouped = issues.reduce(
		(acc: { [key: string | number]: IssueJoined[] }, issue) => {
			acc[issue.SprintID ?? 'none'] = acc[issue.SprintID ?? 'none'] || [];
			acc[issue.SprintID ?? 'none'].push(issue);
			return acc;
		},
		{}
	);
	return (
		<main className="">
			<PageIssues
				issues={grouped}
				users={users}
				labels={getLabels()}
				statuses={getStatuses()}
			/>
		</main>
	);
}
