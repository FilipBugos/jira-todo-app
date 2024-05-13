"use client";
import IssueFilter, { FilterValues } from "@/components/issues/issue-filters";
import IssueTableFiltered from "@/components/issues/issue-table-filtered";
import { memo, useState } from "react";
import { SelectUser } from "../../../../db/schema";
import { IssueJoined } from "@/actions/issueActions";

interface PageIssuesProps {
  issues: { [key: string | number]: IssueJoined[] };
  users: SelectUser[];
  labels: { ID: number; Name: string }[];
  statuses: { ID: number; Name: string }[];
}

function PageIssues({ issues, users, labels, statuses }: PageIssuesProps) {
  const [localIssues, setLocalIssues] = useState(issues);
  const [filters, setFilters] = useState<FilterValues>({
    summaryFilter: "",
    descriptionFilter: "",
    createdByFilter: [],
    assignedToFilter: [],
    statusFilter: [],
    labelFilter: [],
  });

  return (
    <div className="w-full m-4">
      <IssueFilter
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
        onFilterChange={setFilters}
      />
      <div className="flex gap-5 ml-10">
        {Object.keys(localIssues).map((key) => (
          <div className="w-1/5">
            <h1>Status: {key}</h1>
            <IssueTableFiltered
              key={key}
              issues={localIssues[key]}
              onDropIssue={async (id, fromTable) => {
                if (key === fromTable) return;
                setLocalIssues((prev) => {
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
              filters={filters}
              hiddenColumns={[
                "Sprint",
                "Status",
                "Description",
                "CreatedTime",
                "CreatedBy",
                "Estimation",
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(PageIssues);
