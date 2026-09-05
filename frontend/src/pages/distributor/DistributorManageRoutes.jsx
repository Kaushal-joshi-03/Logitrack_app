import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../components/navigation/Navbar";

const INITIAL_ROUTES = [
  {
    id: "RT-801",
    name: "Western Express Corridor",
    origin: "Mumbai Logistics Hub",
    destination: "Pune Distribution Center",
    waypoints: ["Thane", "Panvel", "Lonavala"],
    estHours: "3.5 hrs",
    distance: "148 km",
    vehiclesActive: 12,
    status: "OPTIMAL",
  },
  {
    id: "RT-802",
    name: "Northern Linehaul Trunk",
    origin: "Delhi Central Warehouse",
    destination: "Jaipur Distribution Hub",
    waypoints: ["Gurgaon", "Rewari", "Kotputli"],
    estHours: "4.8 hrs",
    distance: "268 km",
    vehiclesActive: 8,
    status: "OPTIMAL",
  },
  {
    id: "RT-803",
    name: "Gujarat Industrial Highway",
    origin: "Ahmedabad Warehouse",
    destination: "Surat Distribution Center",
    waypoints: ["Vadodara", "Bharuch", "Ankleshwar"],
    estHours: "4.1 hrs",
    distance: "260 km",
    vehiclesActive: 6,
    status: "CONGESTED",
  },
  {
    id: "RT-804",
    name: "Southern Tech Highway",
    origin: "Bengaluru Logistics Hub",
    destination: "Chennai Central Depot",
    waypoints: ["Hosur", "Krishnagiri", "Vellore"],
    estHours: "5.5 hrs",
    distance: "345 km",
    vehiclesActive: 14,
    status: "OPTIMAL",
  },
  {
    id: "RT-805",
    name: "Eastern Feeder Network",
    origin: "Kolkata Distribution Hub",
    destination: "Patna Transit Center",
    waypoints: ["Durgapur", "Asansol", "Dhanbad"],
    estHours: "9.0 hrs",
    distance: "580 km",
    vehiclesActive: 5,
    status: "WEATHER ALERT",
  },
];

