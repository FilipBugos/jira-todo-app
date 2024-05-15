import Sidebar from '@/components/sidebar';

type RootLayoutProps = {
	children: React.ReactNode;
	params: {
		id: number;
	};
};

export default function RootLayout({ children, params }: RootLayoutProps) {
	return (
		<div className="flex flex-grow flex-col">
			<main className="flex flex-grow flex-col">
				<div className="flex flex-grow flex-row">
					<div className="flex w-2/12 flex-grow bg-indigo-50">
						<Sidebar projectId={params.id} />
					</div>
					<div className="h-full w-10/12 bg-gray-50">{children}</div>
				</div>
			</main>
		</div>
	);
}
