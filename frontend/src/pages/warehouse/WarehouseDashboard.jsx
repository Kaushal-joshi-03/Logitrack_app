import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import { useAuth } from "../../context/AuthContext";

function WarehouseDashboard() {
  const { user } = useAuth();
  const stats = [
    {
      title: "TOTAL PACKAGES",
      value: "342",
      subtitle: "Packages received",
    },
    {
      title: "IN WAREHOUSE",
      value: "86",
      subtitle: "Currently stored",
    },
    {
      title: "READY TO DISPATCH",
      value: "42",
      subtitle: "Awaiting pickup",
    },
    {
      title: "DISPATCHED",
      value: "214",
      subtitle: "Sent to distributor",
    },
  ];

  const packages = [
    {
      id: "PKG-10294",
      origin: "Delhi",
      destination: "Mumbai",
      status: "Ready",
      date: "27 Aug 2026",
    },
    {
      id: "PKG-10291",
      origin: "Ahmedabad",
      destination: "Jaipur",
      status: "Stored",
      date: "27 Aug 2026",
    },
    {
      id: "PKG-10287",
      origin: "Delhi",
      destination: "Ahmedabad",
      status: "Dispatched",
      date: "26 Aug 2026",
    },
    {
      id: "PKG-10281",
      origin: "Mumbai",
      destination: "Delhi",
      status: "Stored",
      date: "26 Aug 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <Navbar showLogout={true} />

      <main
        className="
          min-h-[calc(100vh-76px)]
          px-6
          py-8
          lg:px-12
        "
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


          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="mb-2 text-xs font-bold tracking-[0.3em] text-red-500">
                WAREHOUSE CONTROL
              </p>

              <h1 className="text-3xl font-bold md:text-4xl">
                Welcome Back{user?.name ? ` ${user.name}` : ""}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage incoming packages, storage and dispatch operations.
              </p>

            </div>


            <div className="flex gap-3">

             <Link
  to="/warehouse/scan"
  className="
    border
    border-white/10
    px-5
    py-3
    text-sm
    text-slate-300
    transition
    hover:border-red-500/40
    hover:text-white
  "
>
  Scan Package
</Link>

             <Link
  to="/warehouse/receive"
  className="
    bg-red-500
    px-5
    py-3
    text-sm
    font-bold
    text-white
    transition
    hover:bg-red-600
  "
>
  + Receive Package
</Link>

            </div>

          </div>


          {/* STATS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {stats.map((stat, index) => (

              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="
                  border
                  border-white/10
                  bg-[#090909]
                  p-6
                  transition
                  hover:border-red-500/30
                "
              >

                <div className="mb-5 flex items-center justify-between">

                  <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500">
                    {stat.title}
                  </span>

                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-red-500
                      shadow-[0_0_10px_rgba(239,29,47,0.7)]
                    "
                  />

                </div>

                <div className="text-3xl font-bold">
                  {stat.value}
                </div>

                <p className="mt-2 text-xs text-slate-600">
                  {stat.subtitle}
                </p>

              </motion.div>

            ))}

          </div>


          {/* CONTENT */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">


            {/* PACKAGE TABLE */}
            <section className="overflow-hidden border border-white/10 bg-[#090909]">

              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                    WAREHOUSE ACTIVITY
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Recent Packages
                  </h2>

                </div>

                <button
                  type="button"
                  className="text-xs text-slate-500 hover:text-white"
                >
                  View All →
                </button>

              </div>


              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px]">

                  <thead>

                    <tr className="border-b border-white/5 text-left">

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        PACKAGE ID
                      </th>

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        ORIGIN
                      </th>

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        DESTINATION
                      </th>

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        STATUS
                      </th>

                      <th className="px-6 py-4 text-[10px] tracking-wider text-slate-600">
                        DATE
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {packages.map((pkg) => (

                      <tr
                        key={pkg.id}
                        className="
                          border-b
                          border-white/5
                          transition
                          hover:bg-white/[0.02]
                        "
                      >

                        <td className="px-6 py-5 text-sm font-semibold">
                          {pkg.id}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {pkg.origin}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {pkg.destination}
                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-2
                              text-xs
                              ${
                                pkg.status === "Dispatched"
                                  ? "text-emerald-400"
                                  : pkg.status === "Ready"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                              }
                            `}
                          >

                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {pkg.status}

                          </span>

                        </td>

                        <td className="px-6 py-5 text-xs text-slate-600">
                          {pkg.date}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </section>


            {/* QUICK ACTIONS */}
            <section className="border border-white/10 bg-[#090909]">

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                  QUICK ACTIONS
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Warehouse Control
                </h2>

              </div>


              <div className="space-y-3 p-5">

                  <Link
  to="/warehouse/receive"
  className="
    group
    block
    w-full
    border
    border-white/10
    bg-white/[0.02]
    p-5
    text-left
    transition
    hover:border-red-500/40
  "
> 


                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-semibold">
                        Receive Package
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Add incoming package
                      </p>

                    </div>

                    <span className="text-lg text-red-500">
                      →
                    </span>

                  </div>

                </Link>


                <button
                  type="button"
                  className="
                    group
                    w-full
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                    text-left
                    transition
                    hover:border-red-500/40
                  "
                >

                  <div className="flex items-center justify-between">

                    

       <Link
  to="/warehouse/receive"
  className="
    group
    block
    w-full
    border
    border-white/10
    bg-white/[0.02]
    p-5
    text-left
    transition
    hover:border-red-500/40
  "
> 


                  

                    <div>

                      <p className="text-sm font-semibold">
                        Scan Package
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Scan package barcode
                      </p>

                    </div>
                </Link>

                    

                    <span className="text-lg text-red-500">
                      →
                    </span>

                  </div>

                </button>


                <button
                  type="button"
                  className="
                    group
                    w-full
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                    text-left
                    transition
                    hover:border-red-500/40
                  "
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-semibold">
                        Dispatch Package
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Send package to distributor
                      </p>

                    </div>

                    <span className="text-lg text-red-500">
                      →
                    </span>

                  </div>

                </button>

              </div>


              {/* STATUS */}
              <div className="mx-5 mb-5 border border-white/5 bg-black/30 p-4">

                <div className="flex items-center gap-2">

                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-400
                      shadow-[0_0_10px_rgba(52,211,153,0.7)]
                    "
                  />

                  <span className="text-xs font-semibold text-emerald-400">
                    WAREHOUSE ONLINE
                  </span>

                </div>

                <p className="mt-2 text-[10px] text-slate-600">
                  Warehouse operations are running normally.
                </p>

              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}

export default WarehouseDashboard;