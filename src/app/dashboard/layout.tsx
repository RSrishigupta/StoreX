import Sidebar from "@/Component/Sidebar/Sidebar";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1}}>{children}</main>
    </div>
  );
}
