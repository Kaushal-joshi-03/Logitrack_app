import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import Navbar from "../../components/navigation/Navbar";

const DEFAULT_HUBS = [
  "Mumbai Regional Distribution Center",
  "Delhi Central Logistics Hub",
  "Jaipur Distribution Hub",
  "Ahmedabad Logistics Center",
  "Bengaluru Distribution Depot",
  "Kolkata Eastern Hub",
  "Pune Regional Facility",
];

const DEFAULT_ROUTES = [
  "Western Express Corridor (Mumbai - Thane - Pune)",
  "Northern Linehaul Trunk (Delhi - Gurgaon - Jaipur)",
  "Gujarat Industrial Belt (Ahmedabad - Vadodara - Surat)",
  "Southern Tech Highway (Bengaluru - Hosur - Chennai)",
  "Central Feeder Corridor (Indore - Bhopal - Nagpur)",
];

const DEFAULT_VEHICLES = [
  "Tata Ace EV (MH-02-EE-1928) - Electric Van",
  "Mahindra Bolero Maxi (DL-01-AB-8821) - Heavy Cargo",
  "Force Delivery Van (RJ-14-CC-3321) - Standard Van",
  "Linehaul Freight Truck #14 (MH-04-TR-5022) - Linehaul",
  "E-Cargo Van (KA-03-EX-4019) - Eco Courier",
];

const FALLBACK_DRIVERS = [
  { _id: "drv-101", name: "Vikram Malhotra", email: "vikram@logitrack.io", vehicle: "Tata Ace EV" },
  { _id: "drv-102", name: "Suresh Kumar", email: "suresh@logitrack.io", vehicle: "Mahindra Bolero" },
  { _id: "drv-103", name: "Neha Gupta", email: "neha@logitrack.io", vehicle: "Force Delivery Van" },
  { _id: "drv-104", name: "Amit Kumar", email: "amit@logitrack.io", vehicle: "E-Cargo Van" },
  { _id: "drv-105", name: "Ravi Singh", email: "ravi@logitrack.io", vehicle: "Linehaul Freight Truck" },
];

