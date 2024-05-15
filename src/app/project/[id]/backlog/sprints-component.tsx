'use client';

import { memo, useState } from 'react';

import { type IssueJoined, updateIssue } from '@/actions/issueActions';
import IssueFilter, {
	type FilterValues
} from '@/components/issues/issue-filters';
import IssueTableFiltered from '@/components/issues/issue-table-filtered';

import { type InsertIssue, type SelectUser } from '../../../../../db/schema';
import { endSprint } from '@/actions/sprintActions';

type PageIssuesProps = {
	issues: { [key: string | number]: IssueJoined[] };
	users: SelectUser[];
	labels: { ID: number; Name: string }[];
	statuses: { ID: number; Name: string }[];
	activeSprint?: number;
	onSprintEndClick?: () => void;
};

/**
 * Example usage of tables with issues and drag&drop, with and without filters.
 */
const PageIssues = ({
	issues,
	users,
	labels,
	statuses,
	activeSprint
}: PageIssuesProps) => {
	const [localIssues, setLocalIssues] = useState(issues);
	const [filters, setFilters] = useState<FilterValues>({
		summaryFilter: '',
		descriptionFilter: '',
		createdByFilter: [],
		assignedToFilter: [],
		statusFilter: [],
		labelFilter: []
	});

	const onDropUpdate = async (issue: InsertIssue) => {
		await updateIssue(issue);
	};

	return (
		<div className="m-4">
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
				<div className="w-8/12">
					{Object.keys(localIssues)
						.filter(key => key !== 'none')
						.sort((a, b) => parseInt(b) - parseInt(a))
						.map(key => (
							<div key={key}>
								<div className="flex flex-row items-center">
									<h1>Sprint: {key}</h1>
									{activeSprint === parseInt(key) && (
										<button
											className="mx-5 rounded-md bg-blue-500 px-4 py-2 text-white"
											onClick={async () => {
												await endSprint(parseInt(key));
											}}
										>
											End sprint
										</button>
									)}
								</div>
								<IssueTableFiltered
									key={key}
									issues={localIssues[key] || []}
									onDropIssue={async (id, fromTable) => {
										if (key === fromTable) return;
										setLocalIssues(prev => {
											const foundItem = prev[fromTable].find(
												issue => issue.ID === id
											);
											if (!foundItem) return prev;
											prev[key] = [...prev[key], foundItem];
											prev[fromTable] = prev[fromTable].filter(
												issue => issue.ID !== id
											);
											// Transform the foundItem to match the InsertIssue type
											const transformedIssue: InsertIssue = {
												ID: foundItem.ID,
												Summary: foundItem.Summary,
												Description: foundItem.Description,
												Status: foundItem.Status,
												CreatedTime: foundItem.CreatedTime,
												CreatedBy: foundItem.CreatedBy.id,
												AssignedTo: foundItem.AssignedTo?.id,
												Estimation: foundItem.Estimation,
												Label: foundItem.Label,
												SprintID: key,
												ProjectID: foundItem.ProjectID
											};

											onDropUpdate(transformedIssue);
											return { ...prev };
										});
									}}
									tableName={key}
									filters={filters}
									hiddenColumns={['Sprint', 'Status', 'Description']}
								/>
							</div>
						))}
				</div>

				<div className="w-4/12">
					<h1>Backlog</h1>
					{Object.keys(localIssues)
						.filter(key => key === 'none')
						.map(key => (
							<IssueTableFiltered
								key={key}
								issues={localIssues[key] || []}
								onDropIssue={async (id, fromTable) => {
									if (key === fromTable) return;
									setLocalIssues(prev => {
										const foundItem = prev[fromTable].find(
											issue => issue.ID === id
										);
										if (!foundItem) return prev;
										prev[key] = [...prev[key], foundItem];
										prev[fromTable] = prev[fromTable].filter(
											issue => issue.ID !== id
										);
										const transformedIssue: InsertIssue = {
											ID: foundItem.ID,
											Summary: foundItem.Summary,
											Description: foundItem.Description,
											Status: foundItem.Status,
											CreatedTime: foundItem.CreatedTime,
											CreatedBy: foundItem.CreatedBy.id,
											AssignedTo: foundItem.AssignedTo?.id,
											Estimation: foundItem.Estimation,
											Label: foundItem.Label,
											SprintID: null,
											ProjectID: foundItem.ProjectID
										};

										onDropUpdate(transformedIssue);
										return { ...prev };
									});
								}}
								tableName={key}
								filters={filters}
								hiddenColumns={['Sprint', 'Status', 'Description']}
							/>
						))}
				</div>
			</div>
		</div>
	);
};

export default memo(PageIssues);
