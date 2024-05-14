import { IssueJoined, getIssue, getIssuesJoined } from "@/actions/issueActions";
import { getUser } from "@/actions/userActions";
import { getLabels, getStatuses } from "@/lib/utils";
import AllIssuesComponent from "./all-issues-component";
import { eq } from "drizzle-orm";
import { project } from "../../../../../db/schema";
import { getUsersOfTheProject } from "@/actions/userProjectActions";

type ProjectOverviewPageProps = {
  params: {
    id: number;
  };
};


export default async function AllIsues({ params }: ProjectOverviewPageProps) {
  const issues = await getIssuesJoined([eq(project.ID, params.id)]);
  const users = (await getUsersOfTheProject(params.id)).map(u => u.user);

  return (
    <AllIssuesComponent
      issues={issues}
      users={users}
      labels={getLabels()}
      statuses={getStatuses()}
    />
  );
}
