'use client';
import { memo, useState } from 'react';

import IssueFilter, {
	type FilterValues
} from '@/components/issues/issue-filters';
import IssueTableFiltered from '@/components/issues/issue-table-filtered';
import { type IssueJoined } from '@/actions/issueActions';

import { type SelectUser } from '../../../../db/schema';

type PageIssuesProps = {
	issues: IssueJoined[];
	users: SelectUser[];
	labels: { ID: number; Name: string }[];
	statuses: { ID: number; Name: string }[];
};

type ProjectOverviewPageProps = {
	params: {
		id: number;
	};
};

const PageIssues = ({
	issues,
	users,
	labels,
	statuses
}: PageIssuesProps & ProjectOverviewPageProps) => {
	const [filters, setFilters] = useState<FilterValues>({
		summaryFilter: '',
		descriptionFilter: '',
		createdByFilter: [],
		assignedToFilter: [],
		statusFilter: [],
		labelFilter: []
	});

	return (
		<div className="m-4 ">
			<IssueFilter
				usersOptions={users.map(item => ({
					value: item.ID,
					label: item.Name
				}))}
				statusOptions={statuses.map(item => ({
					value: item.ID,
					label: item.Name
				}))}
				labelOptions={labels.map(item => ({
					value: item.ID,
					label: item.Name
				}))}
				onFilterChange={setFilters}
			/>
			<IssueTableFiltered filters={filters} issues={issues} />
		</div>
	);
};

export default memo(PageIssues);
