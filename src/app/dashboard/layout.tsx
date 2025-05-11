import SidebarWrapper from "@/Component/Sidebar/SidebarWrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <SidebarWrapper />
      <main style={{ flexGrow: 1, padding: 24 }}>{children}</main>
    </div>
  );
}
