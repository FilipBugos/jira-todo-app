import { getIssuesJoined, IssueJoined } from "@/actions/issueActions";
import { getUsersOfTheProject } from "@/actions/userProjectActions";
import { eq } from "drizzle-orm";
import { project } from "../../../../../db/schema";
import SprintsComponent from "./sprints-component";
import { getLabels, getStatuses } from "@/lib/utils";

type ProjectOverviewPageProps = {
  params: {
    id: number;
  };
};

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export default async function Backlog({ params }: ProjectOverviewPageProps) {
  const issues = await getIssuesJoined([eq(project.ID, params.id)]);
  const users = (await getUsersOfTheProject(params.id)).map(u => u.user);

  const grouped = issues.reduce(
    (acc: { [key: string | number]: IssueJoined[] }, issue) => {
      acc[issue.SprintID ?? "none"] = acc[issue.SprintID ?? "none"] || [];
      acc[issue.SprintID ?? "none"].push(issue);
      return acc;
    },
    {}
  );
  return (
    <SprintsComponent
      issues={grouped}
      users={users}
      labels={getLabels()}
      statuses={getStatuses()}
    />
  );
}
