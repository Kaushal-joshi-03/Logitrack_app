import { motion } from "framer-motion";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

function Network() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#050505] dark:text-white">
      <div>
        <Navbar />

        <section className="px-6 py-6 pb-20 lg:px-12">
          <div className="mx-auto max-w-7xl">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-4 text-sm font-bold tracking-[0.3em] text-red-600 dark:text-red-500">
                LOGITRACK NETWORK
              </p>

              <h1 className="text-5xl font-black leading-tight text-slate-900 dark:text-white sm:text-6xl">
                Connected
                <span className="block text-red-500">
                  everywhere.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Connect warehouses, distribution hubs and delivery
                teams through one intelligent logistics network.
              </p>
            </motion.div>

            {/* Network */}
            <div className="relative mt-16 h-[400px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#090909] dark:shadow-none">

              {/* Grid */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-10
                  [background-image:linear-gradient(rgba(15,23,42,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.15)_1px,transparent_1px)]
                  dark:[background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]
                  [background-size:50px_50px]
                "
              />

              {/* Center */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="
                  absolute
                  left-1/2
                  top-1/2
                  z-20
                  flex
                  h-28
                  w-28
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-red-500/40
                  bg-red-500/10
                  shadow-[0_0_60px_rgba(239,29,47,0.2)]
                "
              >
                <div className="h-4 w-4 rounded-full bg-red-500" />
              </motion.div>

              {/* Lines */}
              <div className="absolute left-[35%] top-[38%] h-px w-[180px] rotate-[20deg] bg-red-500/40" />

              <div className="absolute left-[34%] top-[55%] h-px w-[180px] rotate-[-20deg] bg-red-500/40" />

              <div className="absolute left-[53%] top-[42%] h-px w-[180px] rotate-[-20deg] bg-red-500/40" />

              <div className="absolute left-[53%] top-[58%] h-px w-[180px] rotate-[20deg] bg-red-500/40" />

              {/* Cities */}
              <City
                name="DELHI"
                type="NATIONAL HUB"
                top="15%"
                left="48%"
              />

              <City
                name="JAIPUR"
                type="REGIONAL HUB"
                top="40%"
                left="25%"
              />

              <City
                name="MUMBAI"
                type="DISTRIBUTION"
                top="68%"
                left="25%"
              />

              <City
                name="BENGALURU"
                type="REGIONAL HUB"
                top="68%"
                left="68%"
              />

              <City
                name="KOLKATA"
                type="DISTRIBUTION"
                top="40%"
                left="78%"
              />

              {/* Status */}
              <div className="
                absolute
                bottom-5
                left-5
                flex
                items-center
                gap-3
                rounded-lg
                border
                border-slate-200
                bg-white/95
                px-4
                py-3
                shadow-sm
                dark:border-white/10
                dark:bg-black/70
                dark:shadow-none
              ">
                <span className="h-2 w-2 rounded-full bg-red-500" />

                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  NETWORK STATUS
                </span>

                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  OPERATIONAL
                </span>
              </div>

            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

              <Stat value="42+" label="ACTIVE HUBS" />

              <Stat value="18K+" label="DAILY SHIPMENTS" />

              <Stat value="99.9%" label="NETWORK UPTIME" />

              <Stat value="24/7" label="LIVE MONITORING" />

            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}


/* =========================
   CITY
========================= */

function City({ name, type, top, left }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute z-30"
      style={{
        top: top,
        left: left,
      }}
    >
      <div className="flex flex-col items-center">

        <div className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-red-500/40
          bg-white
          shadow-sm
          dark:bg-[#0b0b0b]
          dark:shadow-none
        ">
          <div className="h-2 w-2 rounded-full bg-red-500" />
        </div>

        <p className="mt-3 text-xs font-bold tracking-[0.15em] text-slate-900 dark:text-white">
          {name}
        </p>

        <p className="mt-1 whitespace-nowrap text-[9px] font-bold text-slate-600 dark:text-slate-400">
          {type}
        </p>

      </div>
    </motion.div>
  );
}


/* =========================
   STAT
========================= */

function Stat({ value, label }) {
  return (
    <div className="
      rounded-xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
      dark:border-white/10
      dark:bg-white/[0.02]
      dark:shadow-none
    ">
      <p className="text-3xl font-black text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="
        mt-2
        text-[9px]
        font-bold
        tracking-[0.2em]
        text-slate-600
        dark:text-slate-400
      ">
        {label}
      </p>
    </div>
  );
}

export default Network;