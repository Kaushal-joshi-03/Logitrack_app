import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/navigation/Navbar";

const INITIAL_NETWORK = [
  {
    name: "Delhi Central Warehouse",
    location: "Delhi",
    type: "WAREHOUSE",
    shipments: 86,
    capacity: "78%",
    status: "OPERATIONAL",
  },
  {
    name: "Jaipur Distribution Hub",
    location: "Jaipur",
    type: "DISTRIBUTOR",
    shipments: 64,
    capacity: "62%",
    status: "OPERATIONAL",
  },
  {
    name: "Mumbai Logistics Hub",
    location: "Mumbai",
    type: "WAREHOUSE",
    shipments: 92,
    capacity: "84%",
    status: "OPERATIONAL",
  },
  {
    name: "Udaipur Distribution Center",
    location: "Udaipur",
    type: "DISTRIBUTOR",
    shipments: 41,
    capacity: "48%",
    status: "OPERATIONAL",
  },
];

const agents = [
  {
    name: "Neha Gupta",
    location: "Mumbai",
    deliveries: 12,
    status: "ONLINE",
  },
  {
    name: "Amit Kumar",
    location: "Delhi",
    deliveries: 9,
    status: "ONLINE",
  },
  {
    name: "Ravi Singh",
    location: "Jaipur",
    deliveries: 7,
    status: "OFFLINE",
  },
];

