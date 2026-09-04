import { motion } from "framer-motion";
import Navbar from "../components/navigation/Navbar";
import { useAuth } from "../context/AuthContext";

const shipments = [
  {
    id: "PKG-10294",
    source: "Delhi",
    destination: "Mumbai",
    status: "IN TRANSIT",
    eta: "Today, 6:40 PM",
  },
  {
    id: "PKG-10287",
    source: "Ahmedabad",
    destination: "Pune",
    status: "READY",
    eta: "Tomorrow",
  },
  {
    id: "PKG-10281",
    source: "Delhi",
    destination: "Jaipur",
    status: "DELIVERED",
    eta: "Completed",
  },
  {
    id: "PKG-10276",
    source: "Mumbai",
    destination: "Udaipur",
    status: "IN TRANSIT",
    eta: "Tomorrow, 11:20 AM",
  },
];

function DistributorDashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= HEADER ================= */}
      <Navbar />


      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="mb-2 text-xs font-bold tracking-[0.3em] text-red-500">
            DISTRIBUTION CONTROL
          </p>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Welcome Back{user?.name ? ` ${user.name}` : ""}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage packages, routes and distribution operations.
              </p>
            </div>

            <button className="w-fit bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
              + Create Distribution
            </button>

          </div>
        </motion.div>


        {/* ================= STATS ================= */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            number="128"
            title="ACTIVE SHIPMENTS"
            subtitle="Currently moving"
          />

          <StatCard
            number="24"
            title="READY TO DISPATCH"
            subtitle="Awaiting distribution"
          />

          <StatCard
            number="96.8%"
            title="DELIVERY SUCCESS"
            subtitle="This month"
          />

          <StatCard
            number="18"
            title="ACTIVE ROUTES"
            subtitle="Across network"
          />

        </div>


        {/* ================= CONTENT GRID ================= */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">


          {/* ================= SHIPMENTS ================= */}
          <section className="border border-white/10 bg-[#090909]">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>
                <h2 className="font-semibold">
                  Distribution Queue
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Packages assigned to your distribution network
                </p>
              </div>

              <button className="text-xs text-red-500 hover:text-red-400">
                View All →
              </button>

            </div>


            <div className="divide-y divide-white/10">

              {shipments.map((shipment, index) => (

                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_1.5fr_120px_150px] md:items-center"
                >

                  {/* ID */}
                  <div>
                    <p className="text-sm font-semibold">
                      {shipment.id}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Package
                    </p>
                  </div>


                  {/* Route */}
                  <div className="flex items-center gap-3">

                    <span className="text-sm text-slate-300">
                      {shipment.source}
                    </span>

                    <span className="text-red-500">
                      →
                    </span>

                    <span className="text-sm text-slate-300">
                      {shipment.destination}
                    </span>

                  </div>


                  {/* Status */}
                  <div>

                    <span
                      className={`inline-flex px-3 py-1 text-[10px] font-bold tracking-wide ${shipment.status === "DELIVERED"
                          ? "bg-green-500/10 text-green-400"
                          : shipment.status === "READY"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                    >
                      {shipment.status}
                    </span>

                  </div>


                  {/* ETA */}
                  <div className="text-left md:text-right">

                    <p className="text-xs text-slate-500">
                      ETA
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      {shipment.eta}
                    </p>

                  </div>

                </motion.div>

              ))}

            </div>

          </section>


          {/* ================= ROUTE CONTROL ================= */}
          <section className="border border-white/10 bg-[#090909]">

            <div className="border-b border-white/10 px-6 py-5">

              <h2 className="font-semibold">
                Route Control
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Distribution network status
              </p>

            </div>


            <div className="p-6">

              {/* Route */}
              <div className="relative mb-8">

                <div className="absolute left-[9px] top-5 h-[calc(100%-40px)] w-px bg-red-500/30" />

                <RoutePoint
                  city="Delhi"
                  type="SOURCE WAREHOUSE"
                  active
                />

                <RoutePoint
                  city="Ahmedabad"
                  type="DISTRIBUTION HUB"
                  active
                />

                <RoutePoint
                  city="Mumbai"
                  type="DELIVERY NETWORK"
                  active
                />

              </div>


              {/* Live telemetry */}
              <div className="border border-white/10 bg-black/30 p-4">

                <div className="mb-3 flex items-center justify-between">

                  <span className="text-xs text-slate-500">
                    LIVE TELEMETRY
                  </span>

                  <span className="flex items-center gap-2 text-xs text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    ONLINE
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-lg font-bold">42</p>
                    <p className="text-[10px] text-slate-600">
                      VEHICLES ACTIVE
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-bold">7</p>
                    <p className="text-[10px] text-slate-600">
                      ROUTES RUNNING
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>


        {/* ================= QUICK ACTIONS ================= */}
        <section className="mt-6">

          <h2 className="mb-4 text-sm font-semibold">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <QuickAction
              title="Assign Package"
              text="Assign shipments to a distribution route."
            />

            <QuickAction
              title="Manage Routes"
              text="View and manage your active delivery routes."
            />

            <QuickAction
              title="Track Shipments"
              text="Monitor packages currently in transit."
            />

          </div>

        </section>

      </main>

    </div>
  );
}


/* ================= COMPONENTS ================= */

function StatCard({ number, title, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="border border-white/10 bg-[#090909] p-5"
    >
      <p className="text-3xl font-bold text-white">
        {number}
      </p>

      <p className="mt-2 text-xs font-bold tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">
        {subtitle}
      </p>
    </motion.div>
  );
}


function RoutePoint({ city, type, active }) {
  return (
    <div className="relative mb-7 flex items-center gap-4">

      <div
        className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border ${active
            ? "border-red-500 bg-[#090909]"
            : "border-slate-700"
          }`}
      >
        {active && (
          <div className="h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>

      <div>
        <p className="text-sm font-semibold">
          {city}
        </p>

        <p className="mt-1 text-[10px] tracking-wide text-slate-600">
          {type}
        </p>
      </div>

    </div>
  );
}


function QuickAction({ title, text }) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      className="border border-white/10 bg-[#090909] p-5 text-left transition hover:border-red-500/40"
    >

      <div className="mb-4 flex h-9 w-9 items-center justify-center border border-red-500/30 text-red-500">
        ◇
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>

      <p className="mt-4 text-xs text-red-500">
        Open →
      </p>

    </motion.button>
  );
}

export default DistributorDashboard;