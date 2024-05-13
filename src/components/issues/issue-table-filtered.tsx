'use client';

import { IssueJoined } from '@/actions/issueActions';
import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import IssueFilter, { FilterValues, SelectOption } from './issue-filters';
import IssueTable from './issue-table';
import { HiddenColumnsType } from './issue-component';

interface IssueTableFiltersProps {
	issues: IssueJoined[];
	onDropIssue?: (id: number, toTable: string) => void;
	tableName?: string;
	hiddenColumns?: HiddenColumnsType[];
	filters: FilterValues;
}

/**
 * @description Wrapper around table component with filters
 * @param issues - issues to be displayed
 * @param onDropIssue - function to be called when issue is dropped inside of this table
 * @param tableName - name of the table, used for drag&drop
 *
 */
function IssueTableFiltered({
	issues,
	onDropIssue,
	tableName,
	hiddenColumns,
	filters
}: IssueTableFiltersProps) {
	const filteredIssues = useMemo(() => {
		return issues.filter(issue => {
			return (
				issue.Summary.toLowerCase().includes(
					filters.summaryFilter.toLowerCase()
				) &&
				issue.Description?.toLowerCase()?.includes(
					filters.descriptionFilter.toLowerCase()
				) &&
				(filters.createdByFilter.length === 0 ||
					filters.createdByFilter.some(
						opt => opt.value === issue.CreatedBy?.id
					)) &&
				(filters.assignedToFilter.length === 0 ||
					filters.assignedToFilter.some(
						opt => opt.value === issue.AssignedTo?.id
					)) &&
				(filters.statusFilter.length === 0 ||
					filters.statusFilter.some(
						// TODO: remove parseInt
						opt => opt.value === parseInt(issue.Status ?? '')
					)) &&
				(filters.labelFilter.length === 0 ||
					filters.labelFilter.some(opt => opt.value === issue.Label))
			);
		});
	}, [issues, filters]);

	return (
		<div>
			<IssueTable
				issues={filteredIssues}
				onDropIssue={onDropIssue}
				tableName={tableName}
				hiddenColumns={hiddenColumns}
			/>
		</div>
	);
}

export default memo(IssueTableFiltered);
