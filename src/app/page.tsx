import { useSession } from 'next-auth/react';
import Link from 'next/link';

import {
	getIssuesJoined,
	getProjectsIssues,
	type IssueJoined
} from '@/actions/issueActions';
import { getUser } from '@/actions/userActions';
import { getLabels, getStatuses } from '@/lib/utils';
import { auth } from '@/auth';
import { getUserProject } from '@/actions/userProjectActions';
import { getAllUserProjects } from '@/actions/projectActions';
import { getLoggedInUser } from '@/actions/authActions';
import { PageLink } from '@/components/nav/page-link';

import CollapseIssueOverview from '@/components/collapse-issue-overview';
import { and, eq, or } from 'drizzle-orm';
import { project } from '../../db/schema';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, react/function-component-definition
export default async function Home() {
	const loggedInUser = await getLoggedInUser();
	const projects = await getAllUserProjects(loggedInUser?.id);

	const issues = await getProjectsIssues(projects.map(p => p.project.ID));

	return (
		<main className="h-full w-full">
			<h1 className="m-10 text-4xl">Projects</h1>
			<div className="flex w-full flex-grow flex-col space-y-10">
				{projects.map(p => (
					<div key={p.project.ID}>
						<div className="mx-10 mb-5 mt-10 flex h-16 items-center rounded-lg bg-gray-600">
							<PageLink
								className="ml-20 text-center text-2xl"
								href={`./project/${p.project.ID}/active-sprint`}
							>
								{p.project.Name}
							</PageLink>
						</div>
						<div className="mx-14">
							<CollapseIssueOverview
								issues={issues.filter(issue => issue.ProjectID == p.project.ID)}
							/>
						</div>
					</div>
				))}
			</div>
		</main>
	);
}
