import { eq } from "drizzle-orm";

import { getAllUserProjects } from '@/actions/projectActions';
import { getIssuesJoined } from '@/actions/issueActions';
import { getUser } from '@/actions/userActions';
import avatar from '@/assets/avatar.png';
import { getLoggedInUser } from '@/actions/authActions';

import { issue, user } from '../../../db/schema';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, react/function-component-definition
export default async function Profile() {
	const loggedInUser = await getLoggedInUser();

	if (!loggedInUser) {
    return <h1>Not logged in</h1>;
  }

  console.log(loggedInUser);

	// TODO: cut the list of projects/issues based on the relevance
	const projects = await getAllUserProjects(loggedInUser.id);
	const issues = await getIssuesJoined([eq(issue.AssignedTo, loggedInUser.id)]);

	return (
		<div className="flex flex-col items-center gap-10">
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
							<label className="w-1/2 text-left text-lg underline underline-offset-4">
								Project Name
							</label>
							<label className="w-1/2 text-right text-lg underline underline-offset-4">
								Role
							</label>
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
								<label className="w-1/2 text-right text-lg">
									{
										p.project.Members.filter(
											m => m.User.id === loggedInUser.id
										).at(0)?.Role
									}
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
							<label className="w-1/3 text-left text-lg underline underline-offset-4">
								Summary
							</label>
							<label className="w-1/3 text-center text-lg underline underline-offset-4">
								Sprint name
							</label>
							<label className="w-1/3 text-right text-lg underline underline-offset-4">
								Estimation
							</label>
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
