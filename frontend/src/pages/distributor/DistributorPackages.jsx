import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../components/navigation/Navbar";

const INITIAL_QUEUE = [
  {
    id: "PKG-10294",
    source: "Delhi",
    destination: "Mumbai",
    status: "IN TRANSIT",
    eta: "Today, 6:40 PM",
    carrier: "Linehaul Truck #14",
    priority: "High Priority",
    assignedDriver: "Vikram Malhotra",
  },
  {
    id: "PKG-10287",
    source: "Ahmedabad",
    destination: "Pune",
    status: "READY FOR PICKUP",
    eta: "Tomorrow, 10:00 AM",
    carrier: "Feeder Van #08",
    priority: "Standard",
    assignedDriver: "Unassigned",
  },
  {
    id: "PKG-10281",
    source: "Delhi",
    destination: "Jaipur",
    status: "DELIVERED",
    eta: "Delivered Today",
    carrier: "Express Courier #02",
    priority: "Express",
    assignedDriver: "Ravi Singh",
  },
  {
    id: "PKG-10276",
    source: "Mumbai",
    destination: "Udaipur",
    status: "IN TRANSIT",
    eta: "Tomorrow, 11:20 AM",
    carrier: "Regional Transit #05",
    priority: "Standard",
    assignedDriver: "Amit Kumar",
  },
  {
    id: "PKG-10263",
    source: "Bengaluru",
    destination: "Chennai",
    status: "SORTING",
    eta: "28 Aug, 02:00 PM",
    carrier: "Hub Intake Line 3",
    priority: "Express",
    assignedDriver: "Unassigned",
  },
  {
    id: "PKG-10255",
    source: "Kolkata",
    destination: "Ranchi",
    status: "READY FOR PICKUP",
    eta: "Tomorrow, 08:30 AM",
    carrier: "Cargo Van #11",
    priority: "High Priority",
    assignedDriver: "Neha Gupta",
  },
];

function DistributorPackages() {
  const [queue, setQueue] = useState(() => {
    const saved = localStorage.getItem("logitrack_distributor_packages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse distributor queue", e);
      }
    }
    return INITIAL_QUEUE;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleUpdateStatus = (pkgId, newStatus) => {
    const updated = queue.map((item) =>
      item.id === pkgId ? { ...item, status: newStatus } : item
    );
    setQueue(updated);
    localStorage.setItem("logitrack_distributor_packages", JSON.stringify(updated));
    toast.success(`Package ${pkgId} status updated to ${newStatus}`);
    if (selectedItem?.id === pkgId) {
      setSelectedItem({ ...selectedItem, status: newStatus });
    }
  };

  const filtered = queue.filter((item) => {
    const matchesFilter =
      filter === "ALL" || item.status.toUpperCase() === filter.toUpperCase();
    const q = search.toLowerCase();
    const matchesSearch =
      item.id.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q) ||
      item.destination.toLowerCase().includes(q) ||
      item.assignedDriver.toLowerCase().includes(q) ||
      item.carrier.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar showLogout={true} />

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
          {/* TOP NAV */}
          <div className="flex items-center justify-between">
            <Link
              to="/distributor"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
            >
              <span className="text-xl">←</span>
              Back to Distributor Dashboard
            </Link>

            <div className="flex gap-2.5">
              <Link
                to="/distributor/assign"
                className="border border-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:border-red-500/40 hover:text-white transition"
              >
                Assign Drivers
              </Link>
              <Link
                to="/distributor/routes"
                className="border border-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:border-red-500/40 hover:text-white transition"
              >
                Manage Routes
              </Link>
            </div>
          </div>

          {/* TITLE */}
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-red-500">
                DISTRIBUTION QUEUE
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                Regional Package Queue
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Hub-to-hub transfers, sorting line tracking, and last-mile driver allocations.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {filtered.length} ACTIVE SHIPMENTS QUEUED
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border border-white/10 bg-[#090909] p-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by package ID, city, driver, carrier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-white/10 bg-black/40 px-4 py-2.5 pl-9 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                🔍
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {["ALL", "IN TRANSIT", "READY FOR PICKUP", "SORTING", "DELIVERED"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1.5 text-xs font-semibold tracking-wider transition ${
                      filter === status
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>

          {/* QUEUE TABLE */}
          <div className="mt-6 overflow-hidden border border-white/10 bg-[#090909]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] tracking-wider text-slate-500 uppercase bg-white/[0.01]">
                    <th className="px-6 py-4">Package ID</th>
                    <th className="px-6 py-4">Route</th>
                    <th className="px-6 py-4">Carrier / Line</th>
                    <th className="px-6 py-4">Assigned Driver</th>
                    <th className="px-6 py-4">ETA / Arrival</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        No shipments in queue match your query.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-white/[0.02] transition"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-white">
                            {item.id}
                          </span>
                          <span className="block text-[10px] text-slate-500 font-medium">
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-300 font-medium">
                            {item.source}
                          </span>
                          <span className="mx-2 text-red-500">→</span>
                          <span className="text-slate-300 font-medium">
                            {item.destination}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-300 font-mono">
                          {item.carrier}
                        </td>
                        <td className="px-6 py-4">
                          {item.assignedDriver === "Unassigned" ? (
                            <span className="text-xs text-amber-400/90 font-medium italic">
                              Unassigned
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300 font-medium">
                              {item.assignedDriver}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                          {item.eta}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold tracking-wider rounded ${
                              item.status === "DELIVERED"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : item.status === "READY FOR PICKUP"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : item.status === "SORTING"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.status === "DELIVERED"
                                  ? "bg-emerald-400"
                                  : item.status === "READY FOR PICKUP"
                                  ? "bg-amber-400"
                                  : item.status === "SORTING"
                                  ? "bg-blue-400"
                                  : "bg-red-400 animate-pulse"
                              }`}
                            />
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="border border-white/10 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-white/30 transition"
                            >
                              Details
                            </button>
                            {item.status !== "DELIVERED" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateStatus(
                                    item.id,
                                    item.status === "READY FOR PICKUP"
                                      ? "IN TRANSIT"
                                      : "READY FOR PICKUP"
                                  )
                                }
                                className="bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 text-xs text-slate-200 font-medium transition"
                              >
                                Toggle State
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* DETAILS MODAL */}
        <AnimatePresence>
          {selectedItem && (
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
                      DISTRIBUTION SPECIFICATION
                    </span>
                    <h2 className="text-xl font-mono font-bold text-white mt-1">
                      {selectedItem.id}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="h-8 w-8 rounded-full border border-white/10 text-slate-400 hover:text-white flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Origin Hub
                      </span>
                      <span className="font-semibold text-white mt-1 block">
                        {selectedItem.source}
                      </span>
                    </div>
                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Destination Hub
                      </span>
                      <span className="font-semibold text-white mt-1 block">
                        {selectedItem.destination}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Assigned Driver
                      </span>
                      <span className="font-medium text-white mt-1 block">
                        {selectedItem.assignedDriver}
                      </span>
                    </div>
                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Carrier Transport
                      </span>
                      <span className="font-mono text-slate-300 mt-1 block text-xs">
                        {selectedItem.carrier}
                      </span>
                    </div>
                  </div>

                  <div className="border border-white/5 bg-white/[0.02] p-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Status & ETA
                    </span>
                    <p className="text-white mt-1 font-medium">
                      Status: <span className="text-red-400">{selectedItem.status}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Estimated Arrival: {selectedItem.eta}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 border border-white/10 text-xs font-semibold uppercase text-slate-300 hover:text-white"
                  >
                    Close
                  </button>
                  <Link
                    to="/distributor/assign"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold uppercase text-white shadow-lg shadow-red-600/20"
                  >
                    Reassign Driver
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default DistributorPackages;
