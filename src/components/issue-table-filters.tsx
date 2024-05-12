"use client";

import React, { memo, useMemo, useState } from "react";

import { type IssueJoined } from "@/actions/issueActions";

import IssueFilter, {
  type FilterValues,
  type SelectOption,
} from "./issue-filters";
import IssueTable from "./issue-table";
import { type HiddenColumnsType } from "./issue-component";

type IssueTableFiltersProps = {
  issues: IssueJoined[];
  onDropIssue: (id: number, toTable: string) => void;
  tableName: string;
  usersOptions: SelectOption[];
  statusOptions: SelectOption[];
  labelOptions: SelectOption[];
  hiddenColumns?: HiddenColumnsType[];
};

/**
 * @description Wrapper around table component with filters
 * @param issues - issues to be displayed
 * @param onDropIssue - function to be called when issue is dropped inside of this table
 * @param tableName - name of the table, used for drag&drop
 * @param usersOptions - user options
 * @param statusOptions - status options
 * @param labelOptions - label options
 *
 */
const IssueTableFilters = ({
  issues,
  onDropIssue,
  tableName,
  usersOptions,
  statusOptions,
  labelOptions,
  hiddenColumns,
}: IssueTableFiltersProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    summaryFilter: "",
    descriptionFilter: "",
    createdByFilter: [],
    assignedToFilter: [],
    statusFilter: [],
    labelFilter: [],
  });

  const filteredIssues = useMemo(
    () =>
      issues.filter(
        (issue) =>
          issue.Summary.toLowerCase().includes(
            filters.summaryFilter.toLowerCase(),
          ) &&
          issue.Description?.toLowerCase()?.includes(
            filters.descriptionFilter.toLowerCase(),
          ) &&
          (filters.createdByFilter.length === 0 ||
            filters.createdByFilter.some(
              (opt) => opt.value === issue.CreatedBy?.id,
            )) &&
          (filters.assignedToFilter.length === 0 ||
            filters.assignedToFilter.some(
              (opt) => opt.value === issue.AssignedTo?.id,
            )) &&
          (filters.statusFilter.length === 0 ||
            filters.statusFilter.some(
              // TODO: remove parseInt
              (opt) => opt.value === parseInt(issue.Status ?? ""),
            )) &&
          (filters.labelFilter.length === 0 ||
            filters.labelFilter.some((opt) => opt.value === issue.Label))
      ),
    [issues, filters]
  );

  return (
    <div>
      <IssueFilter
        onFilterChange={setFilters}
        labelOptions={labelOptions}
        usersOptions={usersOptions}
        statusOptions={statusOptions}
      />
      <IssueTable
        issues={filteredIssues}
        onDropIssue={onDropIssue}
        tableName={tableName}
        hiddenColumns={hiddenColumns}
      />
    </div>
  );
};

export default memo(IssueTableFilters);
