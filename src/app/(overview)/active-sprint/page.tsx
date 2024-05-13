import { IssueJoined, getIssue, getIssuesJoined } from "@/actions/issueActions";
import { getUser } from "@/actions/userActions";
import { getLabels, getStatuses } from "@/lib/utils";
import StatusesComponent from "./statuses-component";

export default async function Home() {
  const issues = await getIssuesJoined();
  const users = await getUser();

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
      users={users}
      labels={getLabels()}
      statuses={getStatuses()}
    />
  );
}
