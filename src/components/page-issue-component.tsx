"use client";

import { memo, useState } from "react";
import { SelectIssue, SelectUser } from "../../db/schema";
import IssueTable from "./issue-table";
import IssueTableFilters from "./issue-table-filters";
import { IssueJoined } from "@/actions/issueActions";

interface PageIssuesProps {
  issues: { [key: string | number]: IssueJoined[] };
  users: SelectUser[];
  labels: { ID: number; Name: string }[];
  statuses: { ID: number; Name: string }[];
}

/**
 * Example usage of tables with issues and drag&drop, with and without filters.
 */
function PageIssues({ issues, users, labels, statuses }: PageIssuesProps) {
  const [test, setTest] = useState(issues);

  return (
    <>
      {Object.keys(test).map((key) => (
        // <IssueTable
        //   key={key}
        //   issues={test[key]}
        //   onDropIssue={async (id, fromTable) => {
        //     if (key === fromTable) return;
        //     setTest((prev) => {
        //       prev[key] = [
        //         ...prev[key],
        //         prev[fromTable].find((issue) => issue.ID === id),
        //       ];
        //       prev[fromTable] = prev[fromTable].filter(
        //         (issue) => issue.ID !== id
        //       );
        //       return { ...prev };
        //     });
        //   }}
        //   tableName={key}
        // />
        <IssueTableFilters
          key={key}
          issues={test[key]}
          onDropIssue={async (id, fromTable) => {
            if (key === fromTable) return;
            setTest((prev) => {
              const foundItem = prev[fromTable].find(
                (issue) => issue.ID === id
              );
              if (!foundItem) return prev;
              prev[key] = [...prev[key], foundItem];
              prev[fromTable] = prev[fromTable].filter(
                (issue) => issue.ID !== id
              );
              return { ...prev };
            });
          }}
          tableName={key}
          usersOptions={users.map((item) => ({
            value: item.ID,
            label: item.Name,
          }))}
          statusOptions={statuses.map((item) => ({
            value: item.ID,
            label: item.Name,
          }))}
          labelOptions={labels.map((item) => ({
            value: item.ID,
            label: item.Name,
          }))}
        />
      ))}
    </>
  );
}

export default memo(PageIssues);
