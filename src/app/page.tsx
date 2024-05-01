import { IssueJoined, getIssue, getIssuesJoined } from "@/actions/issueActions";
import { db } from "../../db/db";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Providers } from "./providers";
import IssueTable from "@/components/issue-table";
import PageIssues from "@/components/page-issue-component";
import { getUser } from "@/actions/userActions";
import { getLabels, getStatuses } from "@/lib/utils";

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
    <main className="">
      <PageIssues
        issues={grouped}
        users={users}
        labels={getLabels()}
        statuses={getStatuses()}
      />
    </main>
  );
}
