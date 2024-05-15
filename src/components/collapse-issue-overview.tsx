'use client';
import { IssueJoined } from '@/actions/issueActions';
import { memo, useState } from 'react';
import IssueComponent from './issues/issue-component';
import caretDownFill from '@iconify/icons-bi/caret-down-fill';
import caretRightFill from '@iconify/icons-bi/caret-right-fill';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface IssuesOverviewProps {
	issues: IssueJoined[];
}

function CollapseIssuesOverview({ issues }: IssuesOverviewProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div>
			<button onClick={() => setIsCollapsed(!isCollapsed)}>
				<Icon icon={isCollapsed ? caretRightFill : caretDownFill} />
			</button>
			{!isCollapsed &&
				issues.map(issue => (
					<Link href={`/issue/${issue.ID}`}>
						<div key={issue.ID}>
							<IssueComponent issue={issue} />
						</div>
					</Link>
				))}
		</div>
	);
}

export default memo(CollapseIssuesOverview);
