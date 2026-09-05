import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../components/navigation/Navbar";

const INITIAL_PACKAGES = [
  {
    id: "PKG-10294",
    origin: "Delhi",
    destination: "Mumbai",
    status: "READY TO DISPATCH",
    weight: "4.8 kg",
    dimensions: "30x20x15 cm",
    storageBay: "Bay A-14",
    date: "27 Aug 2026",
    type: "Express Parcel",
  },
  {
    id: "PKG-10291",
    origin: "Ahmedabad",
    destination: "Jaipur",
    status: "IN WAREHOUSE",
    weight: "12.4 kg",
    dimensions: "50x40x30 cm",
    storageBay: "Bay C-02",
    date: "27 Aug 2026",
    type: "Heavy Cargo",
  },
  {
    id: "PKG-10287",
    origin: "Delhi",
    destination: "Ahmedabad",
    status: "DISPATCHED",
    weight: "2.1 kg",
    dimensions: "20x15x10 cm",
    storageBay: "Bay B-08",
    date: "26 Aug 2026",
    type: "Standard Courier",
  },
  {
    id: "PKG-10281",
    origin: "Mumbai",
    destination: "Delhi",
    status: "IN WAREHOUSE",
    weight: "6.5 kg",
    dimensions: "35x25x20 cm",
    storageBay: "Bay A-09",
    date: "26 Aug 2026",
    type: "Express Parcel",
  },
  {
    id: "PKG-10275",
    origin: "Bengaluru",
    destination: "Hyderabad",
    status: "READY TO DISPATCH",
    weight: "3.2 kg",
    dimensions: "25x20x12 cm",
    storageBay: "Bay D-05",
    date: "25 Aug 2026",
    type: "Electronics",
  },
  {
    id: "PKG-10268",
    origin: "Kolkata",
    destination: "Patna",
    status: "RECEIVED",
    weight: "8.0 kg",
    dimensions: "40x30x25 cm",
    storageBay: "Intake Bay 1",
    date: "25 Aug 2026",
    type: "Standard Courier",
  },
];

