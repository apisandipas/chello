import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import {
  Calculator,
  HelpCircle,
  HomeIcon,
  Users,
  UsersIcon,
  LogOut,
} from "lucide-react";
import Logo from "~/components/icons/logo";
import { SessionUser } from "~/lib/utils/use-app-session";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: ({ context }: { context: { user?: SessionUser | null } }) => {
    console.log("[Admin] Context:", context.user);
    if (!context.user || context.user.role !== "SUPER_ADMIN") {
      throw redirect({
        to: "/auth/login",
        statusCode: 301,
      });
    }
    return {
      user: context.user,
    };
  },
});

function RouteComponent() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-cyan-800 text-white">
        <div className="p-4 flex items-center justify-center gap-2">
          <Logo fill="#ffffff" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Chello Admin</h1>
        </div>

        <nav className="flex flex-col h-[calc(100%-theme(space.16))]">
          <div className="flex flex-col px-4 space-y-2">
            <Link
              to="/admin"
              activeOptions={{ exact: true }}
              className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
              activeProps={{ className: "bg-cyan-900" }}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/users"
              search={{ page: 1, pageSize: 5 }}
              className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
              activeProps={{ className: "bg-cyan-900" }}
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
            </Link>

            <Link
              to="/admin/teams"
              search={{ page: 1, pageSize: 5 }}
              className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
              activeProps={{ className: "bg-cyan-900" }}
            >
              <UsersIcon className="w-5 h-5" />
              <span>Teams</span>
            </Link>

            <Link
              to="/admin/accounting"
              className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
              activeProps={{ className: "bg-cyan-900" }}
            >
              <Calculator className="w-5 h-5" />
              <span>Accounting</span>
            </Link>

            <Link
              to="/admin/support"
              className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
              activeProps={{ className: "bg-cyan-900" }}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Support</span>
            </Link>
          </div>

          <div className="mt-auto px-4 mb-4">
            <Link
              to="/auth/logout"
              className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
