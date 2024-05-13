import { IssueJoined, getIssue, getIssuesJoined } from "@/actions/issueActions";
import { getUser } from "@/actions/userActions";
import { getLabels, getStatuses } from "@/lib/utils";
import SprintsComponent from "./sprints-component";

export default async function Home() {
  const issues = await getIssuesJoined();
  const users = await getUser();

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
