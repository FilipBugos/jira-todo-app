'use client';
import { type DropTargetMonitor, useDrop } from 'react-dnd';
import { useRef } from 'react';

import { type IssueJoined } from '@/actions/issueActions';

import IssueComponent, { type HiddenColumnsType } from './issue-component';

type IssueTableProps = {
	issues: IssueJoined[];
	onDropIssue?: (id: number, toTable: string) => void;
	tableName?: string;
	hiddenColumns?: HiddenColumnsType[];
};

/**
 *
 * @param issues - issues to be displayed
 * @param onDropIssue - function to be called when issue is dropped inside of this table
 * @param tableName - name of the table, used for drag&drop
 * @returns
 */
const IssueTable: React.FC<IssueTableProps> = ({
	issues,
	onDropIssue,
	tableName,
	hiddenColumns
}) => {
	const ref = useRef<HTMLDivElement>(null);

	const [, drop] = useDrop({
		accept: 'issue',
		drop: (
			item: { id: number; fromTableName: string },
			monitor: DropTargetMonitor
		) => {
			if (monitor.didDrop() || !onDropIssue) {
				return;
			}
			onDropIssue(item.id, item.fromTableName);
		}
	});

	drop(ref);

	return (
		<div
			ref={ref}
			className="my-2 rounded-lg border border-gray-300  bg-gray-100 p-4 shadow"
		>
			{issues.length === 0 && (
				<p className="text-center text-gray-500">No issues</p>
			)}
			{issues.map(issue => (
				<IssueComponent
					key={issue.ID}
					issue={issue}
					tableName={tableName}
					hiddenColumns={hiddenColumns}
				/>
			))}
		</div>
	);
};

export default IssueTable;
