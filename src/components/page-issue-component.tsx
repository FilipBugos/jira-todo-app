"use client";

import { memo, useState } from "react";

import { type IssueJoined } from "@/actions/issueActions";

import { type SelectUser } from "../../db/schema";

import IssueTableFilters from "./issue-table-filters";

type PageIssuesProps = {
  issues: { [key: string | number]: IssueJoined[] };
  users: SelectUser[];
  labels: { ID: number; Name: string }[];
  statuses: { ID: number; Name: string }[];
};

/**
 * Example usage of tables with issues and drag&drop, with and without filters.
 */
const PageIssues = ({ issues, users, labels, statuses }: PageIssuesProps) => {
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
                (issue) => issue.ID === id,
              );
              if (!foundItem) return prev;
              prev[key] = [...prev[key], foundItem];
              prev[fromTable] = prev[fromTable].filter(
                (issue) => issue.ID !== id,
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
          hiddenColumns={["Sprint", "Status"]}
        />
      ))}
    </>
  );
};

export default memo(PageIssues);
