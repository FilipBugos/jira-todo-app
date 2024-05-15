"use client";
import IssueFilter, { FilterValues } from "@/components/issues/issue-filters";
import IssueTableFiltered from "@/components/issues/issue-table-filtered";
import { memo, useState } from "react";
import { SelectUser } from "../../../../db/schema";
import { IssueJoined } from "@/actions/issueActions";

interface PageIssuesProps {
  issues: IssueJoined[];
  users: SelectUser[];
  labels: { ID: number; Name: string }[];
  statuses: { ID: number; Name: string }[];
}

type ProjectOverviewPageProps = {
  params: {
    id: number;
  };
};

function PageIssues({ issues, users, labels, statuses }: PageIssuesProps & ProjectOverviewPageProps) {
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
      <IssueTableFiltered filters={filters} issues={issues} />
    </div>
  );
}

export default memo(PageIssues);
