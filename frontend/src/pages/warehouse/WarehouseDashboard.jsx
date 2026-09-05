import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../components/navigation/Navbar";
import { useAuth } from "../../context/AuthContext";

function WarehouseDashboard() {
  const { user } = useAuth();
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchPackageId, setDispatchPackageId] = useState("");
  const [selectedPkgId, setSelectedPkgId] = useState("PKG-10294");

  const [recentPackages, setRecentPackages] = useState(() => {
    const saved = localStorage.getItem("logitrack_warehouse_packages");
    if (saved) {
      try {
        return JSON.parse(saved).slice(0, 4);
      } catch (e) {
        console.error("Failed to parse warehouse packages", e);
      }
    }
    return [
      {
        id: "PKG-10294",
        origin: "Delhi",
        destination: "Mumbai",
        status: "Ready",
        date: "27 Aug 2026",
      },
      {
        id: "PKG-10291",
        origin: "Ahmedabad",
        destination: "Jaipur",
        status: "Stored",
        date: "27 Aug 2026",
      },
      {
        id: "PKG-10287",
        origin: "Delhi",
        destination: "Ahmedabad",
        status: "Dispatched",
        date: "26 Aug 2026",
      },
      {
        id: "PKG-10281",
        origin: "Mumbai",
        destination: "Delhi",
        status: "Stored",
        date: "26 Aug 2026",
      },
    ];
  });

  const handleDispatch = (pkgIdToDispatch) => {
    const targetId = pkgIdToDispatch || dispatchPackageId || selectedPkgId;
    if (!targetId.trim()) {
      toast.error("Please select or enter a package ID.");
      return;
    }
    const cleanId = targetId.trim().toUpperCase();
    const updated = recentPackages.map((p) =>
      p.id.toUpperCase() === cleanId ? { ...p, status: "Dispatched" } : p
    );
    setRecentPackages(updated);

    // Also update logitrack_warehouse_packages if exists
    const saved = localStorage.getItem("logitrack_warehouse_packages");
    if (saved) {
      try {
        const all = JSON.parse(saved);
        const updatedAll = all.map((p) =>
          p.id.toUpperCase() === cleanId ? { ...p, status: "DISPATCHED" } : p
        );
        localStorage.setItem("logitrack_warehouse_packages", JSON.stringify(updatedAll));
      } catch (e) {
        // ignore
      }
    }

    toast.success(`Package ${cleanId} dispatched for transit!`);
    setDispatchModalOpen(false);
    setDispatchPackageId("");
  };

  const stats = [
    {
      title: "TOTAL PACKAGES",
      value: "342",
      subtitle: "Packages received",
    },
    {
      title: "IN WAREHOUSE",
      value: "86",
      subtitle: "Currently stored",
    },
    {
      title: "READY TO DISPATCH",
      value: "42",
      subtitle: "Awaiting pickup",
    },
    {
      title: "DISPATCHED",
      value: "214",
      subtitle: "Sent to distributor",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <Navbar showLogout={true} />

      <main
        className="
          min-h-[calc(100vh-76px)]
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


          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="mb-2 text-xs font-bold tracking-[0.3em] text-red-500">
                WAREHOUSE CONTROL
              </p>

              <h1 className="text-3xl font-bold md:text-4xl">
                Welcome Back{user?.name ? ` ${user.name}` : ""}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage incoming packages, storage and dispatch operations.
              </p>

            </div>


            <div className="flex gap-3">

              <Link
                to="/warehouse/scan"
                className="
    border
    border-white/10
    px-5
    py-3
    text-sm
    text-slate-300
    transition
    hover:border-red-500/40
    hover:text-white
  "
              >
                Scan Package
              </Link>

              <Link
                to="/warehouse/receive"
                className="
    bg-red-500
    px-5
    py-3
    text-sm
    font-bold
    text-white
    transition
    hover:bg-red-600
  "
              >
                + Receive Package
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
                transition={{ delay: index * 0.08 }}
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


          {/* CONTENT */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">


            {/* PACKAGE TABLE */}
            <section className="overflow-hidden border border-white/10 bg-[#090909]">

              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                    WAREHOUSE ACTIVITY
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Recent Packages
                  </h2>

                </div>

                <Link
                  to="/warehouse/packages"
                  className="text-xs text-slate-500 transition hover:text-white"
                >
                  View All →
                </Link>

              </div>


              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px]">

                  <thead>

                    <tr className="border-b border-white/5 text-left">

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        PACKAGE ID
                      </th>

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        ORIGIN
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

                    {recentPackages.map((pkg, index) => (

                      <tr
                        key={pkg.id}
                        className="
                          border-b
                          border-white/5
                          transition
                          hover:bg-white/[0.02]
                        "
                      >

                        <td className="px-6 py-5 text-sm font-semibold">
                          {pkg.id}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {pkg.origin}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {pkg.destination}
                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-2
                              text-xs
                              ${pkg.status === "Dispatched"
                                ? "text-emerald-400"
                                : pkg.status === "Ready"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                              }
                            `}
                          >

                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {pkg.status}

                          </span>

                        </td>

                        <td className="px-6 py-5 text-xs text-slate-600">
                          {pkg.date}
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
                  Warehouse Control
                </h2>

              </div>


              <div className="space-y-3 p-5">

                <Link
                  to="/warehouse/receive"
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
  "
                >


                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-semibold">
                        Receive Package
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Add incoming package
                      </p>

                    </div>

                    <span className="text-lg text-red-500">
                      →
                    </span>

                  </div>

                </Link>

                {/* SCAN PACKAGE */}
                <Link
                  to="/warehouse/scan"
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
                        Scan Package
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Scan package barcode
                      </p>
                    </div>
                    <span className="text-lg text-red-500 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>

                {/* DISPATCH PACKAGE */}
                <button
                  type="button"
                  onClick={() => setDispatchModalOpen(true)}
                  className="
                    group
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
                        Dispatch Package
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Send package to distributor
                      </p>
                    </div>
                    <span className="text-lg text-red-500 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </button>

              </div>


              {/* STATUS */}
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
                    WAREHOUSE ONLINE
                  </span>

                </div>

                <p className="mt-2 text-[10px] text-slate-600">
                  Warehouse operations are running normally.
                </p>

              </div>

            </section>

          </div>

        </div>

        {/* ================= DISPATCH PACKAGE MODAL ================= */}
        <AnimatePresence>
          {dispatchModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg border border-white/10 bg-[#090909] p-6 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-red-500">
                      WAREHOUSE OUTBOUND
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-wide mt-0.5">
                      Dispatch Package
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDispatchModalOpen(false)}
                    className="h-8 w-8 rounded-full border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Select Ready Package
                    </label>
                    <select
                      value={selectedPkgId}
                      onChange={(e) => {
                        setSelectedPkgId(e.target.value);
                        setDispatchPackageId(e.target.value);
                      }}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                    >
                      {recentPackages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.id} ({p.origin} → {p.destination}) - [{p.status}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Or Enter Package ID Manually
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PKG-10294"
                      value={dispatchPackageId}
                      onChange={(e) => setDispatchPackageId(e.target.value)}
                      className="w-full border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="border border-white/5 bg-white/[0.02] p-3 text-xs text-slate-400">
                    Dispatching marks this package as leaving the warehouse and triggers the notification to the regional distributor hub for transit intake.
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setDispatchModalOpen(false)}
                    className="px-4 py-2 border border-white/10 text-xs font-semibold uppercase text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDispatch()}
                    className="px-5 py-2 bg-red-600 text-xs font-semibold uppercase text-white hover:bg-red-500 shadow-lg shadow-red-600/20"
                  >
                    Confirm & Dispatch
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

export default WarehouseDashboard;