function DistributorManageRoutes() {
  const [routes, setRoutes] = useState(() => {
    const saved = localStorage.getItem("logitrack_distributor_routes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ROUTES;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: "",
    origin: "",
    destination: "",
    waypoints: "",
    estHours: "4.0 hrs",
    distance: "220 km",
    vehiclesActive: 4,
    status: "OPTIMAL",
  });

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!newRoute.name.trim() || !newRoute.origin.trim() || !newRoute.destination.trim()) {
      toast.error("Please fill in route name, origin, and destination.");
      return;
    }
    const created = {
      id: `RT-${Math.floor(800 + Math.random() * 100)}`,
      name: newRoute.name.trim(),
      origin: newRoute.origin.trim(),
      destination: newRoute.destination.trim(),
      waypoints: newRoute.waypoints ? newRoute.waypoints.split(",").map((s) => s.trim()) : ["Direct Route"],
      estHours: newRoute.estHours,
      distance: newRoute.distance,
      vehiclesActive: Number(newRoute.vehiclesActive) || 1,
      status: newRoute.status,
    };

    const updated = [created, ...routes];
    setRoutes(updated);
    localStorage.setItem("logitrack_distributor_routes", JSON.stringify(updated));
    toast.success(`Route ${created.name} activated on distribution grid!`);
    setShowAddModal(false);
    setNewRoute({
      name: "",
      origin: "",
      destination: "",
      waypoints: "",
      estHours: "4.0 hrs",
      distance: "220 km",
      vehiclesActive: 4,
      status: "OPTIMAL",
    });
  };

  const handleToggleStatus = (routeId) => {
    const updated = routes.map((r) => {
      if (r.id === routeId) {
        const nextStatus = r.status === "OPTIMAL" ? "REROUTING" : "OPTIMAL";
        return { ...r, status: nextStatus };
      }
      return r;
    });
    setRoutes(updated);
    localStorage.setItem("logitrack_distributor_routes", JSON.stringify(updated));
    toast.info(`Route ${routeId} status adjusted.`);
  };

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
          {/* BACK LINK */}
          <div className="flex items-center justify-between">
            <Link
              to="/distributor"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
            >
              <span className="text-xl">←</span>
              Back to Distributor Dashboard
            </Link>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 transition shadow-lg shadow-red-600/20"
            >
              + Create Delivery Route
            </button>
          </div>

          {/* TITLE */}
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-red-500">
                LOGISTICS CORRIDORS
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                Manage Distribution Routes
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Monitor live linehaul corridors, toll waypoints, traffic status, and transit efficiency.
              </p>
            </div>

            <div className="flex gap-4 text-xs font-mono">
              <div className="border border-white/10 bg-[#090909] px-4 py-2">
                <span className="text-slate-500 block text-[10px]">TOTAL CORRIDORS</span>
                <span className="text-white font-bold text-base">{routes.length}</span>
              </div>
              <div className="border border-white/10 bg-[#090909] px-4 py-2">
                <span className="text-slate-500 block text-[10px]">ACTIVE VEHICLES</span>
                <span className="text-emerald-400 font-bold text-base">
                  {routes.reduce((acc, curr) => acc + curr.vehiclesActive, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* ROUTES GRID */}
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {routes.map((route, idx) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-white/10 bg-[#090909] p-5 flex flex-col justify-between hover:border-red-500/40 transition"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest">
                        {route.id}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {route.name}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        route.status === "OPTIMAL"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : route.status === "CONGESTED"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {route.status}
                    </span>
                  </div>

                  <div className="mt-4 border border-white/5 bg-white/[0.02] p-3 text-xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">●</span>
                      <span className="text-slate-300 font-medium">{route.origin}</span>
                    </div>
                    <div className="pl-1 text-slate-600 font-mono text-[10px]">
                      ↓ via {route.waypoints.join(" • ")}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">■</span>
                      <span className="text-slate-300 font-medium">{route.destination}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="border border-white/5 bg-black/20 p-2">
                      <span className="text-[10px] text-slate-500 block">Distance</span>
                      <span className="text-white font-mono font-medium">{route.distance}</span>
                    </div>
                    <div className="border border-white/5 bg-black/20 p-2">
                      <span className="text-[10px] text-slate-500 block">Est. Time</span>
                      <span className="text-white font-mono font-medium">{route.estHours}</span>
                    </div>
                    <div className="border border-white/5 bg-black/20 p-2">
                      <span className="text-[10px] text-slate-500 block">Vehicles</span>
                      <span className="text-red-400 font-mono font-bold">{route.vehiclesActive}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Auto-Optimization: <span className="text-emerald-400">ON</span>
                  </span>
                  <button
                    onClick={() => handleToggleStatus(route.id)}
                    className="text-xs text-red-500 hover:text-red-400 font-semibold"
                  >
                    {route.status === "OPTIMAL" ? "Flag Reroute" : "Restore Optimal"} →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ADD ROUTE MODAL */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg border border-white/10 bg-[#090909] p-6 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    CREATE DISTRIBUTION CORRIDOR
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="h-8 w-8 rounded-full border border-white/10 text-slate-400 hover:text-white flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddRoute} className="mt-6 space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                      Corridor Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Central Deccan Linehaul"
                      value={newRoute.name}
                      onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                      className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Origin Hub *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hyderabad Hub"
                        value={newRoute.origin}
                        onChange={(e) => setNewRoute({ ...newRoute, origin: e.target.value })}
                        className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Destination Hub *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nagpur Facility"
                        value={newRoute.destination}
                        onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
                        className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                      Transit Waypoints (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nizamabad, Adilabad"
                      value={newRoute.waypoints}
                      onChange={(e) => setNewRoute({ ...newRoute, waypoints: e.target.value })}
                      className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Distance
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 310 km"
                        value={newRoute.distance}
                        onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                        className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Est. Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5.2 hrs"
                        value={newRoute.estHours}
                        onChange={(e) => setNewRoute({ ...newRoute, estHours: e.target.value })}
                        className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Vehicles
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newRoute.vehiclesActive}
                        onChange={(e) => setNewRoute({ ...newRoute, vehiclesActive: e.target.value })}
                        className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-white/10 text-xs font-semibold uppercase text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-red-600 text-xs font-semibold uppercase text-white hover:bg-red-500 shadow-lg shadow-red-600/20"
                    >
                      Save Corridor
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default DistributorManageRoutes;
