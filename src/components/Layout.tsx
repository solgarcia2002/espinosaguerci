import  AdminSidebar  from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar  />
      <main className="flex-1 min-h-screen bg-white">{children}</main>
    </div>
  );
}