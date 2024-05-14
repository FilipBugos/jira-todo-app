import { IssueJoined, getIssue, getIssuesJoined } from "@/actions/issueActions";
import { getUser } from "@/actions/userActions";
import { getLabels, getStatuses } from "@/lib/utils";
import StatusesComponent from "./statuses-component";
import { eq } from "drizzle-orm";
import { project } from "../../../../../db/schema";
import { getUsersOfTheProject } from "@/actions/userProjectActions";

type ProjectOverviewPageProps = {
  params: {
    id: number;
  };
};

export default async function ProjectOverview({ params }: ProjectOverviewPageProps) {
  const issues = await getIssuesJoined([eq(project.ID, params.id)]);
  const users = await getUsersOfTheProject(params.id);
  
  const grouped = issues.reduce(
    (acc: { [key: string | number]: IssueJoined[] }, issue) => {
      acc[issue.Status ?? "none"] = acc[issue.Status ?? "none"] || [];
      acc[issue.Status ?? "none"].push(issue);
      return acc;
    },
    {}
  );
  return (
    <StatusesComponent
      issues={grouped}
      users={users.map(u => u.user)}
      labels={getLabels()}
      statuses={getStatuses()}
    />
  );
}
