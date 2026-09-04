import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import { useAuth } from "../context/AuthContext";

const deliveries = [
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

                <button
                  type="button"
                  className="text-xs text-slate-500 transition hover:text-white"
                >
                  View All →
                </button>

              </div>


              <div className="divide-y divide-white/10">

                {deliveries.map((delivery, index) => (

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
              />

              <ActionCard
                title="Scan Package"
                text="Scan a package and update its location."
              />

              <ActionCard
                title="Contact Support"
                text="Get assistance with delivery issues."
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

function ActionCard({ title, text }) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      type="button"
      className="
        border
        border-white/10
        bg-[#090909]
        p-5
        text-left
        transition
        hover:border-red-500/40
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