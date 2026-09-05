import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../components/navigation/Navbar";

const DRIVERS = [
  { id: "DRV-101", name: "Vikram Malhotra", phone: "+91 98112 45901", status: "AVAILABLE", vehicle: "Tata Ace EV (MH-02-EE-1928)" },
  { id: "DRV-102", name: "Neha Gupta", phone: "+91 97230 11928", status: "ON ROUTE", vehicle: "Mahindra Bolero Maxi (DL-01-AB-8821)" },
  { id: "DRV-103", name: "Amit Kumar", phone: "+91 98765 43210", status: "AVAILABLE", vehicle: "E-Cargo Van (KA-03-EX-4019)" },
  { id: "DRV-104", name: "Ravi Singh", phone: "+91 99123 77610", status: "AVAILABLE", vehicle: "Force Delivery Van (RJ-14-CC-3321)" },
];

const ROUTES = [
  "Route 1: Central Urban Ring (Delhi - Gurgaon)",
  "Route 2: Western Express Corridor (Mumbai - Thane - Navi Mumbai)",
  "Route 3: Northern Feeder Highway (Jaipur - Ajmer)",
  "Route 4: Tech Corridor Loop (Bengaluru - Electronic City)",
  "Route 5: Industrial Belt (Ahmedabad - Sanand)",
];

function DistributorAssignPackage() {
  const [packageId, setPackageId] = useState("PKG-10287");
  const [selectedDriver, setSelectedDriver] = useState(DRIVERS[0].name);
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0]);
  const [priority, setPriority] = useState("High");
  const [notes, setNotes] = useState("");

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("logitrack_distributor_assignments");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "PKG-10294",
        driver: "Vikram Malhotra",
        route: "Western Express Corridor (Mumbai - Thane)",
        vehicle: "Tata Ace EV",
        assignedAt: "Today, 09:30 AM",
        status: "DISPATCHED",
      },
      {
        id: "PKG-10276",
        driver: "Amit Kumar",
        route: "Route 3: Northern Feeder Highway",
        vehicle: "E-Cargo Van",
        assignedAt: "Today, 10:15 AM",
        status: "IN PROGRESS",
      },
    ];
  });

  const handleAssign = (e) => {
    e.preventDefault();
    if (!packageId.trim()) {
      toast.error("Please enter a package ID.");
      return;
    }
    const driverObj = DRIVERS.find((d) => d.name === selectedDriver);
    const newAssignment = {
      id: packageId.trim().toUpperCase(),
      driver: selectedDriver,
      route: selectedRoute,
      vehicle: driverObj ? driverObj.vehicle.split(" (")[0] : "Fleet Unit",
      assignedAt: "Just now",
      status: "ASSIGNED",
    };

    const updated = [newAssignment, ...assignments];
    setAssignments(updated);
    localStorage.setItem("logitrack_distributor_assignments", JSON.stringify(updated));

    // Also update distributor package queue if present
    const savedQueue = localStorage.getItem("logitrack_distributor_packages");
    if (savedQueue) {
      try {
        const queue = JSON.parse(savedQueue);
        const updatedQueue = queue.map((p) =>
          p.id.toUpperCase() === packageId.trim().toUpperCase()
            ? { ...p, assignedDriver: selectedDriver, status: "IN TRANSIT" }
            : p
        );
        localStorage.setItem("logitrack_distributor_packages", JSON.stringify(updatedQueue));
      } catch (err) {
        // ignore
      }
    }

    toast.success(`Package ${packageId.toUpperCase()} assigned to ${selectedDriver}!`);
    setPackageId("");
    setNotes("");
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

            <Link
              to="/distributor/packages"
              className="border border-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:border-red-500/40 hover:text-white transition"
            >
              View Queue
            </Link>
          </div>

          {/* TITLE */}
          <div className="mt-6">
            <p className="text-xs font-bold tracking-[0.3em] text-red-500">
              DRIVER DISPATCH & FLEET
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              Assign Package to Route
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Allocate sorting-center packages to registered delivery personnel and delivery corridors.
            </p>
          </div>

          {/* GRID: FORM + DRIVER AVAILABILITY */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* ASSIGNMENT FORM */}
            <div className="border border-white/10 bg-[#090909] p-6">
              <h2 className="text-base font-bold text-white tracking-wide border-b border-white/10 pb-4">
                Dispatch Allocation Form
              </h2>

              <form onSubmit={handleAssign} className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Package ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PKG-10287"
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                    className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Delivery Driver / Agent *
                    </label>
                    <select
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                    >
                      {DRIVERS.map((driver) => (
                        <option key={driver.id} value={driver.name}>
                          {driver.name} ({driver.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Dispatch Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="Standard">Standard Delivery</option>
                      <option value="High">High Priority</option>
                      <option value="Express">Same-Day Express</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Target Route / Corridor *
                  </label>
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                  >
                    {ROUTES.map((route, i) => (
                      <option key={i} value={route}>
                        {route}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Handling Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fragile glass items, signature required upon handover"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-red-600 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 transition shadow-lg shadow-red-600/20"
                  >
                    Confirm Driver Assignment
                  </button>
                </div>
              </form>
            </div>

            {/* DRIVERS STATUS PANEL */}
            <div className="border border-white/10 bg-[#090909] p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Active Driver Roster
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  {DRIVERS.length} PERSONNEL
                </span>
              </div>

              <div className="mt-5 divide-y divide-white/5">
                {DRIVERS.map((driver) => (
                  <div key={driver.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{driver.name}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          driver.status === "AVAILABLE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {driver.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 font-mono">{driver.phone}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{driver.vehicle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIVE ASSIGNMENTS LOG */}
          <div className="mt-8 border border-white/10 bg-[#090909]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Recent Route Assignments
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {assignments.length} ALLOCATED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] text-slate-500 uppercase bg-white/[0.01]">
                    <th className="px-6 py-3.5">Package ID</th>
                    <th className="px-6 py-3.5">Assigned Driver</th>
                    <th className="px-6 py-3.5">Route</th>
                    <th className="px-6 py-3.5">Vehicle</th>
                    <th className="px-6 py-3.5">Timestamp</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {assignments.map((item, idx) => (
                    <motion.tr
                      key={`${item.id}-${idx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-3.5 font-mono font-bold text-white">
                        {item.id}
                      </td>
                      <td className="px-6 py-3.5 text-slate-300 font-medium">
                        {item.driver}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-400 max-w-[220px] truncate">
                        {item.route}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-300 font-mono">
                        {item.vehicle}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-500 font-mono">
                        {item.assignedAt}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex px-2 py-0.5 text-[10px] font-bold tracking-wider rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          {item.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DistributorAssignPackage;
