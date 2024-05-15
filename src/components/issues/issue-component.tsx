'use client';
import React, { memo, useRef } from 'react';
import { type DragSourceMonitor, useDrag } from 'react-dnd';

import { type IssueJoined } from '@/actions/issueActions';
import { convertLabelIdToLabelName } from '@/lib/utils';

type IssueProps = {
	issue: IssueJoined;
	tableName?: string;
	hiddenColumns?: HiddenColumnsType[];
};

type DragAndDropItem = {
	id: number;
	fromTableName?: string;
};

type DragAndDropItemCollectType = {
	isDragging: boolean;
};

/**
 * @description
 * Issue component that displays the issue in a table. Table name is needed to know where the issue is coming from.
 *
 * @param issue - issue to be displayed
 * @param tableName - name of table this issue is in.
 * @returns
 */

const hiddenColums = [
	'ID',
	'Description',
	'Summary',
	'Status',
	'CreatedTime',
	'CreatedBy',
	'AssignedTo',
	'Estimation',
	'Label',
	'Sprint'
] as const;

type HiddenColumnsType = (typeof hiddenColums)[number];

const IssueComponent: React.FC<IssueProps> = ({
	issue,
	tableName,
	hiddenColumns = []
}) => {
	const ref = useRef<HTMLDivElement>(null);

	const [{ isDragging }, drag] = useDrag<
		DragAndDropItem,
		unknown,
		DragAndDropItemCollectType
	>({
		type: 'issue',
		item: {
			id: issue.ID,
			fromTableName: tableName
		},
		collect: (monitor: DragSourceMonitor) => ({
			isDragging: !!monitor.isDragging()
		})
	});

	drag(ref);
	return (
		<div
			className={`mb-4 flex flex-row items-center rounded-lg bg-white p-4 shadow-lg ${
				isDragging ? 'bg-gray-200' : ''
			}`}
			ref={ref}
		>
			{!hiddenColumns.includes('ID') && (
				<div className="w-1/20 flex-shrink-0 flex-grow-0 items-center justify-center border-r border-black px-1">
					{issue.ID}
				</div>
			)}
			{!hiddenColumns.includes('Description') && (
				<div className="w-7/12 flex-shrink flex-grow items-center justify-center overflow-hidden border-r border-black px-1">
					{issue.Description}
				</div>
			)}
			{!hiddenColumns.includes('Summary') && (
				<div className="w-2/10 flex-grow items-center justify-center border-r border-black px-1">
					{issue.Summary}
				</div>
			)}
			{!hiddenColumns.includes('Status') && (
				<div className="w-1/10 flex-shrink-0 flex-grow-0 items-center justify-center border-r border-black px-1">
					<span
						className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${statusColor(
							issue.Status
						)}`}
					>
						{issue.Status}
					</span>
				</div>
			)}
			{!hiddenColumns.includes('CreatedTime') && (
				<div className="w-1/10 flex-shrink-0 flex-grow-0 items-center justify-center border-r border-black px-1">
					Created at: {issue.CreatedTime?.toLocaleDateString()}
				</div>
			)}
			{!hiddenColumns.includes('CreatedBy') && (
				<div className="w-1/10 flex-shrink-0 flex-grow-0 items-center justify-center border-r border-black px-1">
					Author: {issue.CreatedBy?.name}
				</div>
			)}
			{!hiddenColumns.includes('AssignedTo') && (
				<div className="w-1/10 flex-shrink-0 flex-grow-0 items-center justify-center border-r border-black px-1">
					Assignee: {issue.AssignedTo?.name}
				</div>
			)}
			{!hiddenColumns.includes('Estimation') && (
				<div className="w-1/10 flex-shrink-0 flex-grow-0 items-center justify-center border-r border-black px-1">
					Estimate: {issue.Estimation ? `${issue.Estimation}h` : ''}
				</div>
			)}
			{!hiddenColumns.includes('Sprint') && (
				<div className="w-1/10 flex-shrink-0 flex-grow-0 items-center justify-center border-r border-black px-1">
					Sprint: {issue.Sprint?.Name ?? 'None'}
				</div>
			)}
			{!hiddenColumns.includes('Label') && (
				<div className="w-1/10 flex-shrink-0 flex-grow-0 items-center justify-center px-1">
					{convertLabelIdToLabelName(issue.Label)}
				</div>
			)}
		</div>
	);
};

// TODO: statuses
function statusColor(status: string | null) {
	switch (status) {
		case 'Open':
			return 'bg-red-100 text-red-800';
		case 'In progress':
			return 'bg-yellow-100 text-yellow-800';
		case 'Done':
			return 'bg-green-100 text-green-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
}

export default memo(IssueComponent);
export { type HiddenColumnsType };
