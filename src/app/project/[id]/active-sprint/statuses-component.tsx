'use client';
import { memo, useState } from 'react';

import IssueFilter, {
	type FilterValues
} from '@/components/issues/issue-filters';
import IssueTableFiltered from '@/components/issues/issue-table-filtered';
import { type IssueJoined, updateIssue } from '@/actions/issueActions';

import { type InsertIssue, type SelectUser } from '../../../../db/schema';

type PageIssuesProps = {
	issues: { [key: string | number]: IssueJoined[] };
	users: SelectUser[];
	labels: { ID: number; Name: string }[];
	statuses: { ID: number; Name: string }[];
};

const PageIssues = ({ issues, users, labels, statuses }: PageIssuesProps) => {
	const [prevIssues, setPrevIssues] = useState(issues);
	const [localIssues, setLocalIssues] = useState(issues);
	const [filters, setFilters] = useState<FilterValues>({
		summaryFilter: '',
		descriptionFilter: '',
		createdByFilter: [],
		assignedToFilter: [],
		statusFilter: [],
		labelFilter: []
	});
	console.log('localIssues', localIssues);
	console.log('statuses', statuses);
	console.log('issuesByStatus', localIssues[statuses[0].Name]);

	const onDropUpdate = async (issue: InsertIssue) => {
		await updateIssue(issue);
	};

	return (
		<div className="m-4 w-full">
			<IssueFilter
				usersOptions={users.map(item => ({
					value: item.id,
					label: item.name
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
			<div className="ml-10 flex gap-5">
				{statuses.map(key => (
					<div className="w-1/5">
						<h1>Status: {key.Name}</h1>
						<IssueTableFiltered
							key={key.Name}
							issues={localIssues[key.Name] || []}
							onDropIssue={async (id, fromTable) => {
								if (key.Name === fromTable) return;
								setLocalIssues(prev => {
									const foundItem = prev[fromTable].find(
										issue => issue.ID === id
									);
									if (!foundItem) return prev;
									prev[key.Name] = prev[key.Name]
										? [...prev[key.Name], foundItem]
										: [foundItem];
									prev[fromTable] = prev[fromTable].filter(
										issue => issue.ID !== id
									);
									// Transform the foundItem to match the InsertIssue type
									const transformedIssue: InsertIssue = {
										ID: foundItem.ID,
										Summary: foundItem.Summary,
										Description: foundItem.Description,
										Status: key.Name, // new status
										CreatedTime: foundItem.CreatedTime,
										CreatedBy: foundItem.CreatedBy.id,
										AssignedTo: foundItem.AssignedTo?.id,
										Estimation: foundItem.Estimation,
										Label: foundItem.Label,
										SprintID: foundItem.Sprint?.ID,
										ProjectID: foundItem.ProjectID
									};

									// Call the updateIssue function with the transformed issue
									onDropUpdate(transformedIssue);
									return { ...prev };
								});
							}}
							tableName={key.Name}
							filters={filters}
							hiddenColumns={[
								'Sprint',
								'Status',
								'Description',
								'CreatedTime',
								'CreatedBy',
								'Estimation'
							]}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(PageIssues);
