import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../components/navigation/Navbar";

const INITIAL_DELIVERIES = [
  {
    id: "PKG-10294",
    customer: "Rahul Sharma",
    phone: "+91 98201 44102",
    destination: "Flat 402, Sea Breeze Apts, Bandra West, Mumbai",
    city: "Mumbai",
    status: "OUT FOR DELIVERY",
    time: "Today, 6:40 PM",
    itemType: "Express Electronics (2.4 kg)",
    podRequired: true,
  },
  {
    id: "PKG-10291",
    customer: "Amit Verma",
    phone: "+91 99100 88219",
    destination: "B-14, Connaught Place, New Delhi",
    city: "Delhi",
    status: "DELIVERED",
    time: "Today, 2:15 PM",
    itemType: "Document Parcel (0.3 kg)",
    podRequired: true,
  },
  {
    id: "PKG-10287",
    customer: "Priya Singh",
    phone: "+91 97841 00392",
    destination: "Villa 12, Rosewood Enclave, C-Scheme, Jaipur",
    city: "Jaipur",
    status: "PICKED UP",
    time: "Today, 5:20 PM",
    itemType: "Apparel & Garments (1.8 kg)",
    podRequired: false,
  },
  {
    id: "PKG-10281",
    customer: "Neha Gupta",
    phone: "+91 98290 55112",
    destination: "78 Lakeview Road, Fatehpura, Udaipur",
    city: "Udaipur",
    status: "OUT FOR DELIVERY",
    time: "Today, 7:10 PM",
    itemType: "Home Decor (4.1 kg)",
    podRequired: true,
  },
  {
    id: "PKG-10270",
    customer: "Suresh Menon",
    phone: "+91 94471 22891",
    destination: "Plot 22, Koramangala 4th Block, Bengaluru",
    city: "Bengaluru",
    status: "OUT FOR DELIVERY",
    time: "Today, 8:00 PM",
    itemType: "Office Equipment (5.0 kg)",
    podRequired: true,
  },
  {
    id: "PKG-10265",
    customer: "Ananya Roy",
    phone: "+91 98300 77123",
    destination: "Salt Lake Sector V, Kolkata",
    city: "Kolkata",
    status: "FAILED/ATTEMPTED",
    time: "Today, 1:30 PM",
    itemType: "Books & Stationeries (1.2 kg)",
    podRequired: false,
  },
];

