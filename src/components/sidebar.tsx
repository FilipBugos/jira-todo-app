'use-client';
import React from 'react';
import { PageLink } from './nav/page-link';

const Sidebar: React.FC = () => {
	return (
		<div className="h-full w-64 bg-gray-800 text-white">
			<div className="p-4">
				<h1 className="mb-6 text-2xl font-bold">Sidebar</h1>
				<PageLink href="./backlog">Backlog</PageLink>
				<PageLink href="./active-sprint"> Active sprint</PageLink>
				<PageLink href="./all-issues"> All issues</PageLink>
			</div>
		</div>
	);
};

export default Sidebar;
