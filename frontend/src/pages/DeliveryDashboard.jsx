import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/navigation/Navbar";
import { useAuth } from "../context/AuthContext";

const INITIAL_DELIVERIES = [
  {
    id: "PKG-10294",
    customer: "Rahul Sharma",
    destination: "Mumbai",
    status: "OUT FOR DELIVERY",
    time: "Today, 6:40 PM",
  },
  {
    id: "PKG-10291",
    customer: "Amit Verma",
    destination: "Delhi",
    status: "DELIVERED",
    time: "Today, 2:15 PM",
  },
  {
    id: "PKG-10287",
    customer: "Priya Singh",
    destination: "Jaipur",
    status: "PICKED UP",
    time: "Today, 5:20 PM",
  },
  {
    id: "PKG-10281",
    customer: "Neha Gupta",
    destination: "Udaipur",
    status: "OUT FOR DELIVERY",
    time: "Today, 7:10 PM",
  },
];

function DeliveryDashboard() {
  const { user } = useAuth();
  const [deliveryList, setDeliveryList] = useState(() => {
    const saved = localStorage.getItem("logitrack_agent_deliveries");
    if (saved) {
      try {
        return JSON.parse(saved).slice(0, 4);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DELIVERIES;
  });

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState("PKG-10294");
  const [targetStatus, setTargetStatus] = useState("DELIVERED");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    const updated = deliveryList.map((d) =>
      d.id === selectedPkgId ? { ...d, status: targetStatus, time: "Just now" } : d
    );
    setDeliveryList(updated);

    // Persist in local storage
    const saved = localStorage.getItem("logitrack_agent_deliveries");
    if (saved) {
      try {
        const all = JSON.parse(saved);
        const updatedAll = all.map((d) =>
          d.id === selectedPkgId ? { ...d, status: targetStatus, time: "Just now" } : d
        );
        localStorage.setItem("logitrack_agent_deliveries", JSON.stringify(updatedAll));
      } catch (err) {
        // ignore
      }
    }

    toast.success(`Package ${selectedPkgId} updated to ${targetStatus}!`);
    setShowUpdateModal(false);
    setDeliveryNotes("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= HEADER ================= */}
      <Navbar showLogout={true} />


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


          {/* HEADING */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >

            <p className="mb-2 text-xs font-bold tracking-[0.3em] text-red-500">
              DELIVERY OPERATIONS
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Welcome Back{user?.name ? ` ${user.name}` : ""}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your assigned deliveries and update shipment status.
            </p>

          </motion.div>


          {/* ================= STATS ================= */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              number="18"
              title="TODAY'S DELIVERIES"
              subtitle="Assigned to you"
            />

            <StatCard
              number="07"
              title="OUT FOR DELIVERY"
              subtitle="Currently on route"
            />

            <StatCard
              number="09"
              title="DELIVERED"
              subtitle="Completed today"
            />

            <StatCard
              number="02"
              title="PENDING"
              subtitle="Awaiting pickup"
            />

          </div>


          {/* ================= CONTENT ================= */}

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">


            {/* DELIVERY QUEUE */}

            <section className="overflow-hidden border border-white/10 bg-[#090909]">

              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                    DELIVERY QUEUE
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Assigned Shipments
                  </h2>

                </div>

                <Link
                  to="/delivery/deliveries"
                  className="text-xs text-slate-500 transition hover:text-white"
                >
                  View All →
                </Link>

              </div>


              <div className="divide-y divide-white/10">

                {deliveryList.map((delivery, index) => (

                  <motion.div
                    key={delivery.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="px-6 py-5"
                  >

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                      {/* PACKAGE */}

                      <div>

                        <p className="text-sm font-semibold">
                          {delivery.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {delivery.customer}
                        </p>

                      </div>


                      {/* DESTINATION */}

                      <div>

                        <p className="text-[10px] tracking-wider text-slate-600">
                          DESTINATION
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          {delivery.destination}
                        </p>

                      </div>


                      {/* STATUS */}

                      <div>

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            text-[10px]
                            font-bold
                            ${delivery.status === "DELIVERED"
                              ? "bg-green-500/10 text-green-400"
                              : delivery.status === "PICKED UP"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-red-500/10 text-red-400"
                            }
                          `}
                        >

                          <span className="h-1.5 w-1.5 rounded-full bg-current" />

                          {delivery.status}

                        </span>

                      </div>


                      {/* TIME */}

                      <div className="text-left md:text-right">

                        <p className="text-[10px] text-slate-600">
                          ETA
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {delivery.time}
                        </p>

                      </div>

                    </div>

                  </motion.div>

                ))}

              </div>

            </section>


            {/* CURRENT ROUTE */}

            <section className="border border-white/10 bg-[#090909]">

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                  ACTIVE ROUTE
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Today's Route
                </h2>

              </div>


              <div className="p-6">


                {/* ROUTE */}

                <div className="relative">

                  <div className="absolute left-[9px] top-5 h-[calc(100%-40px)] w-px bg-red-500/30" />


                  <RoutePoint
                    number="01"
                    place="Distribution Hub"
                    detail="09:10 AM"
                  />

                  <RoutePoint
                    number="02"
                    place="Mumbai Central"
                    detail="12:30 PM"
                  />

                  <RoutePoint
                    number="03"
                    place="Andheri East"
                    detail="03:45 PM"
                  />

                  <RoutePoint
                    number="04"
                    place="Final Delivery"
                    detail="06:40 PM"
                  />

                </div>


                {/* DISTANCE */}

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="border border-white/10 bg-black/30 p-4">

                    <p className="text-[10px] text-slate-600">
                      DISTANCE
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      42.8 KM
                    </p>

                  </div>

                  <div className="border border-white/10 bg-black/30 p-4">

                    <p className="text-[10px] text-slate-600">
                      COMPLETED
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      64%
                    </p>

                  </div>

                </div>

              </div>

            </section>

          </div>


          {/* ================= ACTIONS ================= */}

          <section className="mt-6">

            <h2 className="mb-4 text-sm font-semibold">
              Quick Actions
            </h2>

            <div className="grid gap-4 md:grid-cols-3">

              <ActionCard
                title="Update Delivery"
                text="Change the current shipment delivery status."
                onClick={() => setShowUpdateModal(true)}
              />

              <Link to="/delivery/scan" className="block group">
                <div className="border border-white/10 bg-[#090909] p-5 text-left transition group-hover:border-red-500/40 h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Scan Package
                      </h3>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Scan a package barcode and confirm drop.
                      </p>
                    </div>
                    <span className="text-lg text-red-500 group-hover:translate-x-1 transition">
                      →
                    </span>
                  </div>
                </div>
              </Link>

              <ActionCard
                title="Contact Support"
                text="Emergency dispatch contact and incident reporting."
                onClick={() => setShowSupportModal(true)}
              />

            </div>

          </section>


          {/* ================= ONLINE STATUS ================= */}

          <div className="mt-6 flex items-center justify-between border border-white/10 bg-[#090909] px-5 py-4">

            <div className="flex items-center gap-3">

              <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

              <div>

                <p className="text-xs font-semibold text-green-400">
                  DELIVERY AGENT ONLINE
                </p>

                <p className="mt-1 text-[10px] text-slate-600">
                  Your location and delivery status are being updated.
                </p>

              </div>

            </div>

            <span className="text-[10px] text-slate-600">
              LAST SYNC: JUST NOW
            </span>

          </div>

        </div>

        {/* ================= UPDATE STATUS MODAL ================= */}
        <AnimatePresence>
          {showUpdateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md border border-white/10 bg-[#090909] p-6 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    UPDATE DELIVERY STATUS
                  </h3>
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="h-8 w-8 rounded-full border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleUpdateStatus} className="mt-6 space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Select Shipment
                    </label>
                    <select
                      value={selectedPkgId}
                      onChange={(e) => setSelectedPkgId(e.target.value)}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                    >
                      {deliveryList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.id} — {d.customer} ({d.destination})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      New Status
                    </label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value)}
                      className="w-full border border-white/10 bg-[#090909] px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="DELIVERED">DELIVERED (Handover Successful)</option>
                      <option value="OUT FOR DELIVERY">OUT FOR DELIVERY</option>
                      <option value="PICKED UP">PICKED UP (From Hub)</option>
                      <option value="FAILED/ATTEMPTED">FAILED / ATTEMPTED (Customer Not Available)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Delivery Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Handed to customer at door"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUpdateModal(false)}
                      className="px-4 py-2 border border-white/10 text-xs font-semibold uppercase text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-red-600 text-xs font-semibold uppercase text-white hover:bg-red-500 shadow-lg shadow-red-600/20"
                    >
                      Apply Status
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ================= SUPPORT MODAL ================= */}
        <AnimatePresence>
          {showSupportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md border border-white/10 bg-[#090909] p-6 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    DISPATCH CONTROL SUPPORT
                  </h3>
                  <button
                    onClick={() => setShowSupportModal(false)}
                    className="h-8 w-8 rounded-full border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Emergency Fleet Helpline
                    </p>
                    <p className="text-lg font-mono font-bold text-red-500 mt-1">
                      1800-419-LOGI (Toll Free)
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Priority channel for breakdown, route blockage, or immediate customer disputes.
                    </p>
                  </div>

                  <div className="border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Regional Dispatch Hub
                    </p>
                    <p className="text-sm font-semibold text-white mt-1">
                      Western Logistics Command, Bay 4
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Operating Controller: Capt. Rajesh V. (+91 98200 12099)
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSupportModal(false)}
                    className="px-4 py-2 border border-white/10 text-xs font-semibold uppercase text-slate-300 hover:text-white"
                  >
                    Dismiss
                  </button>
                  <a
                    href="tel:18004195644"
                    onClick={() => toast.info("Dialing emergency dispatch line...")}
                    className="px-4 py-2 bg-red-600 text-xs font-semibold uppercase text-white hover:bg-red-500 text-center"
                  >
                    Call Dispatch
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}


/* ================= STAT CARD ================= */

function StatCard({ number, title, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="border border-white/10 bg-[#090909] p-6"
    >

      <div className="flex items-center justify-between">

        <p className="text-3xl font-bold">
          {number}
        </p>

        <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,29,47,0.7)]" />

      </div>

      <p className="mt-4 text-[10px] font-bold tracking-[0.15em] text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">
        {subtitle}
      </p>

    </motion.div>
  );
}


/* ================= ROUTE POINT ================= */

function RoutePoint({ number, place, detail }) {
  return (
    <div className="relative mb-7 flex items-center gap-4">

      <div className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 bg-[#090909]">

        <div className="h-2 w-2 rounded-full bg-red-500" />

      </div>

      <div className="flex w-full items-center justify-between">

        <div>

          <p className="text-sm font-semibold">
            {place}
          </p>

          <p className="mt-1 text-[10px] text-slate-600">
            STOP {number}
          </p>

        </div>

        <span className="text-xs text-slate-500">
          {detail}
        </span>

      </div>

    </div>
  );
}


/* ================= ACTION CARD ================= */

function ActionCard({ title, text, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      type="button"
      onClick={onClick}
      className="
        border
        border-white/10
        bg-[#090909]
        p-5
        text-left
        transition
        hover:border-red-500/40
        w-full
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">
            {title}
          </h3>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {text}
          </p>
        </div>
        <span className="text-lg text-red-500">
          →
        </span>
      </div>
    </motion.button>
  );
}

export default DeliveryDashboard;