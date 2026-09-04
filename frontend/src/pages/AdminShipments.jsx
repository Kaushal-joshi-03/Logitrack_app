import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/navigation/Navbar";

const shipments = [
  {
    id: "PKG-10294",
    client: "Rahul Sharma",
    origin: "Delhi",
    destination: "Mumbai",
    status: "IN TRANSIT",
    progress: "68%",
  },
  {
    id: "PKG-10291",
    client: "Amit Verma",
    origin: "Jaipur",
    destination: "Delhi",
    status: "DELIVERED",
    progress: "100%",
  },
  {
    id: "PKG-10287",
    client: "Priya Singh",
    origin: "Ahmedabad",
    destination: "Udaipur",
    status: "OUT FOR DELIVERY",
    progress: "86%",
  },
  {
    id: "PKG-10281",
    client: "Neha Gupta",
    origin: "Mumbai",
    destination: "Pune",
    status: "PENDING",
    progress: "15%",
  },
];

function AdminShipments() {
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
              SHIPMENT MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              All Shipments
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor and manage shipments across the entire LogiTrack network.
            </p>

          </motion.div>


          {/* ================= STATS ================= */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Stat
              number="342"
              title="TOTAL"
            />

            <Stat
              number="186"
              title="IN TRANSIT"
            />

            <Stat
              number="128"
              title="DELIVERED"
            />

            <Stat
              number="28"
              title="PENDING"
            />

          </div>


          {/* ================= SHIPMENT TABLE ================= */}

          <section className="mt-6 overflow-hidden border border-white/10 bg-[#090909]">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                  LIVE SHIPMENTS
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Shipment Overview
                </h2>

              </div>

              <button
                type="button"
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
                Export
              </button>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead>

                  <tr className="border-b border-white/10 text-left">

                    <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                      SHIPMENT
                    </th>

                    <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                      CLIENT
                    </th>

                    <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                      ROUTE
                    </th>

                    <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                      STATUS
                    </th>

                    <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                      PROGRESS
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {shipments.map((shipment, index) => (

                    <motion.tr
                      key={shipment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.08 }}
                      className="
                        border-b
                        border-white/5
                        transition
                        hover:bg-white/[0.02]
                      "
                    >

                      {/* ID */}

                      <td className="px-6 py-5">

                        <p className="text-sm font-semibold">
                          {shipment.id}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          Active shipment
                        </p>

                      </td>


                      {/* CLIENT */}

                      <td className="px-6 py-5">

                        <p className="text-sm text-slate-300">
                          {shipment.client}
                        </p>

                      </td>


                      {/* ROUTE */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-xs">

                          <span className="text-slate-300">
                            {shipment.origin}
                          </span>

                          <span className="text-red-500">
                            →
                          </span>

                          <span className="text-slate-300">
                            {shipment.destination}
                          </span>

                        </div>

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <StatusBadge status={shipment.status} />

                      </td>


                      {/* PROGRESS */}

                      <td className="px-6 py-5">

                        <div className="w-[150px]">

                          <div className="flex justify-between">

                            <span className="text-[10px] text-slate-600">
                              DELIVERY
                            </span>

                            <span className="text-[10px] text-slate-400">
                              {shipment.progress}
                            </span>

                          </div>

                          <div className="mt-2 h-1.5 bg-white/5">

                            <div
                              className="h-full bg-red-500"
                              style={{
                                width: shipment.progress,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                    </motion.tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>


          {/* ================= ROUTE MONITOR ================= */}

          <section className="mt-6 border border-white/10 bg-[#090909]">

            <div className="border-b border-white/10 px-6 py-5">

              <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                NETWORK MONITOR
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Active Shipment Flow
              </h2>

            </div>


            <div className="grid gap-4 p-6 md:grid-cols-3">

              <NetworkCard
                city="DELHI"
                type="ORIGIN HUB"
                shipments="86"
              />

              <NetworkCard
                city="JAIPUR"
                type="DISTRIBUTION"
                shipments="64"
              />

              <NetworkCard
                city="MUMBAI"
                type="DESTINATION HUB"
                shipments="92"
              />

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


/* ================= STAT ================= */

function Stat({ number, title }) {
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

    </motion.div>
  );
}


/* ================= STATUS ================= */

function StatusBadge({ status }) {

  let classes = "bg-red-500/10 text-red-400";

  if (status === "DELIVERED") {
    classes = "bg-green-500/10 text-green-400";
  }

  if (status === "PENDING") {
    classes = "bg-yellow-500/10 text-yellow-400";
  }

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-1.5
        text-[10px]
        font-bold
        ${classes}
      `}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {status}
    </span>
  );
}


/* ================= NETWORK CARD ================= */

function NetworkCard({ city, type, shipments }) {
  return (
    <div className="border border-white/10 bg-black/20 p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-lg font-bold">
            {city}
          </p>

          <p className="mt-1 text-[10px] tracking-wider text-slate-600">
            {type}
          </p>

        </div>

        <span className="h-2 w-2 rounded-full bg-green-400" />

      </div>

      <div className="mt-5">

        <p className="text-[10px] text-slate-600">
          ACTIVE SHIPMENTS
        </p>

        <p className="mt-1 text-2xl font-bold">
          {shipments}
        </p>

      </div>

    </div>
  );
}

export default AdminShipments;