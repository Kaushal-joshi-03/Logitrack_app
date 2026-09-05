import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/navigation/Navbar";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";

const initialSampleShipments = [
  {
    id: "LT-10294",
    destination: "Mumbai",
    origin: "Delhi",
    status: "In Transit",
    date: "27 Aug 2026",
    priority: "Express",
    progress: "68%",
  },
  {
    id: "LT-10291",
    destination: "Delhi",
    origin: "Jaipur",
    status: "Delivered",
    date: "26 Aug 2026",
    priority: "Standard",
    progress: "100%",
  },
  {
    id: "LT-10287",
    destination: "Ahmedabad",
    origin: "Delhi",
    status: "Pending",
    date: "25 Aug 2026",
    priority: "Standard",
    progress: "15%",
  },
  {
    id: "LT-10281",
    destination: "Jaipur",
    origin: "Mumbai",
    status: "Delivered",
    date: "24 Aug 2026",
    priority: "Express",
    progress: "100%",
  },
  {
    id: "LT-10275",
    destination: "Bengaluru",
    origin: "Delhi",
    status: "In Transit",
    date: "23 Aug 2026",
    priority: "Urgent",
    progress: "82%",
  },
  {
    id: "LT-10268",
    destination: "Kolkata",
    origin: "Ahmedabad",
    status: "In Transit",
    date: "22 Aug 2026",
    priority: "Standard",
    progress: "45%",
  },
];

function ClientShipments() {
  const { user, token } = useAuth();
  const [shipments, setShipments] = useState(initialSampleShipments);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchShipments() {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/packages/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((p) => ({
            id: p.packageId,
            destination: p.destinationCity,
            origin: p.originCity,
            status:
              p.status === "DELIVERED"
                ? "Delivered"
                : p.status === "REQUEST_CREATED"
                ? "Pending"
                : "In Transit",
            date: new Date(p.createdAt || Date.now()).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            priority: p.priority || "Standard",
            progress:
              p.status === "DELIVERED"
                ? "100%"
                : p.status === "REQUEST_CREATED"
                ? "15%"
                : "60%",
          }));
          setShipments(mapped);
        }
      } catch {
        // keep sample shipments as fallback
      }
    }
    fetchShipments();
  }, [token]);

  const filtered = shipments.filter((s) => {
    const matchFilter =
      filter === "ALL" ||
      (filter === "TRANSIT" && s.status === "In Transit") ||
      (filter === "DELIVERED" && s.status === "Delivered") ||
      (filter === "PENDING" && s.status === "Pending");

    const matchSearch =
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase()) ||
      s.origin.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar showLogout={true} />

      <main
        className="min-h-[calc(100vh-76px)] px-4 py-8 sm:px-6 lg:px-12"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "38px 38px",
        }}
      >
        <div className="mx-auto max-w-[1500px]">
          {/* Back link */}
          <Link
            to="/client"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <span className="text-xl">←</span>
            <span>Back to Client Portal</span>
          </Link>

          {/* Heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.3em] text-red-500">
                CLIENT SHIPMENTS
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                All Shipments
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Complete overview of your active and past deliveries.
              </p>
            </div>

            <Link
              to="/client/create-shipment"
              className="w-fit bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_35px_rgba(239,29,47,0.18)] transition hover:bg-red-600"
            >
              + Create Shipment
            </Link>
          </div>

          {/* Filter / Search Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-white/10 bg-[#090909] p-4">
            <div className="flex flex-wrap gap-2">
              {["ALL", "TRANSIT", "DELIVERED", "PENDING"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                    filter === tab
                      ? "bg-red-500 text-white"
                      : "border border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "TRANSIT" ? "In Transit" : tab}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search shipment ID or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Shipments List */}
          <section className="overflow-hidden border border-white/10 bg-[#090909]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] tracking-wider text-slate-500">
                    <th className="px-6 py-4">SHIPMENT ID</th>
                    <th className="px-6 py-4">ROUTE</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4">PRIORITY</th>
                    <th className="px-6 py-4">DATE</th>
                    <th className="px-6 py-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                        No shipments found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s, index) => (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="hover:bg-white/[0.02] transition"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-white">
                          {s.id}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-300">
                          {s.origin} <span className="text-red-500">→</span> {s.destination}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                              s.status === "Delivered"
                                ? "text-emerald-400"
                                : s.status === "In Transit"
                                ? "text-red-400"
                                : "text-yellow-400"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-400">
                          {s.priority}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {s.date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/tracking?id=${s.id}`}
                            className="inline-block border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:border-red-500/50 hover:text-white"
                          >
                            Track →
                          </Link>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ClientShipments;