function WarehousePackages() {
  const [packages, setPackages] = useState(() => {
    const saved = localStorage.getItem("logitrack_warehouse_packages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse warehouse packages", e);
      }
    }
    return INITIAL_PACKAGES;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [dispatchModalPkg, setDispatchModalPkg] = useState(null);

  const savePackages = (newPkgs) => {
    setPackages(newPkgs);
    localStorage.setItem("logitrack_warehouse_packages", JSON.stringify(newPkgs));
  };

  const handleDispatch = (pkgId) => {
    const updated = packages.map((p) =>
      p.id === pkgId ? { ...p, status: "DISPATCHED" } : p
    );
    savePackages(updated);
    toast.success(`Package ${pkgId} dispatched successfully!`);
    setDispatchModalPkg(null);
    if (selectedPackage?.id === pkgId) {
      setSelectedPackage({ ...selectedPackage, status: "DISPATCHED" });
    }
  };

  const filtered = packages.filter((pkg) => {
    const matchesFilter =
      filter === "ALL" || pkg.status.toUpperCase() === filter.toUpperCase();
    const q = search.toLowerCase();
    const matchesSearch =
      pkg.id.toLowerCase().includes(q) ||
      pkg.origin.toLowerCase().includes(q) ||
      pkg.destination.toLowerCase().includes(q) ||
      pkg.storageBay.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar showLogout={true} />

      <main
        className="min-h-[calc(100vh-76px)] px-6 py-8 lg:px-12"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "38px 38px",
        }}
      >
        <div className="mx-auto max-w-[1500px]">
          {/* TOP BREADCRUMB / BACK */}
          <div className="flex items-center justify-between">
            <Link
              to="/warehouse"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
            >
              <span className="text-xl">←</span>
              Back to Warehouse Dashboard
            </Link>

            <div className="flex gap-3">
              <Link
                to="/warehouse/scan"
                className="border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:border-red-500/40 hover:text-white transition"
              >
                Scan Package
              </Link>
              <Link
                to="/warehouse/receive"
                className="bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 transition shadow-lg shadow-red-600/20"
              >
                + Receive Package
              </Link>
            </div>
          </div>

          {/* TITLE & HEADER */}
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-red-500">
                INVENTORY MANAGEMENT
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                Warehouse Packages
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Full inventory of inbound, stored, ready-for-dispatch, and outgoing shipments.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              {filtered.length} PACKAGES DISPLAYED
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border border-white/10 bg-[#090909] p-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search package ID, origin, destination, bay..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-white/10 bg-black/40 px-4 py-2.5 pl-9 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                🔍
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {["ALL", "IN WAREHOUSE", "READY TO DISPATCH", "DISPATCHED", "RECEIVED"].map(
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

          {/* PACKAGES TABLE */}
          <div className="mt-6 overflow-hidden border border-white/10 bg-[#090909]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] tracking-wider text-slate-500 uppercase bg-white/[0.01]">
                    <th className="px-6 py-4">Package ID</th>
                    <th className="px-6 py-4">Route</th>
                    <th className="px-6 py-4">Type / Spec</th>
                    <th className="px-6 py-4">Storage Bay</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        No packages match your search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((pkg, idx) => (
                      <motion.tr
                        key={pkg.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-white/[0.02] transition"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-white">
                            {pkg.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-300 font-medium">
                            {pkg.origin}
                          </span>
                          <span className="mx-2 text-red-500">→</span>
                          <span className="text-slate-300 font-medium">
                            {pkg.destination}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="block text-xs text-slate-300">
                            {pkg.type}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {pkg.weight} • {pkg.dimensions}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block rounded border border-white/10 bg-white/[0.02] px-2 py-0.5 font-mono text-xs text-slate-300">
                            {pkg.storageBay}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                          {pkg.date}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold tracking-wider rounded ${
                              pkg.status === "READY TO DISPATCH"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : pkg.status === "DISPATCHED"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : pkg.status === "RECEIVED"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-white/5 text-slate-300 border border-white/10"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                pkg.status === "READY TO DISPATCH"
                                  ? "bg-amber-400 animate-pulse"
                                  : pkg.status === "DISPATCHED"
                                  ? "bg-emerald-400"
                                  : pkg.status === "RECEIVED"
                                  ? "bg-blue-400"
                                  : "bg-slate-400"
                              }`}
                            />
                            {pkg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedPackage(pkg)}
                              className="border border-white/10 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-white/30 transition"
                            >
                              Details
                            </button>
                            {pkg.status !== "DISPATCHED" && (
                              <button
                                type="button"
                                onClick={() => setDispatchModalPkg(pkg)}
                                className="bg-red-600/90 hover:bg-red-500 px-2.5 py-1 text-xs text-white font-medium transition"
                              >
                                Dispatch
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
          {selectedPackage && (
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
                      PACKAGE DETAILS
                    </span>
                    <h2 className="text-xl font-mono font-bold text-white mt-1">
                      {selectedPackage.id}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="h-8 w-8 rounded-full border border-white/10 text-slate-400 hover:text-white flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Origin
                      </span>
                      <span className="font-semibold text-white mt-1 block">
                        {selectedPackage.origin}
                      </span>
                    </div>
                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Destination
                      </span>
                      <span className="font-semibold text-white mt-1 block">
                        {selectedPackage.destination}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Weight
                      </span>
                      <span className="font-mono text-white mt-1 block">
                        {selectedPackage.weight}
                      </span>
                    </div>
                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Dimensions
                      </span>
                      <span className="font-mono text-white mt-1 block text-xs">
                        {selectedPackage.dimensions}
                      </span>
                    </div>
                    <div className="border border-white/5 bg-white/[0.02] p-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Storage Bay
                      </span>
                      <span className="font-mono text-red-400 font-bold mt-1 block">
                        {selectedPackage.storageBay}
                      </span>
                    </div>
                  </div>

                  <div className="border border-white/5 bg-white/[0.02] p-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Status & Timeline
                    </span>
                    <p className="text-white mt-1 font-medium">
                      Status: <span className="text-red-400">{selectedPackage.status}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Intake Date: {selectedPackage.date}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="px-4 py-2 border border-white/10 text-xs font-semibold uppercase text-slate-300 hover:text-white"
                  >
                    Close
                  </button>
                  {selectedPackage.status !== "DISPATCHED" && (
                    <button
                      onClick={() => {
                        handleDispatch(selectedPackage.id);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold uppercase text-white shadow-lg shadow-red-600/20"
                    >
                      Dispatch Now
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* DISPATCH CONFIRMATION MODAL */}
        <AnimatePresence>
          {dispatchModalPkg && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md border border-white/10 bg-[#090909] p-6 shadow-2xl relative"
              >
                <h3 className="text-lg font-bold text-white tracking-wide">
                  DISPATCH CONFIRMATION
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to mark package <span className="font-mono text-white">{dispatchModalPkg.id}</span> as dispatched for transit?
                </p>

                <div className="mt-4 border border-white/5 bg-white/[0.02] p-3 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Route:</span>
                    <span className="text-white font-medium">{dispatchModalPkg.origin} → {dispatchModalPkg.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Weight:</span>
                    <span className="text-white font-mono">{dispatchModalPkg.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Bay:</span>
                    <span className="text-red-400 font-mono">{dispatchModalPkg.storageBay}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setDispatchModalPkg(null)}
                    className="px-4 py-2 border border-white/10 text-xs font-semibold uppercase text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDispatch(dispatchModalPkg.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold uppercase text-white shadow-lg shadow-red-600/20"
                  >
                    Confirm Dispatch
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

export default WarehousePackages;
