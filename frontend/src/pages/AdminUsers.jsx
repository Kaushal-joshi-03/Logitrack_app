import { Link } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";

const users = [
  {
    name: "Rahul Sharma",
    email: "rahul@company.com",
    role: "CLIENT",
    status: "ACTIVE",
  },
  {
    name: "Amit Verma",
    email: "amit@logitrack.com",
    role: "WAREHOUSE",
    status: "ACTIVE",
  },
  {
    name: "Priya Singh",
    email: "priya@distribution.com",
    role: "DISTRIBUTOR",
    status: "ACTIVE",
  },
  {
    name: "Neha Gupta",
    email: "neha@logitrack.com",
    role: "DELIVERY",
    status: "ACTIVE",
  },
];

function AdminUsers() {
  return (
    <AdminLayout
      title="User Management"
      subtitle="Manage all registered LogiTrack users."
    >

      <div className="border border-white/10 bg-[#090909]">

        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-bold tracking-[0.2em] text-red-500">
            USERS
          </p>

          <h2 className="mt-1 text-lg font-semibold">
            Registered Users
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-6 py-4 text-[10px] text-slate-600">
                  USER
                </th>

                <th className="px-6 py-4 text-[10px] text-slate-600">
                  EMAIL
                </th>

                <th className="px-6 py-4 text-[10px] text-slate-600">
                  ROLE
                </th>

                <th className="px-6 py-4 text-[10px] text-slate-600">
                  STATUS
                </th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (
                <tr
                  key={user.email}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >

                  <td className="px-6 py-5 text-sm font-semibold">
                    {user.name}
                  </td>

                  <td className="px-6 py-5 text-xs text-slate-500">
                    {user.email}
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold text-red-400">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold text-green-400">
                      ● {user.status}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>
  );
}

function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="px-6 py-8 lg:px-10">

        <div className="mx-auto max-w-[1500px]">

          <Link
            to="/admin"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"
          >
            ← Back to Admin
          </Link>

          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {subtitle}
          </p>

          <div className="mt-8">
            {children}
          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminUsers;