import { eq } from "drizzle-orm";

import { getAllUserProjects } from "@/actions/projectActions";
import { getIssuesJoined } from "@/actions/issueActions";
import { getUser } from "@/actions/userActions";
import avatar from "@/assets/avatar.png";

import { issue, user } from "../../../db/schema";

export default async function Home() {
  // TODO: change this once auth is done
  const loggedInUser = 1;
  // TODO: cut the list of projects/issues based on the relevance
  const projects = await getAllUserProjects([eq(user.id, loggedInUser)]);
  const issues = await getIssuesJoined([eq(issue.AssignedTo, loggedInUser)]);
  const userEntity = (await getUser([eq(user.id, loggedInUser)])).at(0);

  return (
    <div className="flex flex-col gap-10 items-center">
      <div>
        <img className="rounded-md object-cover h-48 w-100" src={avatar.src} />
      </div>
      <div className="self-center">
        <h1 className="text-4xl justify-self-center">{userEntity?.name}</h1>
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
              <label className="w-1/2 text-lg text-right underline underline-offset-4">
                Role
              </label>
            </div>
          </li>
        </ul>
        <ul className="mt-5">
          {projects.map((p) => (
            <li key={p.project?.ID} className="list-style-type:square">
              <div className="flex flex-row gap-10">
                <label className="w-1/2 text-left text-lg">
                  {p.project?.Name}
                </label>
                <label className="w-1/2 text-right text-lg">
                  {p.userProject.Role}
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
          {issues.map((issue) => (
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
