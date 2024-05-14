import { getIssuesJoined, type IssueJoined } from "@/actions/issueActions";
import { getUser } from "@/actions/userActions";
import { getLabels, getStatuses } from "@/lib/utils";
import PageIssues from "@/app/(overview)/backlog/sprints-component";
import { auth } from "@/auth";
import { getUserProject } from "@/actions/userProjectActions";
import { useSession } from "next-auth/react";
import { getAllUserProjects } from "@/actions/projectActions";
import { getLoggedInUser } from "@/actions/authActions";
import Link from "next/link";
import { PageLink } from "@/components/nav/page-link";

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, react/function-component-definition
export default async function Home() {
  await auth();
  const loggedInUser = await getLoggedInUser();
  const projects = await getAllUserProjects(loggedInUser?.id);
  return (
    <main className="">
      <h1 className="text-4xl m-10">Projects</h1>
      <div className="flex flex-col space-y-10">
        {projects.map(p => {
          return (
            <div key={p.project.ID} className="h-16 bg-gray-600 m-10 rounded-lg flex items-center">
              <PageLink className="text-center text-2xl ml-20" href={`./project/${p.project.ID}/active-sprint`}>{p.project.Name}</PageLink>
            </div>
          )
        })}
      </div>
    </main>
  );
}
