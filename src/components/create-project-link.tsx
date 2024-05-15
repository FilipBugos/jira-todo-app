import { getUser } from '@/actions/userActions';
import { getLoggedInUser } from '@/actions/authActions';
import CreateProjectDialog from '@/components/create-project-dialog';

export const CreateProjectLink = async () => {
	const loggedInUser = await getLoggedInUser();
	if (!loggedInUser) {
		<div>Error</div>;
	}

	const users = await getUser();
	console.log('CreateProjectLink - users');
	console.log(users);
	return (
		<div className="p-2 hover:rounded-md flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95">
			<CreateProjectDialog
				trigger={
					<button className="">
						CREATE PROJECT
					</button>
				}
				users={users}
				loggedInUser={loggedInUser}
			/>
		</div>
	);
};