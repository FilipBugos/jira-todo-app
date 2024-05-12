import { IssueJoined, getIssue, getIssuesJoined } from "@/actions/issueActions";
import { getUser } from "@/actions/userActions";
import { getLabels, getStatuses } from "@/lib/utils";
import AllIssuesComponent from "./all-issues-component";

export default async function Home() {
  const issues = await getIssuesJoined();
  const users = await getUser();

  return (
    <AllIssuesComponent
      issues={issues}
      users={users}
      labels={getLabels()}
      statuses={getStatuses()}
    />
  );
}
