import { getAllUserProjects } from "@/actions/projectActions";
import CreateIssueDialog from "../create-issue-dialog";
import { getUser } from "@/actions/userActions";
import { eq, or } from "drizzle-orm";
import { sprint, user, userProject, project } from "../../../db/schema";
import { getSprint, getSprintsOfUser } from "@/actions/sprintActions";
import { Link } from "lucide-react";
import { PageLink } from "./page-link";
import CreateProjectDialog from "../create-project-dialog";

export default async function TopNavBar() {
  
  const loggedInUserId = 1;
  const loggedInUser = (await getUser([eq(user.ID, loggedInUserId)])).at(0);
  if (!loggedInUser) {
    <div>Error</div>
  }

  const sprints = await getSprintsOfUser(loggedInUser ? [eq(user.ID, loggedInUser?.ID)] : undefined);
  const users = await getUser();
  const projects = await getAllUserProjects(loggedInUser ? [or(eq(userProject.User, loggedInUser?.ID), eq(project.CreatedBy, loggedInUser?.ID)) ?? eq(userProject.User, loggedInUser?.ID)] : undefined);
  return (
    
    <>
      <div className="bg-slate-300 flex flex-row gap-2 mb-5" >
        <div className="m-3">
                <PageLink className="hover:bg-slate-400 hover:rounded-md p-2" href="/">Overview</PageLink>
        </div>
        <div className="m-3">
            <CreateIssueDialog projects={projects}
             trigger={<button className="flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95">Create issue</button>}
             sprints={sprints.map(s => s.sprint)}
             />
        </div>
        <div className="m-3">
            <CreateProjectDialog 
             trigger={<button className="flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95">Create project</button>}
             users={users} />
        </div>
        <div className="m-3">
                <PageLink className="hover:bg-slate-400 hover:rounded-md p-2" href="...">Profile</PageLink>
        </div>
      </div>
    </>
  );
}
