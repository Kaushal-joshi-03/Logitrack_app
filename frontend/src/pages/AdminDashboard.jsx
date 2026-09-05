import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import { useAuth } from "../context/AuthContext";

const activity = [
  {
    id: "LT-10294",
    action: "Shipment created",
    user: "Client",
    location: "Delhi",
    time: "2 min ago",
  },
  {
    id: "PKG-10287",
    action: "Package dispatched",
    user: "Warehouse",
    location: "Ahmedabad",
    time: "8 min ago",
  },
  {
    id: "PKG-10281",
    action: "Delivery completed",
    user: "Delivery Agent",
    location: "Mumbai",
    time: "14 min ago",
  },
  {
    id: "USR-00482",
    action: "New user registered",
    user: "Client",
    location: "Jaipur",
    time: "21 min ago",
  },
];

function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= HEADER ================= */}
      <Navbar />


      {/* ================= MAIN ================= */}

      <main
        className="min-h-[calc(100vh-76px)] px-6 py-8 lg:px-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "38px 38px",
        }}
      >

        <div className="mx-auto max-w-[1500px]">


          {/* BACK */}

          <Link
            to="/"
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              text-sm
              text-slate-500
              transition
              hover:text-white
            "
          >
            <span className="text-xl">←</span>
            Back to Main Page
          </Link>


          {/* HEADING */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >

            <p className="mb-2 text-xs font-bold tracking-[0.3em] text-red-500">
              SYSTEM ADMINISTRATION
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Welcome Back{user?.name ? ` ${user.name}` : ""}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor users, shipments, network operations and system activity.
            </p>

          </motion.div>


          {/* ================= STATS ================= */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              number="1,284"
              title="TOTAL USERS"
              subtitle="Registered accounts"
            />

            <StatCard
              number="342"
              title="ACTIVE SHIPMENTS"
              subtitle="Currently processing"
            />

            <StatCard
              number="24"
              title="WAREHOUSES"
              subtitle="Connected locations"
            />

            <StatCard
              number="98.7%"
              title="SYSTEM UPTIME"
              subtitle="Last 30 days"
            />

          </div>


          {/* ================= CONTENT ================= */}

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">


            {/* SYSTEM ACTIVITY */}

            <section className="overflow-hidden border border-white/10 bg-[#090909]">

              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                    SYSTEM ACTIVITY
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Recent Activity
                  </h2>

                </div>

                <Link
                  to="/admin/shipments"
                  className="text-xs text-slate-500 transition hover:text-white"
                >
                  View All →
                </Link>

              </div>


              <div className="divide-y divide-white/10">

                {activity.map((item, index) => (

                  <motion.div
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex flex-col justify-between gap-4 px-6 py-5 md:flex-row md:items-center"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-9 w-9 items-center justify-center border border-red-500/20 bg-red-500/5 text-red-500">
                        ◇
                      </div>

                      <div>

                        <p className="text-sm font-semibold">
                          {item.action}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {item.id} · {item.user}
                        </p>

                      </div>

                    </div>


                    <div className="text-left md:text-right">

                      <p className="text-xs text-slate-400">
                        {item.location}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-600">
                        {item.time}
                      </p>

                    </div>

                  </motion.div>

                ))}

              </div>

            </section>


            {/* SYSTEM STATUS */}

            <section className="border border-white/10 bg-[#090909]">

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                  SYSTEM STATUS
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Infrastructure
                </h2>

              </div>


              <div className="space-y-4 p-6">

                <SystemStatus
                  name="API Server"
                  status="Operational"
                />

                <SystemStatus
                  name="MongoDB Database"
                  status="Operational"
                />

                <SystemStatus
                  name="Tracking Service"
                  status="Operational"
                />

                <SystemStatus
                  name="Notification Service"
                  status="Operational"
                />


                <div className="mt-5 border border-white/10 bg-black/30 p-5">

                  <p className="text-[10px] tracking-[0.2em] text-slate-600">
                    NETWORK LOAD
                  </p>

                  <div className="mt-4 h-2 overflow-hidden bg-white/5">

                    <div className="h-full w-[68%] bg-red-500" />

                  </div>

                  <div className="mt-2 flex justify-between">

                    <span className="text-[10px] text-slate-600">
                      CURRENT
                    </span>

                    <span className="text-[10px] text-slate-400">
                      68%
                    </span>

                  </div>

                </div>

              </div>

            </section>

          </div>


          {/* ================= ADMIN ACTIONS ================= */}

          <section className="mt-6">

            <h2 className="mb-4 text-sm font-semibold">
              Administration
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              <AdminAction
                title="Manage Users"
                text="View and manage registered users."
                to="/admin/users"
              />

              <AdminAction
                title="Shipments"
                text="Monitor all shipments across the network."
                to="/admin/shipments"
              />

              <AdminAction
                title="Network"
                text="Manage warehouses and distribution hubs."
                to="/admin/network"
              />

              <AdminAction
                title="Analytics"
                text="View logistics performance reports."
                to="/admin/analytics"
              />

            </div>

          </section>


          {/* ================= FOOTER STATUS ================= */}

          <div className="mt-6 flex flex-col justify-between gap-3 border border-white/10 bg-[#090909] px-5 py-4 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

              <span className="text-xs font-semibold text-green-400">
                ALL SYSTEMS OPERATIONAL
              </span>

            </div>

            <span className="text-[10px] text-slate-600">
              LOGITRACK ENTERPRISE · ADMIN CONSOLE
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}


/* ================= STAT CARD ================= */

function StatCard({ number, title, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="border border-white/10 bg-[#090909] p-6"
    >

      <div className="flex items-center justify-between">

        <p className="text-3xl font-bold">
          {number}
        </p>

        <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,29,47,0.7)]" />

      </div>

      <p className="mt-4 text-[10px] font-bold tracking-[0.15em] text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">
        {subtitle}
      </p>

    </motion.div>
  );
}


/* ================= SYSTEM STATUS ================= */

function SystemStatus({ name, status }) {
  return (
    <div className="flex items-center justify-between border border-white/5 bg-black/20 px-4 py-4">

      <div className="flex items-center gap-3">

        <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />

        <span className="text-sm text-slate-300">
          {name}
        </span>

      </div>

      <span className="text-[10px] font-semibold text-green-400">
        {status}
      </span>

    </div>
  );
}


/* ================= ADMIN ACTION ================= */

function AdminAction({ title, text, to }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -3 }}
        className="
          cursor-pointer
          border
          border-white/10
          bg-[#090909]
          p-5
          text-left
          transition
          hover:border-red-500/40
        "
      >
        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-sm font-semibold">
              {title}
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {text}
            </p>
          </div>

          <span className="text-lg text-red-500">
            →
          </span>

        </div>
      </motion.div>
    </Link>
  );
}

export default AdminDashboard;