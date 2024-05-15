import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import TopNavBar from '@/components/nav/top-nav-bar';

import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {


	return (
		<html lang="en">
			<body className={inter.className}>
				<TopNavBar isUserLoggedIn={false} />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	title: 'Jira Todo App',
	description: 'Jira Clone',
	keywords: 'Jira, Clone, Todo',
	authors: [{ name: 'Martin Pokorny' }, { name: 'Filip Bugos' }, { name: 'Vitek Hnatovskyj' }, { name: 'David Valecky' } ]
};
