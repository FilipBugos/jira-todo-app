"use client";

import { IssueJoined } from "@/actions/issueActions";
import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import IssueFilter, { FilterValues, SelectOption } from "./issue-filters";
import IssueTable from "./issue-table";

interface IssueTableFiltersProps {
  issues: IssueJoined[];
  onDropIssue: (id: number, toTable: string) => void;
  tableName: string;
  usersOptions: SelectOption[];
  statusOptions: SelectOption[];
  labelOptions: SelectOption[];
}

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
function IssueTableFilters({
  issues,
  onDropIssue,
  tableName,
  usersOptions,
  statusOptions,
  labelOptions,
}: IssueTableFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    summaryFilter: "",
    descriptionFilter: "",
    createdByFilter: [],
    assignedToFilter: [],
    statusFilter: [],
    labelFilter: [],
  });

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      return (
        issue.Summary.toLowerCase().includes(
          filters.summaryFilter.toLowerCase()
        ) &&
        issue.Description?.toLowerCase()?.includes(
          filters.descriptionFilter.toLowerCase()
        ) &&
        (filters.createdByFilter.length === 0 ||
          filters.createdByFilter.some(
            (opt) => opt.value === issue.CreatedBy?.ID
          )) &&
        (filters.assignedToFilter.length === 0 ||
          filters.assignedToFilter.some(
            (opt) => opt.value === issue.AssignedTo?.ID
          )) &&
        (filters.statusFilter.length === 0 ||
          filters.statusFilter.some(
            // TODO: remove parseInt
            (opt) => opt.value === parseInt(issue.Status ?? "")
          )) &&
        (filters.labelFilter.length === 0 ||
          filters.labelFilter.some((opt) => opt.value === issue.Label))
      );
    });
  }, [issues, filters]);

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
      />
    </div>
  );
}

export default memo(IssueTableFilters);