function DistributorCreateDistribution() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState(FALLBACK_DRIVERS);
  const [loading, setLoading] = useState(false);

  // Generate an initial Distribution ID
  const [formData, setFormData] = useState({
    distributionId: `DIST-${Math.floor(1000 + Math.random() * 9000)}`,
    originHub: DEFAULT_HUBS[0],
    destinationHub: DEFAULT_HUBS[1],
    driverId: FALLBACK_DRIVERS[0]._id,
    driverName: FALLBACK_DRIVERS[0].name,
    vehicle: DEFAULT_VEHICLES[0],
    route: DEFAULT_ROUTES[0],
    priority: "High",
    packageCount: "18",
    totalWeight: "142.5",
    departureTime: "Today, 02:30 PM",
    estimatedArrival: "Today, 07:45 PM",
    handlingNotes: "Fragile cargo included. Secure safety seals before dispatch.",
  });

  // Attempt to fetch live drivers from backend if available
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/distributor/drivers", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 2500,
        });
        if (res.data?.success && res.data.data?.length > 0) {
          setDrivers(res.data.data);
          setFormData((prev) => ({
            ...prev,
            driverId: res.data.data[0]._id,
            driverName: res.data.data[0].name,
          }));
        }
      } catch {
        // Graceful fallback to default drivers
      }
    };
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "driverId") {
      const selected = drivers.find((d) => d._id === value);
      setFormData((prev) => ({
        ...prev,
        driverId: value,
        driverName: selected ? selected.name : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.distributionId.trim()) {
      toast.error("Please provide a valid Distribution ID.");
      return;
    }
    if (formData.originHub === formData.destinationHub) {
      toast.error("Origin and destination hubs cannot be the same.");
      return;
    }

    setLoading(true);

    try {
      // 1. Prepare new distribution record
      const newDistributionItem = {
        id: formData.distributionId.toUpperCase(),
        source: formData.originHub.split(" ")[0],
        destination: formData.destinationHub.split(" ")[0],
        status: "READY FOR PICKUP",
        eta: formData.estimatedArrival,
        carrier: formData.vehicle.split(" (")[0],
        priority: `${formData.priority} Priority`,
        assignedDriver: formData.driverName,
        packageCount: Number(formData.packageCount) || 1,
        totalWeight: `${formData.totalWeight} kg`,
        departureTime: formData.departureTime,
        route: formData.route,
        notes: formData.handlingNotes,
        createdAt: new Date().toISOString(),
      };

      // 2. Persist to distributor packages queue
      const existingQueue = localStorage.getItem("logitrack_distributor_packages");
      let queueList = [];
      if (existingQueue) {
        try {
          queueList = JSON.parse(existingQueue);
        } catch {
          queueList = [];
        }
      }
      queueList.unshift(newDistributionItem);
      localStorage.setItem("logitrack_distributor_packages", JSON.stringify(queueList));

      // 3. Persist to active assignments
      const existingAssignments = localStorage.getItem("logitrack_distributor_assignments");
      let assignmentsList = [];
      if (existingAssignments) {
        try {
          assignmentsList = JSON.parse(existingAssignments);
        } catch {
          assignmentsList = [];
        }
      }
      assignmentsList.unshift({
        id: formData.distributionId.toUpperCase(),
        driver: formData.driverName,
        route: formData.route,
        vehicle: formData.vehicle.split(" (")[0],
        assignedAt: "Just now",
        status: "ASSIGNED",
      });
      localStorage.setItem("logitrack_distributor_assignments", JSON.stringify(assignmentsList));

      toast.success(`Distribution ${formData.distributionId.toUpperCase()} created and dispatched to queue!`);

      // Reset or redirect
      setTimeout(() => {
        navigate("/distributor/packages");
      }, 700);
    } catch (err) {
      toast.error("Failed to create distribution. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar showLogout={true} />

      <main
        className="min-h-[calc(100vh-76px)] px-4 py-6 sm:px-6 sm:py-8 lg:px-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "38px 38px",
        }}
      >
        <div className="mx-auto max-w-[1500px]">
          {/* TOP BREADCRUMB / BACK LINK */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/distributor"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
            >
              <span className="text-xl">←</span>
              Back to Distributor Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <Link
                to="/distributor/packages"
                className="border border-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:border-red-500/40 hover:text-white transition"
              >
                View Queue
              </Link>
              <Link
                to="/distributor/routes"
                className="border border-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:border-red-500/40 hover:text-white transition"
              >
                Manage Routes
              </Link>
            </div>
          </div>

          {/* PAGE HEADER */}
          <div className="mt-6">
            <p className="text-xs font-bold tracking-[0.3em] text-red-500">
              DISTRIBUTION DISPATCH
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-white">
              Create Distribution Run
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Schedule and dispatch regional distribution batches, assign carrier fleets, and initialize route manifests.
            </p>
          </div>

          {/* MAIN GRID: FORM + LIVE MANIFEST PREVIEW */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            {/* FORM CONTAINER */}
            <div className="border border-white/10 bg-[#090909] p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-base font-bold text-white tracking-wide uppercase">
                  Distribution Manifest Details
                </h2>
                <span className="text-[11px] font-mono text-slate-500">
                  HUB COMMAND
                </span>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* DISTRIBUTION ID & PRIORITY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Distribution Batch ID *
                    </label>
                    <input
                      type="text"
                      required
                      name="distributionId"
                      value={formData.distributionId}
                      onChange={handleChange}
                      placeholder="e.g. DIST-2026-8841"
                      className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Dispatch Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="Standard">Standard Distribution</option>
                      <option value="High">High Priority Transfer</option>
                      <option value="Express">Same-Day Express Linehaul</option>
                    </select>
                  </div>
                </div>

                {/* ORIGIN & DESTINATION HUBS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Origin Hub *
                    </label>
                    <select
                      name="originHub"
                      value={formData.originHub}
                      onChange={handleChange}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none truncate"
                    >
                      {DEFAULT_HUBS.map((hub) => (
                        <option key={hub} value={hub}>
                          {hub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Destination Hub / Center *
                    </label>
                    <select
                      name="destinationHub"
                      value={formData.destinationHub}
                      onChange={handleChange}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none truncate"
                    >
                      {DEFAULT_HUBS.map((hub) => (
                        <option key={hub} value={hub}>
                          {hub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ROUTE CORRIDOR */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Assigned Logistics Route *
                  </label>
                  <select
                    name="route"
                    value={formData.route}
                    onChange={handleChange}
                    className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none truncate"
                  >
                    {DEFAULT_ROUTES.map((route, i) => (
                      <option key={i} value={route}>
                        {route}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DRIVER & VEHICLE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Assigned Fleet Driver *
                    </label>
                    <select
                      name="driverId"
                      value={formData.driverId}
                      onChange={handleChange}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                    >
                      {drivers.map((drv) => (
                        <option key={drv._id} value={drv._id}>
                          {drv.name} {drv.email ? `(${drv.email})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Carrier Fleet Unit *
                    </label>
                    <select
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleChange}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none truncate"
                    >
                      {DEFAULT_VEHICLES.map((veh, i) => (
                        <option key={i} value={veh}>
                          {veh}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PACKAGE COUNT & TOTAL WEIGHT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Package Items Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      name="packageCount"
                      value={formData.packageCount}
                      onChange={handleChange}
                      placeholder="e.g. 24"
                      className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Total Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      required
                      name="totalWeight"
                      value={formData.totalWeight}
                      onChange={handleChange}
                      placeholder="e.g. 150.0"
                      className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* SCHEDULE TIMINGS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Scheduled Departure
                    </label>
                    <input
                      type="text"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                      placeholder="e.g. Today, 03:00 PM"
                      className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Estimated Arrival (ETA)
                    </label>
                    <input
                      type="text"
                      name="estimatedArrival"
                      value={formData.estimatedArrival}
                      onChange={handleChange}
                      placeholder="e.g. Today, 08:30 PM"
                      className="w-full border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* HANDLING INSTRUCTIONS */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Handling Instructions & Security Notes
                  </label>
                  <textarea
                    rows={2}
                    name="handlingNotes"
                    value={formData.handlingNotes}
                    onChange={handleChange}
                    placeholder="e.g. Fragile merchandise, priority express linehaul"
                    className="w-full border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 transition shadow-lg shadow-red-600/20 disabled:opacity-50"
                  >
                    {loading ? "Dispatching Distribution..." : "Confirm & Create Distribution Run"}
                  </button>
                </div>
              </form>
            </div>

            {/* LIVE PREVIEW & TELEMETRY SUMMARY */}
            <div className="space-y-6">
              <div className="border border-white/10 bg-[#090909] p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                    Live Manifest Summary
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    READY
                  </span>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  {/* ID & Priority */}
                  <div className="flex items-center justify-between border border-white/5 bg-white/[0.02] p-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Batch Code</span>
                      <span className="font-mono font-bold text-white text-sm mt-0.5 block">
                        {formData.distributionId || "DIST-XXXX"}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-red-500/10 text-red-400 border border-red-500/20">
                      {formData.priority} Priority
                    </span>
                  </div>

                  {/* Route corridor */}
                  <div className="border border-white/5 bg-white/[0.02] p-3 space-y-2">
                    <span className="text-[10px] text-slate-500 block uppercase">Transit Corridor</span>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">●</span>
                      <span className="text-slate-300 font-medium">{formData.originHub}</span>
                    </div>
                    <div className="pl-1 text-slate-600 font-mono text-[10px]">
                      ↓ Corridor: {formData.route.split(" (")[0]}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">■</span>
                      <span className="text-slate-300 font-medium">{formData.destinationHub}</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="border border-white/5 bg-black/30 p-2.5">
                      <span className="text-[10px] text-slate-500 block uppercase">Cargo Packages</span>
                      <span className="font-mono font-bold text-white text-base mt-0.5 block">
                        {formData.packageCount || 0}
                      </span>
                    </div>
                    <div className="border border-white/5 bg-black/30 p-2.5">
                      <span className="text-[10px] text-slate-500 block uppercase">Total Weight</span>
                      <span className="font-mono font-bold text-red-400 text-base mt-0.5 block">
                        {formData.totalWeight || 0} kg
                      </span>
                    </div>
                  </div>

                  {/* Driver & Vehicle */}
                  <div className="border border-white/5 bg-white/[0.02] p-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fleet Driver:</span>
                      <span className="text-white font-medium">{formData.driverName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Fleet:</span>
                      <span className="text-slate-300 font-mono text-[11px] truncate max-w-[180px]">
                        {formData.vehicle}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ETA Arrival:</span>
                      <span className="text-emerald-400 font-mono">{formData.estimatedArrival}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DISPATCH CONTROL INFO */}
              <div className="border border-white/10 bg-[#090909] p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  DISTRIBUTION PROTOCOL
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Creating this distribution run initiates the manifest record and broadcasts delivery tracking tokens across both origin and destination sorting gates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DistributorCreateDistribution;
