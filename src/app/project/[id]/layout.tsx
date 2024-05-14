import Sidebar from '@/components/sidebar';

type RootLayoutProps = {
	children: React.ReactNode;
	params: {
		id: number;
	};
};

export default function RootLayout({ children, params }: RootLayoutProps) {
	return (
		<div className="flex min-h-screen min-w-full flex-col">
			<main className="container mx-auto  max-w-screen-2xl">
				<div className="grid h-screen grid-cols-12">
					<div className="col-span-2 bg-indigo-50">
						<Sidebar projectId={params.id} />
					</div>
					<div className="col-span-10 bg-gray-50">{children}</div>
				</div>
			</main>
		</div>
	);
}
