import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import { useAuth } from "../../context/AuthContext";

function ClientDashboard() {
  const { user } = useAuth();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const stats = [
    {
      title: "TOTAL SHIPMENTS",
      value: "128",
      subtitle: "All shipments",
    },
    {
      title: "IN TRANSIT",
      value: "24",
      subtitle: "Currently moving",
    },
    {
      title: "DELIVERED",
      value: "96",
      subtitle: "Successfully delivered",
    },
    {
      title: "PENDING",
      value: "08",
      subtitle: "Awaiting dispatch",
    },
  ];

  const shipments = [
    {
      id: "LT-10294",
      destination: "Mumbai",
      status: "In Transit",
      date: "27 Aug 2026",
    },
    {
      id: "LT-10291",
      destination: "Delhi",
      status: "Delivered",
      date: "26 Aug 2026",
    },
    {
      id: "LT-10287",
      destination: "Ahmedabad",
      status: "Pending",
      date: "25 Aug 2026",
    },
    {
      id: "LT-10281",
      destination: "Jaipur",
      status: "Delivered",
      date: "24 Aug 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* NAVBAR */}
      <Navbar showLogout={true} />

      <main
        className="
          min-h-[calc(100vh-76px)]
          bg-[#050505]
          px-6
          py-8
          lg:px-12
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "38px 38px",
        }}
      >

        <div className="mx-auto max-w-[1500px]">

          {/* BACK TO MAIN PAGE */}
          <Link
            to="/"
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition
              hover:text-white
            "
          >
            <span className="text-xl">←</span>
            <span>Back to Main Page</span>
          </Link>


          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="mb-2 text-xs font-bold tracking-[0.3em] text-red-500">
                CLIENT PORTAL
              </p>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Welcome Back{user?.name ? ` ${user.name}` : ""}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage your shipments and monitor your logistics operations.
              </p>

            </div>


            {/* ACTION BUTTONS */}
            <div className="flex gap-3">

              <Link
                to="/tracking"
                className="
                  border
                  border-white/10
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-slate-300
                  transition
                  hover:border-red-500/50
                  hover:text-white
                "
              >
                Track Shipment →
              </Link>

              <Link
                to="/client/create-shipment"
                className="
    bg-red-500
    px-5
    py-3
    text-sm
    font-bold
    text-white
    shadow-[0_10px_35px_rgba(239,29,47,0.18)]
    transition
    hover:bg-red-600
  "
              >
                + Create Shipment
              </Link>

            </div>

          </div>


          {/* STATS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {stats.map((stat, index) => (

              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                }}
                className="
                  border
                  border-white/10
                  bg-[#090909]
                  p-6
                  transition
                  hover:border-red-500/30
                "
              >

                <div className="mb-5 flex items-center justify-between">

                  <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500">
                    {stat.title}
                  </span>

                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-red-500
                      shadow-[0_0_10px_rgba(239,29,47,0.7)]
                    "
                  />

                </div>

                <div className="text-3xl font-bold">
                  {stat.value}
                </div>

                <p className="mt-2 text-xs text-slate-600">
                  {stat.subtitle}
                </p>

              </motion.div>

            ))}

          </div>


          {/* MAIN CONTENT */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">


            {/* RECENT SHIPMENTS */}
            <section
              className="
                overflow-hidden
                border
                border-white/10
                bg-[#090909]
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-white/10
                  px-6
                  py-5
                "
              >

                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                    ACTIVITY
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Recent Shipments
                  </h2>

                </div>

                <Link
                  to="/client/shipments"
                  className="text-xs text-slate-500 transition hover:text-white"
                >
                  View All →
                </Link>

              </div>


              <div className="overflow-x-auto">

                <table className="w-full min-w-[650px]">

                  <thead>

                    <tr className="border-b border-white/5 text-left">

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        SHIPMENT ID
                      </th>

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        DESTINATION
                      </th>

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        STATUS
                      </th>

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        DATE
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {shipments.map((shipment) => (

                      <tr
                        key={shipment.id}
                        className="
                          border-b
                          border-white/5
                          transition
                          hover:bg-white/[0.02]
                        "
                      >

                        <td className="px-6 py-5 text-sm font-semibold">
                          {shipment.id}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {shipment.destination}
                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-2
                              text-xs
                              ${shipment.status === "Delivered"
                                ? "text-emerald-400"
                                : shipment.status === "In Transit"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                              }
                            `}
                          >

                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {shipment.status}

                          </span>

                        </td>

                        <td className="px-6 py-5 text-xs text-slate-600">
                          {shipment.date}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </section>


            {/* QUICK ACTIONS */}
            <section className="border border-white/10 bg-[#090909]">

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                  QUICK ACTIONS
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Logistics Control
                </h2>

              </div>


              <div className="space-y-3 p-5">

                {/* CREATE SHIPMENT */}
                <Link
                  to="/client/create-shipment"
                  className="
                    group
                    block
                    w-full
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                    text-left
                    transition
                    hover:border-red-500/40
                    hover:bg-red-500/[0.04]
                  "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        Create Shipment
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Register a new shipment
                      </p>
                    </div>
                    <span className="text-lg text-red-500 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>

                {/* TRACK SHIPMENT */}
                <Link
                  to="/tracking"
                  className="
                    group
                    block
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                    transition
                    hover:border-red-500/40
                    hover:bg-red-500/[0.04]
                  "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        Track Shipment
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Check real-time shipment status
                      </p>
                    </div>
                    <span className="text-lg text-red-500 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>

                {/* ACCOUNT */}
                <button
                  type="button"
                  onClick={() => setShowAccountModal(true)}
                  className="
                    group
                    block
                    w-full
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                    text-left
                    transition
                    hover:border-red-500/40
                    hover:bg-red-500/[0.04]
                  "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        Account Settings
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Manage your account & details
                      </p>
                    </div>
                    <span className="text-lg text-red-500 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </button>
              </div>


              {/* SYSTEM STATUS */}
              <div className="mx-5 mb-5 border border-white/5 bg-black/30 p-4">

                <div className="flex items-center gap-2">

                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-400
                      shadow-[0_0_10px_rgba(52,211,153,0.7)]
                    "
                  />

                  <span className="text-xs font-semibold text-emerald-400">
                    SYSTEM OPERATIONAL
                  </span>

                </div>

                <p className="mt-2 text-[10px] text-slate-600">
                  All logistics services are running normally.
                </p>

              </div>

            </section>

          </div>

        </div>

        {/* ACCOUNT DETAILS MODAL */}
        <AnimatePresence>
          {showAccountModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg border border-white/10 bg-[#090909] p-6 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">
                      ACCOUNT SETTINGS & DETAILS
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Client organization credentials and active status
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAccountModal(false)}
                    className="h-8 w-8 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/30 flex items-center justify-center text-sm transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center gap-4 p-4 border border-white/5 bg-white/[0.02]">
                    <div className="h-12 w-12 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-lg">
                      {(user?.name || user?.email || "C")[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {user?.name || "Corporate Client"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {user?.email || "client@logitrack.io"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-slate-500 uppercase tracking-wider block text-[10px]">
                        Account Role
                      </span>
                      <span className="font-mono text-white font-medium mt-1 inline-block">
                        {user?.role || "CLIENT"}
                      </span>
                    </div>

                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-slate-500 uppercase tracking-wider block text-[10px]">
                        Account Status
                      </span>
                      <span className="text-emerald-400 font-medium mt-1 inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        Active & Verified
                      </span>
                    </div>

                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-slate-500 uppercase tracking-wider block text-[10px]">
                        Client ID
                      </span>
                      <span className="font-mono text-slate-300 font-medium mt-1 inline-block">
                        {user?.id ? `CLI-${String(user.id).slice(-4)}` : "CLI-8829"}
                      </span>
                    </div>

                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-slate-500 uppercase tracking-wider block text-[10px]">
                        Logistics Tier
                      </span>
                      <span className="text-amber-400 font-medium mt-1 inline-block">
                        Enterprise Priority
                      </span>
                    </div>
                  </div>

                  <div className="border border-white/5 bg-white/[0.02] p-3 text-xs">
                    <span className="text-slate-500 uppercase tracking-wider block text-[10px]">
                      Access Permissions
                    </span>
                    <p className="text-slate-300 mt-1">
                      Full shipment dispatch, live telemetry tracking, and digital proof-of-delivery receipts.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAccountModal(false)}
                    className="px-4 py-2 border border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:border-white/30 transition"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAccountModal(false)}
                    className="px-4 py-2 bg-red-600 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}

export default ClientDashboard;