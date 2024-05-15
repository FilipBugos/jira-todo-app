import { getAllUserProjects } from '@/actions/projectActions';
import { getLoggedInUser } from '@/actions/authActions';
import { PageLink } from '@/components/nav/page-link';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, react/function-component-definition
export default async function Home() {
	const loggedInUser = await getLoggedInUser();
	const projects = await getAllUserProjects(loggedInUser?.id);
	return (
		<main className="">
			<h1 className="m-10 text-4xl">Projects</h1>
			<div className="flex flex-col space-y-10">
				{projects.map(p => (
					<div
						key={p.project.ID}
						className="m-10 flex h-16 items-center rounded-lg bg-gray-600"
					>
						<PageLink
							className="ml-20 text-center text-2xl"
							href={`./project/${p.project.ID}/active-sprint`}
						>
							{p.project.Name}
						</PageLink>
					</div>
				))}
			</div>
		</main>
	);
}