function AdminNetwork() {
  const [networkList, setNetworkList] = useState(() => {
    const saved = localStorage.getItem("logitrack_admin_network");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse saved network locations", err);
      }
    }
    return INITIAL_NETWORK;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    location: "",
    type: "WAREHOUSE",
    capacity: "75%",
    shipments: 20,
    status: "OPERATIONAL",
  });

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newLocation.name.trim() || !newLocation.location.trim()) {
      toast.error("Please enter both facility name and city.");
      return;
    }
    const updated = [
      {
        ...newLocation,
        name: newLocation.name.trim(),
        location: newLocation.location.trim(),
        shipments: Number(newLocation.shipments) || 0,
        capacity: newLocation.capacity.endsWith("%") ? newLocation.capacity : `${newLocation.capacity}%`,
      },
      ...networkList,
    ];
    setNetworkList(updated);
    localStorage.setItem("logitrack_admin_network", JSON.stringify(updated));
    toast.success(`Added ${newLocation.name} to logistics network`);
    setShowAddModal(false);
    setNewLocation({
      name: "",
      location: "",
      type: "WAREHOUSE",
      capacity: "75%",
      shipments: 20,
      status: "OPERATIONAL",
    });
  };

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
            to="/admin"
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
            Back to Admin
          </Link>


          {/* TITLE */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            <p className="text-xs font-bold tracking-[0.3em] text-red-500">
              NETWORK MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Logistics Network
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor warehouses, distributors and delivery agents.
            </p>

          </motion.div>


          {/* ================= NETWORK STATS ================= */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Stat
              number="24"
              title="WAREHOUSES"
              subtitle="Connected facilities"
            />

            <Stat
              number="38"
              title="DISTRIBUTORS"
              subtitle="Active distribution hubs"
            />

            <Stat
              number="126"
              title="DELIVERY AGENTS"
              subtitle="Registered agents"
            />

            <Stat
              number="94%"
              title="NETWORK HEALTH"
              subtitle="Current operational status"
            />

          </div>


          {/* ================= NETWORK LOCATIONS ================= */}

          <section className="mt-6 border border-white/10 bg-[#090909]">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                  NETWORK LOCATIONS
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Facilities & Distribution Hubs
                </h2>

              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="
                  border
                  border-white/10
                  px-4
                  py-2
                  text-xs
                  text-slate-400
                  transition
                  hover:border-red-500/40
                  hover:text-white
                "
              >
                + Add Location
              </button>

            </div>


            <div className="grid gap-4 p-6 md:grid-cols-2">

              {networkList.map((item, index) => (

                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="
                    border
                    border-white/10
                    bg-black/20
                    p-5
                    transition
                    hover:border-red-500/30
                  "
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-sm font-semibold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {item.location}
                      </p>

                    </div>

                    <span className="flex items-center gap-2 text-[9px] font-bold text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      {item.status}
                    </span>

                  </div>


                  <div className="mt-5 grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-[9px] tracking-wider text-slate-600">
                        TYPE
                      </p>

                      <p className="mt-1 text-xs font-bold text-red-400">
                        {item.type}
                      </p>

                    </div>

                    <div>

                      <p className="text-[9px] tracking-wider text-slate-600">
                        SHIPMENTS
                      </p>

                      <p className="mt-1 text-xs font-bold">
                        {item.shipments}
                      </p>

                    </div>

                  </div>


                  {/* CAPACITY */}

                  <div className="mt-5">

                    <div className="flex justify-between">

                      <span className="text-[9px] text-slate-600">
                        CAPACITY
                      </span>

                      <span className="text-[9px] text-slate-400">
                        {item.capacity}
                      </span>

                    </div>

                    <div className="mt-2 h-1.5 bg-white/5">

                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: item.capacity,
                        }}
                      />

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          </section>


          {/* ================= DELIVERY AGENTS ================= */}

          <section className="mt-6 overflow-hidden border border-white/10 bg-[#090909]">

            <div className="border-b border-white/10 px-6 py-5">

              <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                DELIVERY NETWORK
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Delivery Agents
              </h2>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px]">

                <thead>

                  <tr className="border-b border-white/10 text-left">

                    <th className="px-6 py-4 text-[10px] text-slate-600">
                      AGENT
                    </th>

                    <th className="px-6 py-4 text-[10px] text-slate-600">
                      LOCATION
                    </th>

                    <th className="px-6 py-4 text-[10px] text-slate-600">
                      DELIVERIES
                    </th>

                    <th className="px-6 py-4 text-[10px] text-slate-600">
                      STATUS
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {agents.map((agent) => (

                    <tr
                      key={agent.name}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >

                      <td className="px-6 py-5 text-sm font-semibold">
                        {agent.name}
                      </td>

                      <td className="px-6 py-5 text-xs text-slate-500">
                        {agent.location}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        {agent.deliveries}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`
                            text-[10px]
                            font-bold
                            ${agent.status === "ONLINE"
                              ? "text-green-400"
                              : "text-slate-600"
                            }
                          `}
                        >
                          ● {agent.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>


          {/* ================= NETWORK FLOW ================= */}

          <section className="mt-6 border border-white/10 bg-[#090909]">

            <div className="border-b border-white/10 px-6 py-5">

              <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                NETWORK FLOW
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Shipment Movement
              </h2>

            </div>


            <div className="grid items-center gap-4 p-6 md:grid-cols-5">

              <FlowNode
                title="DELHI"
                subtitle="Origin"
              />

              <FlowArrow />

              <FlowNode
                title="JAIPUR"
                subtitle="Distribution"
              />

              <FlowArrow />

              <FlowNode
                title="MUMBAI"
                subtitle="Destination"
              />

            </div>

          </section>

        </div>

        {/* ================= ADD LOCATION MODAL ================= */}
        <AnimatePresence>
          {showAddModal && (
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
                      ADD NETWORK LOCATION
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Register a new warehouse facility or distribution hub
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="h-8 w-8 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/30 flex items-center justify-center text-sm transition"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddLocation} className="mt-6 space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Facility Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune Central Distribution Center"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                      className="w-full border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        City / Location *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pune"
                        value={newLocation.location}
                        onChange={(e) => setNewLocation({ ...newLocation, location: e.target.value })}
                        className="w-full border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Facility Type
                      </label>
                      <select
                        value={newLocation.type}
                        onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
                        className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none transition"
                      >
                        <option value="WAREHOUSE">WAREHOUSE</option>
                        <option value="DISTRIBUTOR">DISTRIBUTOR</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Capacity
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 75%"
                        value={newLocation.capacity}
                        onChange={(e) => setNewLocation({ ...newLocation, capacity: e.target.value })}
                        className="w-full border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Active Shipments
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 24"
                        value={newLocation.shipments}
                        onChange={(e) => setNewLocation({ ...newLocation, shipments: e.target.value })}
                        className="w-full border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:border-white/30 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-red-600 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 transition shadow-lg shadow-red-600/20"
                    >
                      Add Location
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


/* ================= STAT ================= */

function Stat({ number, title, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="border border-white/10 bg-[#090909] p-6"
    >

      <p className="text-3xl font-bold">
        {number}
      </p>

      <p className="mt-3 text-[10px] font-bold tracking-[0.2em] text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-slate-600">
        {subtitle}
      </p>

    </motion.div>
  );
}


/* ================= FLOW NODE ================= */

function FlowNode({ title, subtitle }) {
  return (
    <div className="border border-white/10 bg-black/30 p-5 text-center">

      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-red-500/40 bg-red-500/5">

        <div className="h-2 w-2 rounded-full bg-red-500" />

      </div>

      <p className="mt-3 text-sm font-bold">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-slate-600">
        {subtitle}
      </p>

    </div>
  );
}


/* ================= FLOW ARROW ================= */

function FlowArrow() {
  return (
    <div className="hidden text-center text-xl text-red-500 md:block">
      →
    </div>
  );
}

export default AdminNetwork;