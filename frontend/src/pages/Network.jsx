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
            <div className="relative mt-16 h-[460px] sm:h-[440px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#090909] dark:shadow-none">

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
                  top-[44%]
                  sm:top-[48%]
                  z-20
                  flex
                  h-20
                  w-20
                  sm:h-28
                  sm:w-28
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-red-500/40
                  bg-red-500/10
                  shadow-[0_0_40px_rgba(239,29,47,0.18)]
                  sm:shadow-[0_0_60px_rgba(239,29,47,0.2)]
                "
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-red-500 animate-sonar-ripple pointer-events-none" />
                  <span className="relative h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-red-500 animate-heartbeat-pulse" />
                </div>
              </motion.div>

              {/* Lines - Mobile (SVG Radial Spoke Network) */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none sm:hidden" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="50" y1="44" x2="50" y2="12" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="44" x2="18" y2="34" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="44" x2="82" y2="34" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="44" x2="22" y2="60" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="44" x2="78" y2="60" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>

              {/* Lines - Desktop (SVG Radial Spoke Network) */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none hidden sm:block" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="50" y1="48" x2="50" y2="17" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="48" x2="22" y2="38" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="48" x2="78" y2="38" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="48" x2="26" y2="69" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="48" x2="74" y2="69" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>

              {/* Cities */}
              <City
                name="DELHI"
                type="NATIONAL HUB"
                className="top-[8%] sm:top-[12%] left-1/2 -translate-x-1/2"
              />

              <City
                name="JAIPUR"
                type="REGIONAL HUB"
                className="top-[30%] sm:top-[34%] left-[18%] sm:left-[22%] -translate-x-1/2"
              />

              <City
                name="MUMBAI"
                type="DISTRIBUTION"
                className="top-[56%] sm:top-[64%] left-[22%] sm:left-[26%] -translate-x-1/2"
              />

              <City
                name="BENGALURU"
                type="REGIONAL HUB"
                className="top-[56%] sm:top-[64%] left-[78%] sm:left-[74%] -translate-x-1/2"
              />

              <City
                name="KOLKATA"
                type="DISTRIBUTION"
                className="top-[30%] sm:top-[34%] left-[82%] sm:left-[78%] -translate-x-1/2"
              />

              {/* Status */}
              <div className="
                absolute
                bottom-4
                sm:bottom-5
                left-1/2
                -translate-x-1/2
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200/80
                bg-white/95
                backdrop-blur-sm
                px-5
                py-2.5
                sm:py-3
                shadow-sm
                dark:border-white/10
                dark:bg-black/80
                dark:shadow-none
                whitespace-nowrap
              ">
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-2 w-2 rounded-full bg-red-500 animate-sonar-ripple pointer-events-none" />
                  <span className="relative h-2 w-2 rounded-full bg-red-500 animate-heartbeat-pulse" />
                </div>

                <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400">
                  NETWORK STATUS
                </span>

                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-900 dark:text-white">
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

function City({ name, type, top, left, className = "", style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`absolute z-30 ${className}`}
      style={{
        ...(top ? { top } : {}),
        ...(left ? { left } : {}),
        ...style,
      }}
    >
      <div className="flex flex-col items-center">

        <div className="
          flex
          h-9
          w-9
          sm:h-12
          sm:w-12
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
          <div className="relative flex items-center justify-center">
            <span className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500 animate-sonar-ripple pointer-events-none" />
            <span className="relative h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500 animate-heartbeat-pulse" />
          </div>
        </div>

        <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-bold tracking-[0.12em] sm:tracking-[0.15em] text-slate-900 dark:text-white">
          {name}
        </p>

        <p className="mt-0.5 sm:mt-1 whitespace-nowrap text-[8px] sm:text-[9px] font-bold text-slate-600 dark:text-slate-400">
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