import { motion } from "framer-motion";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

const solutions = [
  {
    number: "01",
    title: "End-to-End Visibility",
    text: "Get a complete view of every shipment from the moment it is created until it reaches the customer.",
    tag: "VISIBILITY",
  },
  {
    number: "02",
    title: "Intelligent Routing",
    text: "Connect warehouses, regional hubs and delivery personnel through a unified logistics workflow.",
    tag: "ROUTING",
  },
  {
    number: "03",
    title: "Operational Control",
    text: "Give every logistics role the tools they need to process, assign and complete shipments.",
    tag: "CONTROL",
  },
  {
    number: "04",
    title: "Real-Time Intelligence",
    text: "Monitor shipment activity, delivery progress and operational metrics from one platform.",
    tag: "INTELLIGENCE",
  },
];

function Solutions() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#050505] dark:text-white">

      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative flex min-h-[calc(100vh-76px)] items-center px-6 py-20 lg:px-12">

        {/* Background glow */}
        <div className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-red-500/[0.06]
          blur-[120px]
        " />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            <div className="
              mb-6
              inline-flex
              border
              border-red-500/20
              bg-red-500/[0.06]
              px-4
              py-2
              text-xs
              font-semibold
              tracking-[0.25em]
              text-red-600
              dark:text-red-500
            ">
              LOGITRACK SOLUTIONS
            </div>

            <h1 className="
              max-w-3xl
              text-5xl
              font-black
              leading-[1.05]
              tracking-tight
              text-slate-900
              dark:text-white
              sm:text-6xl
              lg:text-7xl
            ">
              One platform.
              <br />

              <span className="text-red-500">
                Every logistics move.
              </span>
            </h1>

            <p className="
              mt-7
              max-w-xl
              text-base
              leading-8
              text-slate-600
              dark:text-slate-300
              sm:text-lg
            ">
              LogiTrack connects clients, warehouses, distributors and
              delivery teams into one intelligent logistics network.
            </p>

          </motion.div>


          {/* RIGHT — PIPELINE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
          >

            <div className="
              relative
              mx-auto
              max-w-[500px]
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-8
              shadow-sm
              backdrop-blur-xl
              dark:border-white/10
              dark:bg-white/[0.025]
              dark:shadow-none
            ">

              <div className="mb-8 flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold tracking-[0.25em] text-slate-600 dark:text-slate-400">
                    LOGISTICS NETWORK
                  </p>

                  <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    Shipment Flow
                  </p>
                </div>

                <div className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-red-500/30
                  bg-red-500/10
                  text-red-600
                  dark:text-red-500
                ">
                  ●
                </div>

              </div>


              {/* Pipeline */}
              <div className="relative">

                <div className="
                  absolute
                  left-[20px]
                  top-5
                  h-[calc(100%-40px)]
                  w-px
                  bg-gradient-to-b
                  from-red-500
                  via-red-500/50
                  to-slate-200
                  dark:to-white/10
                " />

                <PipelineItem
                  title="Shipment Created"
                  subtitle="Client"
                  active
                />

                <PipelineItem
                  title="Package Received"
                  subtitle="Warehouse"
                  active
                />

                <PipelineItem
                  title="Hub Processing"
                  subtitle="Distributor"
                  active
                />

                <PipelineItem
                  title="Out for Delivery"
                  subtitle="Courier"
                  active
                />

                <PipelineItem
                  title="Delivered"
                  subtitle="Customer"
                  last
                />

              </div>

            </div>

          </motion.div>

        </div>
      </section>


      {/* =====================================================
          SOLUTIONS GRID
      ===================================================== */}

      <section className="border-t border-slate-200 bg-white px-6 py-28 transition-colors duration-200 dark:border-white/10 dark:bg-[#080808] lg:px-12">

        <div className="mx-auto max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >

            <p className="
              mb-4
              text-xs
              font-bold
              tracking-[0.3em]
              text-red-600
              dark:text-red-500
            ">
              BUILT FOR LOGISTICS
            </p>

            <h2 className="
              max-w-3xl
              text-4xl
              font-bold
              text-slate-900
              dark:text-white
              sm:text-5xl
            ">
              Solutions designed around
              <span className="text-red-500"> your operation.</span>
            </h2>

          </motion.div>


          <div className="grid gap-5 md:grid-cols-2">

            {solutions.map((solution, index) => (
              <SolutionCard
                key={solution.number}
                solution={solution}
                index={index}
              />
            ))}

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}


/* ============================================================
   PIPELINE ITEM
============================================================ */

function PipelineItem({ title, subtitle, active, last }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative flex items-center gap-5 py-4"
    >

      <div
        className={`
          relative
          z-10
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          ${active
            ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-500"
            : "border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400"
          }
        `}
      >
        <div
          className={`
            h-2
            w-2
            rounded-full
            ${active ? "bg-red-500" : "bg-slate-400 dark:bg-slate-600"}
          `}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

    </motion.div>
  );
}


/* ============================================================
   SOLUTION CARD
============================================================ */

function SolutionCard({ solution, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
      }}
      whileHover={{ y: -6 }}
      className="
        group
        relative
        min-h-[260px]
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-8
        shadow-sm
        transition-all
        duration-300
        hover:border-red-500/30
        hover:shadow-md
        dark:border-white/10
        dark:bg-white/[0.02]
        dark:shadow-none
        dark:hover:bg-white/[0.04]
      "
    >

      {/* Glow */}
      <div className="
        pointer-events-none
        absolute
        -right-20
        -top-20
        h-48
        w-48
        rounded-full
        bg-red-500/10
        blur-3xl
        transition
        duration-500
        group-hover:bg-red-500/20
      " />

      <div className="relative flex items-center justify-between">

        <span className="
          text-xs
          font-bold
          tracking-[0.25em]
          text-slate-500
          dark:text-slate-400
        ">
          {solution.number}
        </span>

        <span className="
          border
          border-red-500/20
          bg-red-500/[0.06]
          px-3
          py-1
          text-[9px]
          font-bold
          tracking-[0.2em]
          text-red-600
          dark:text-red-500
        ">
          {solution.tag}
        </span>

      </div>


      <div className="relative mt-16">

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          {solution.title}
        </h3>

        <p className="
          mt-4
          max-w-xl
          text-sm
          leading-7
          text-slate-600
          dark:text-slate-300
        ">
          {solution.text}
        </p>

      </div>


      {/* Animated bottom line */}
      <div className="
        absolute
        bottom-0
        left-0
        h-[2px]
        w-0
        bg-red-500
        transition-all
        duration-500
        group-hover:w-full
      " />

    </motion.div>
  );
}

export default Solutions;