import { eq, or } from 'drizzle-orm';

import { getAllUserProjects } from '@/actions/projectActions';
import { getIssuesJoined } from '@/actions/issueActions';
import avatar from '@/assets/avatar.png';
import { getLoggedInUser } from '@/actions/authActions';

import { issue } from '../../../db/schema';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, react/function-component-definition
export default async function Profile() {
	const loggedInUser = await getLoggedInUser();

	if (!loggedInUser) {
		return <h1>Not logged in</h1>;
	}

	// TODO: cut the list of projects/issues based on the relevance
	const projects = await getAllUserProjects(loggedInUser.id);
	const issues = await getIssuesJoined([
		or(
			eq(issue.AssignedTo, loggedInUser.id),
			eq(issue.CreatedBy, loggedInUser.id)
		)
	]);

	return (
		<div className="flex flex-grow flex-col items-center gap-10">
			<div>
				<img
					className="w-100 h-48 rounded-md object-cover"
					alt="avatar"
					src={avatar.src}
				/>
			</div>
			<div className="self-center">
				<h1 className="justify-self-center text-4xl">{loggedInUser?.name}</h1>
			</div>
			<div className="w-1/3">
				<h2 className="text-2xl">Projects</h2>
				<ul className="mt-5">
					<li className="list-style-type:square">
						<div className="flex flex-row gap-10">
							{/* redirect to project via url */}
							<p className="w-1/2 text-left text-lg underline underline-offset-4">
								Project Name
							</p>
						</div>
					</li>
				</ul>
				<ul className="mt-5">
					{projects.map(p => (
						<li key={p.project?.ID} className="list-style-type:square">
							<div className="flex flex-row gap-10">
								<label className="w-1/2 text-left text-lg">
									{p.project?.Name}
								</label>
							</div>
						</li>
					))}
				</ul>
			</div>
			<div className="w-1/3">
				<h2 className="text-2xl">Most recent issues</h2>
				<ul className="mt-5">
					<li className="list-style-type:square">
						<div className="flex flex-row gap-10">
							{/* redirect to issue via url */}
							<p className="w-1/3 text-left text-lg underline underline-offset-4">
								Summary
							</p>
							<p className="w-1/3 text-center text-lg underline underline-offset-4">
								Sprint name
							</p>
							<p className="w-1/3 text-right text-lg underline underline-offset-4">
								Estimation
							</p>
						</div>
					</li>
				</ul>
				<ul className="mt-5">
					{issues.map(issue => (
						<li key={issue.ID} className="list-style-type:square">
							<div className="flex flex-row gap-10">
								{/* make the moving via url */}
								<label className="w-1/3 text-left text-lg">
									{issue.Summary}
								</label>
								<label className="w-1/3 text-center text-lg">
									{issue.Sprint?.Name}
								</label>
								<label className="w-1/3 text-right text-lg">
									{issue.Estimation}
								</label>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