function DeliveryList() {
  const [deliveries, setDeliveries] = useState(() => {
    const saved = localStorage.getItem("logitrack_agent_deliveries");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DELIVERIES;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [statusUpdatePkg, setStatusUpdatePkg] = useState(null);
  const [newStatus, setNewStatus] = useState("DELIVERED");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const saveDeliveries = (updated) => {
    setDeliveries(updated);
    localStorage.setItem("logitrack_agent_deliveries", JSON.stringify(updated));
  };

  const handleMarkDelivered = (pkgId) => {
    const updated = deliveries.map((d) =>
      d.id === pkgId ? { ...d, status: "DELIVERED", time: "Just now" } : d
    );
    saveDeliveries(updated);
    toast.success(`Package ${pkgId} marked as DELIVERED!`);
  };

  const handleApplyStatusUpdate = (e) => {
    e.preventDefault();
    if (!statusUpdatePkg) return;
    const updated = deliveries.map((d) =>
      d.id === statusUpdatePkg.id
        ? {
            ...d,
            status: newStatus,
            time: newStatus === "DELIVERED" ? "Just now" : d.time,
            notes: deliveryNotes || d.notes,
          }
        : d
    );
    saveDeliveries(updated);
    toast.success(`Delivery status for ${statusUpdatePkg.id} updated to ${newStatus}`);
    setStatusUpdatePkg(null);
    setDeliveryNotes("");
  };

  const filtered = deliveries.filter((d) => {
    const matchesFilter =
      filter === "ALL" || d.status.toUpperCase() === filter.toUpperCase();
    const q = search.toLowerCase();
    const matchesSearch =
      d.id.toLowerCase().includes(q) ||
      d.customer.toLowerCase().includes(q) ||
      d.destination.toLowerCase().includes(q) ||
      d.phone.includes(q);
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
          {/* BACK & ACTIONS */}
          <div className="flex items-center justify-between">
            <Link
              to="/delivery"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
            >
              <span className="text-xl">←</span>
              Back to Delivery Dashboard
            </Link>

            <Link
              to="/delivery/scan"
              className="bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 transition shadow-lg shadow-red-600/20"
            >
              Scan Package
            </Link>
          </div>

          {/* HEADER */}
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-red-500">
                LAST-MILE FULFILLMENT
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                Assigned Deliveries
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Manage your assigned delivery drops, recipient addresses, and proof-of-delivery receipts.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {filtered.length} DELIVERIES ON ROSTER
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border border-white/10 bg-[#090909] p-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search package ID, customer name, street address, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-white/10 bg-black/40 px-4 py-2.5 pl-9 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                🔍
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {["ALL", "OUT FOR DELIVERY", "DELIVERED", "PICKED UP", "FAILED/ATTEMPTED"].map(
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

          {/* DELIVERIES LIST */}
          <div className="mt-6 overflow-hidden border border-white/10 bg-[#090909]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] tracking-wider text-slate-500 uppercase bg-white/[0.01]">
                    <th className="px-6 py-4">Package ID</th>
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Destination Address</th>
                    <th className="px-6 py-4">Package Spec</th>
                    <th className="px-6 py-4">Schedule / ETA</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        No deliveries found matching your search.
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
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-white">{item.customer}</p>
                          <p className="text-xs text-slate-400 font-mono">{item.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-300 max-w-[260px]">
                          {item.destination}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {item.itemType}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                          {item.time}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold tracking-wider rounded ${
                              item.status === "DELIVERED"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : item.status === "PICKED UP"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : item.status === "FAILED/ATTEMPTED"
                                ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.status === "DELIVERED"
                                  ? "bg-emerald-400"
                                  : item.status === "PICKED UP"
                                  ? "bg-amber-400"
                                  : item.status === "FAILED/ATTEMPTED"
                                  ? "bg-slate-400"
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
                              onClick={() => {
                                setStatusUpdatePkg(item);
                                setNewStatus(item.status);
                              }}
                              className="border border-white/10 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-white/30 transition"
                            >
                              Update
                            </button>
                            {item.status !== "DELIVERED" && (
                              <button
                                type="button"
                                onClick={() => handleMarkDelivered(item.id)}
                                className="bg-emerald-600/90 hover:bg-emerald-500 px-2.5 py-1 text-xs text-white font-medium transition shadow-sm"
                              >
                                Delivered ✓
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

        {/* STATUS UPDATE MODAL */}
        <AnimatePresence>
          {statusUpdatePkg && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md border border-white/10 bg-[#090909] p-6 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-red-500">
                      UPDATE DELIVERY STATUS
                    </span>
                    <h3 className="text-lg font-mono font-bold text-white mt-0.5">
                      {statusUpdatePkg.id}
                    </h3>
                  </div>
                  <button
                    onClick={() => setStatusUpdatePkg(null)}
                    className="h-8 w-8 rounded-full border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleApplyStatusUpdate} className="mt-6 space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Target Delivery Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="OUT FOR DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED (Handover Complete)</option>
                      <option value="PICKED UP">PICKED UP (From Distribution Hub)</option>
                      <option value="FAILED/ATTEMPTED">FAILED / ATTEMPTED (Customer Unavailable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Delivery Notes / Proof of Drop
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Handed to security guard / Received by customer Rahul Sharma"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setStatusUpdatePkg(null)}
                      className="px-4 py-2 border border-white/10 text-xs font-semibold uppercase text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-red-600 text-xs font-semibold uppercase text-white hover:bg-red-500 shadow-lg shadow-red-600/20"
                    >
                      Save Status
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

export default DeliveryList;
