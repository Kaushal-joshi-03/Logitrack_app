import { motion } from "framer-motion";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

const services = [
  {
    number: "01",
    title: "Shipment Management",
    description:
      "Create, manage and monitor shipments from a single intelligent workspace.",
  },
  {
    number: "02",
    title: "Real-Time Tracking",
    description:
      "Follow every package through warehouse, distributor and delivery stages.",
  },
  {
    number: "03",
    title: "Warehouse Operations",
    description:
      "Handle incoming packages, intake scanning and distributor assignment.",
  },
];

function Services() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#050505] dark:text-white">

      <div>
        <Navbar />

        <main className="mx-auto w-full max-w-[1400px] px-8 py-20">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="mb-5 text-xs font-bold tracking-[0.35em] text-[#ff2438]">
              LOGISTICS SERVICES
            </div>

            <h1 className="text-5xl font-black leading-tight text-slate-900 transition-colors duration-200 dark:text-white md:text-7xl">
              Everything you need to
              <span className="block text-[#ff2438]">
                move smarter.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 transition-colors duration-200 dark:text-slate-400">
              From shipment creation to final delivery, LogiTrack connects
              every stage of your logistics operation.
            </p>
          </motion.div>


          {/* SERVICES */}
          <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-3">

            {services.map((service, index) => (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-8
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-red-500/40
                  hover:shadow-md
                  dark:border-white/10
                  dark:bg-[#0b0b0b]
                  dark:shadow-none
                  dark:hover:border-red-500/30
                "
              >

                <div className="flex items-center justify-between">

                  <span className="text-xs font-bold tracking-[0.25em] text-slate-400 transition-colors duration-200 dark:text-slate-500">
                    {service.number}
                  </span>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-slate-200
                      bg-slate-100
                      text-[#ff2438]
                      transition-colors
                      duration-200
                      dark:border-white/10
                      dark:bg-[#151515]
                      dark:text-[#ff2438]
                    "
                  >
                    ◇
                  </div>

                </div>


                <div className="mt-20">

                  <h2 className="text-xl font-bold text-slate-900 transition-colors duration-200 dark:text-white">
                    {service.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-600 transition-colors duration-200 dark:text-slate-500">
                    {service.description}
                  </p>

                </div>

              </motion.div>
            ))}

          </div>

        </main>
      </div>

      <Footer />

    </div>
  );
}

export default Services;