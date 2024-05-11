import { eq } from "drizzle-orm";

import { getAllUserProjects } from "@/actions/projectActions";
import { getUser } from "@/actions/userActions";

import CreateIssueDialog from "../create-issue-dialog";
import { user } from "../../../db/schema";
import CreateProjectDialog from "../create-project-dialog";

import { PageLink } from "./page-link";

export default async function TopNavBar() {
  const loggedInUserId = 1;
  const loggedInUser = (await getUser([eq(user.ID, loggedInUserId)])).at(0);
  const allUserProject = await getAllUserProjects(loggedInUserId);
  console.log(`AllUserProject: ${allUserProject}`);
  console.log(`LoggedInUser: ${loggedInUser?.ID}`);
  if (!loggedInUser) {
    <div>Error</div>;
  }
  const users = await getUser();

  const sprints = allUserProject.flatMap((p) => p.project.Sprints);
  return (
    <div className="bg-slate-300 flex flex-row gap-2 mb-5">
      <div className="m-3">
        <PageLink className="hover:bg-slate-400 hover:rounded-md p-2" href="/">
          Overview
        </PageLink>
      </div>
      <div className="m-3">
        <CreateIssueDialog
          projects={allUserProject}
          trigger={
            <button className="flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95">
              Create issue
            </button>
          }
          sprints={sprints.map((s) => s)}
        />
      </div>
      <div className="m-3">
        <CreateProjectDialog
          trigger={
            <button className="flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95">
              Create project
            </button>
          }
          users={users}
        />
      </div>
      <div className="m-3">
        <PageLink
          className="hover:bg-slate-400 hover:rounded-md p-2"
          href="..."
        >
          Profile
        </PageLink>
      </div>
    </div>
  );
}
