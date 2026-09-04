import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";

const monthlyData = [
  { month: "JAN", shipments: 180 },
  { month: "FEB", shipments: 230 },
  { month: "MAR", shipments: 210 },
  { month: "APR", shipments: 290 },
  { month: "MAY", shipments: 340 },
  { month: "JUN", shipments: 390 },
];

const locations = [
  {
    name: "Delhi",
    shipments: 186,
    delivered: 172,
    rate: "92%",
  },
  {
    name: "Jaipur",
    shipments: 142,
    delivered: 129,
    rate: "91%",
  },
  {
    name: "Mumbai",
    shipments: 214,
    delivered: 202,
    rate: "94%",
  },
  {
    name: "Udaipur",
    shipments: 98,
    delivered: 91,
    rate: "93%",
  },
];

function AdminAnalytics() {
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
              PERFORMANCE ANALYTICS
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Logistics Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor shipment performance and network efficiency.
            </p>

          </motion.div>


          {/* ================= KPI CARDS ================= */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Metric
              value="1,284"
              label="TOTAL SHIPMENTS"
              change="+18.4%"
            />

            <Metric
              value="94.2%"
              label="DELIVERY SUCCESS"
              change="+3.2%"
            />

            <Metric
              value="2.8 DAYS"
              label="AVG DELIVERY TIME"
              change="-12.6%"
            />

            <Metric
              value="97.1%"
              label="NETWORK EFFICIENCY"
              change="+5.8%"
            />

          </div>


          {/* ================= CHART ================= */}

          <section className="mt-6 border border-white/10 bg-[#090909]">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                  SHIPMENT ACTIVITY
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Monthly Shipments
                </h2>

              </div>

              <span className="text-[10px] text-slate-600">
                LAST 6 MONTHS
              </span>

            </div>


            <div className="p-6">

              <div className="flex h-[280px] items-end gap-3 border-b border-l border-white/10 px-4 pb-0 md:gap-8">

                {monthlyData.map((item, index) => {

                  const height = `${(item.shipments / 400) * 100}%`;

                  return (
                    <div
                      key={item.month}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >

                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.1,
                        }}
                        className="
                          relative
                          w-full
                          max-w-[70px]
                          bg-red-500/80
                          transition
                          hover:bg-red-500
                        "
                      >

                        <span
                          className="
                            absolute
                            -top-6
                            left-1/2
                            -translate-x-1/2
                            text-[10px]
                            text-slate-400
                          "
                        >
                          {item.shipments}
                        </span>

                      </motion.div>

                      <span className="mt-3 text-[10px] text-slate-600">
                        {item.month}
                      </span>

                    </div>
                  );
                })}

              </div>

            </div>

          </section>


          {/* ================= TWO COLUMNS ================= */}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">


            {/* DELIVERY PERFORMANCE */}

            <section className="border border-white/10 bg-[#090909]">

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                  DELIVERY PERFORMANCE
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Delivery Status
                </h2>

              </div>


              <div className="space-y-6 p-6">

                <ProgressRow
                  label="Delivered"
                  value="94%"
                  width="94%"
                />

                <ProgressRow
                  label="In Transit"
                  value="68%"
                  width="68%"
                />

                <ProgressRow
                  label="Out for Delivery"
                  value="42%"
                  width="42%"
                />

                <ProgressRow
                  label="Pending"
                  value="18%"
                  width="18%"
                />

              </div>

            </section>


            {/* NETWORK PERFORMANCE */}

            <section className="border border-white/10 bg-[#090909]">

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                  NETWORK PERFORMANCE
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Location Performance
                </h2>

              </div>


              <div className="divide-y divide-white/5">

                {locations.map((location) => (

                  <div
                    key={location.name}
                    className="px-6 py-5 transition hover:bg-white/[0.02]"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm font-semibold">
                          {location.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          {location.shipments} shipments
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-sm font-bold text-green-400">
                          {location.rate}
                        </p>

                        <p className="mt-1 text-[9px] text-slate-600">
                          SUCCESS RATE
                        </p>

                      </div>

                    </div>

                    <div className="mt-3 h-1.5 bg-white/5">

                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: location.rate,
                        }}
                      />

                    </div>

                  </div>

                ))}

              </div>

            </section>

          </div>


          {/* ================= INSIGHTS ================= */}

          <section className="mt-6 border border-white/10 bg-[#090909]">

            <div className="border-b border-white/10 px-6 py-5">

              <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                SYSTEM INSIGHTS
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Performance Summary
              </h2>

            </div>


            <div className="grid gap-4 p-6 md:grid-cols-3">

              <Insight
                title="BEST PERFORMING"
                value="Mumbai"
                text="Highest delivery success rate across the network."
              />

              <Insight
                title="FASTEST ROUTE"
                value="Delhi → Jaipur"
                text="Average delivery time is currently 1.8 days."
              />

              <Insight
                title="ATTENTION REQUIRED"
                value="28 Shipments"
                text="Pending shipments require operational review."
              />

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


/* ================= METRIC ================= */

function Metric({ value, label, change }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="border border-white/10 bg-[#090909] p-6"
    >

      <p className="text-3xl font-bold">
        {value}
      </p>

      <p className="mt-3 text-[10px] font-bold tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-[10px] font-semibold text-green-400">
        {change} vs previous period
      </p>

    </motion.div>
  );
}


/* ================= PROGRESS ================= */

function ProgressRow({ label, value, width }) {
  return (
    <div>

      <div className="flex items-center justify-between">

        <span className="text-xs text-slate-400">
          {label}
        </span>

        <span className="text-xs font-semibold">
          {value}
        </span>

      </div>

      <div className="mt-2 h-2 bg-white/5">

        <motion.div
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.8 }}
          className="h-full bg-red-500"
        />

      </div>

    </div>
  );
}


/* ================= INSIGHT ================= */

function Insight({ title, value, text }) {
  return (
    <div className="border border-white/10 bg-black/20 p-5">

      <p className="text-[9px] font-bold tracking-[0.2em] text-slate-600">
        {title}
      </p>

      <p className="mt-3 text-lg font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>

    </div>
  );
}

export default AdminAnalytics;