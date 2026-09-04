import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";

const network = [
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

              {network.map((item, index) => (

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