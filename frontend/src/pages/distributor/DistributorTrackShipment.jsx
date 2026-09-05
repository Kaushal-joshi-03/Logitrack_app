import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../components/navigation/Navbar";

const TRACKING_SAMPLES = {
  "PKG-10294": {
    id: "PKG-10294",
    origin: "Delhi Central Warehouse",
    destination: "Mumbai Logistics Hub",
    carrier: "Linehaul Freight Express #14",
    currentLocation: "National Highway 48 (Approaching Surat, GJ)",
    speed: "64 km/h",
    eta: "Today, 6:40 PM",
    driver: "Vikram Malhotra",
    status: "IN TRANSIT",
    progress: 72,
    waypoints: [
      { name: "Delhi Warehouse", time: "27 Aug, 04:30 AM", completed: true },
      { name: "Jaipur Bypass Hub", time: "27 Aug, 09:15 AM", completed: true },
      { name: "Ahmedabad Transit Point", time: "27 Aug, 02:45 PM", completed: true },
      { name: "Surat Checkpoint", time: "Expected 05:30 PM", completed: false, current: true },
      { name: "Mumbai Final Terminal", time: "Expected 06:40 PM", completed: false },
    ],
  },
  "PKG-10287": {
    id: "PKG-10287",
    origin: "Ahmedabad Warehouse",
    destination: "Pune Distribution Hub",
    carrier: "Feeder Van #08",
    currentLocation: "Ahmedabad Sorting Center - Bay 3",
    speed: "0 km/h (Docked)",
    eta: "Tomorrow, 10:00 AM",
    driver: "Awaiting Allocation",
    status: "READY FOR PICKUP",
    progress: 25,
    waypoints: [
      { name: "Ahmedabad Warehouse", time: "27 Aug, 10:00 AM", completed: true, current: true },
      { name: "Vadodara Transit Dock", time: "Expected Tomorrow, 02:00 AM", completed: false },
      { name: "Mumbai Ring", time: "Expected Tomorrow, 06:30 AM", completed: false },
      { name: "Pune Distribution Hub", time: "Expected Tomorrow, 10:00 AM", completed: false },
    ],
  },
};

function DistributorTrackShipment() {
  const [searchQuery, setSearchQuery] = useState("PKG-10294");
  const [data, setData] = useState(TRACKING_SAMPLES["PKG-10294"]);

  const handleSearch = (e) => {
    e.preventDefault();
    const key = searchQuery.trim().toUpperCase();
    if (TRACKING_SAMPLES[key]) {
      setData(TRACKING_SAMPLES[key]);
      toast.success(`Telemetry loaded for ${key}`);
    } else {
      // Synthesize tracking for any queried ID
      setData({
        id: key,
        origin: "Regional Logistics Depot",
        destination: "Metro Distribution Center",
        carrier: "Standard Fleet Linehaul",
        currentLocation: "Interstate Transit Corridor (GPS Ping Active)",
        speed: "58 km/h",
        eta: "Tomorrow, 12:00 PM",
        driver: "Assigned Fleet Operator",
        status: "IN TRANSIT",
        progress: 55,
        waypoints: [
          { name: "Origin Dispatch Center", time: "Today, 08:00 AM", completed: true },
          { name: "Midway Junction", time: "Today, 02:00 PM", completed: true, current: true },
          { name: "Regional Gateway", time: "Expected Tomorrow, 06:00 AM", completed: false },
          { name: "Destination Hub", time: "Expected Tomorrow, 12:00 PM", completed: false },
        ],
      });
      toast.info(`Active telemetry streamed for ${key}`);
    }
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
              to="/tracking"
              className="border border-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:border-red-500/40 hover:text-white transition"
            >
              Public Tracking Portal →
            </Link>
          </div>

          {/* TITLE & SEARCH */}
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-red-500">
                REAL-TIME TELEMETRY
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                Distributor Fleet Tracking
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Live GPS positioning, waypoints, telemetry speed, and arrival estimation for all network shipments.
              </p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col sm:flex-row gap-3 border border-white/10 bg-[#090909] p-4"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Package or Tracking ID (e.g. PKG-10294)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-white/10 bg-black/40 px-4 py-2.5 pl-9 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                🔍
              </span>
            </div>
            <button
              type="submit"
              className="bg-red-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 transition shadow-lg shadow-red-600/20"
            >
              Stream Telemetry
            </button>
          </form>

          {/* TELEMETRY CARD */}
          {data && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              {/* STATUS & PROGRESS */}
              <div className="border border-white/10 bg-[#090909] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                      TELEMETRY BEACON #{data.id}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-0.5">
                      {data.origin} → {data.destination}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wider rounded bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
                    <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
                    {data.status}
                  </span>
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>Route Transit Completion</span>
                    <span className="text-red-400 font-bold">{data.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                      style={{ width: `${data.progress}%` }}
                    />
                  </div>
                </div>

                {/* TELEMETRY GAUGES */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="border border-white/5 bg-black/20 p-3">
                    <span className="text-[10px] text-slate-500 block uppercase">Speed</span>
                    <span className="font-mono font-bold text-white text-base mt-1 block">
                      {data.speed}
                    </span>
                  </div>
                  <div className="border border-white/5 bg-black/20 p-3">
                    <span className="text-[10px] text-slate-500 block uppercase">ETA</span>
                    <span className="font-mono font-bold text-emerald-400 text-base mt-1 block">
                      {data.eta}
                    </span>
                  </div>
                  <div className="border border-white/5 bg-black/20 p-3">
                    <span className="text-[10px] text-slate-500 block uppercase">Carrier</span>
                    <span className="font-mono text-xs text-slate-300 mt-1 block truncate">
                      {data.carrier}
                    </span>
                  </div>
                  <div className="border border-white/5 bg-black/20 p-3">
                    <span className="text-[10px] text-slate-500 block uppercase">Driver</span>
                    <span className="font-mono text-xs text-slate-300 mt-1 block truncate">
                      {data.driver}
                    </span>
                  </div>
                </div>

                <div className="mt-6 border border-white/5 bg-white/[0.02] p-4 text-xs">
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px] font-semibold">
                    Current GPS Telemetry Point
                  </span>
                  <p className="text-white font-medium mt-1">
                    {data.currentLocation}
                  </p>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="border border-white/10 bg-[#090909] p-6">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase border-b border-white/10 pb-4">
                  Waypoint Checkpoints
                </h3>

                <div className="mt-6 space-y-6 relative pl-4 border-l border-white/10 ml-2">
                  {data.waypoints.map((wp, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 ${
                          wp.completed
                            ? "bg-emerald-400 border-emerald-400"
                            : wp.current
                            ? "bg-red-500 border-red-500 animate-ping"
                            : "bg-black border-slate-600"
                        }`}
                      />
                      {wp.current && (
                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-red-500" />
                      )}
                      <div>
                        <p className={`text-sm font-semibold ${wp.completed || wp.current ? "text-white" : "text-slate-500"}`}>
                          {wp.name}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {wp.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DistributorTrackShipment;
