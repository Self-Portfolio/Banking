import Sidebar from './Sidebar.jsx';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">{children}</main>
    </div>
  );
}
