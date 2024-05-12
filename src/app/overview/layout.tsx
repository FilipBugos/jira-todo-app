import Sidebar from "@/components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <div className="h-screen">
        <Sidebar />
      </div>
      {children}
    </div>
  );
}
