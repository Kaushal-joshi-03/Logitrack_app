import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";

function ReceivePackage() {
  const [formData, setFormData] = useState({
    packageId: "",
    origin: "",
    destination: "",
    packageType: "",
    weight: "",
  });

  const [received, setReceived] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReceive = (e) => {
    e.preventDefault();

    if (
      !formData.packageId ||
      !formData.origin ||
      !formData.destination ||
      !formData.packageType ||
      !formData.weight
    ) {
      return;
    }

    // Frontend only for now
    setReceived(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* NAVBAR */}
      <Navbar showLogout={true} />

      <main
        className="
          min-h-[calc(100vh-76px)]
          bg-[#050505]
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

        <div className="mx-auto max-w-[1000px]">

          {/* BACK */}
          <Link
            to="/warehouse"
            className="
              mb-8
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition
              hover:text-white
            "
          >
            <span className="text-xl">←</span>
            Back to Warehouse
          </Link>


          {/* HEADER */}
          <div className="mb-8">

            <p className="mb-2 text-xs font-bold tracking-[0.3em] text-red-500">
              WAREHOUSE CONTROL
            </p>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Receive Package
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Register an incoming package and confirm that it has been
              received by the warehouse.
            </p>

          </div>


          {/* FORM */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              border
              border-white/10
              bg-[#090909]
            "
          >

            {/* FORM HEADER */}
            <div className="border-b border-white/10 px-6 py-5">

              <p className="text-xs font-bold tracking-[0.2em] text-red-500">
                PACKAGE INTAKE
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Package Information
              </h2>

            </div>


            <form onSubmit={handleReceive}>

              <div className="grid gap-6 px-6 py-7 md:grid-cols-2">

                {/* PACKAGE ID */}
                <div>

                  <label className="text-xs font-semibold text-slate-300">
                    Package ID
                  </label>

                  <div
                    className="
                      mt-2
                      flex
                      h-[54px]
                      items-center
                      border
                      border-white/10
                      bg-black
                      px-4
                      focus-within:border-red-500/50
                    "
                  >

                    <span className="mr-3 text-red-500">
                      #
                    </span>

                    <input
                      type="text"
                      name="packageId"
                      value={formData.packageId}
                      onChange={handleChange}
                      placeholder="e.g. PKG-10294"
                      className="
                        w-full
                        bg-transparent
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-slate-600
                      "
                    />

                  </div>

                </div>


                {/* PACKAGE TYPE */}
                <div>

                  <label className="text-xs font-semibold text-slate-300">
                    Package Type
                  </label>

                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleChange}
                    className="
                      mt-2
                      h-[54px]
                      w-full
                      border
                      border-white/10
                      bg-black
                      px-4
                      text-sm
                      text-white
                      outline-none
                      focus:border-red-500/50
                    "
                  >

                    <option value="" className="bg-black">
                      Select package type
                    </option>

                    <option value="Parcel" className="bg-black">
                      Parcel
                    </option>

                    <option value="Electronics" className="bg-black">
                      Electronics
                    </option>

                    <option value="Document" className="bg-black">
                      Document
                    </option>

                    <option value="Fragile" className="bg-black">
                      Fragile
                    </option>

                  </select>

                </div>


                {/* ORIGIN */}
                <div>

                  <label className="text-xs font-semibold text-slate-300">
                    Origin
                  </label>

                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="e.g. Delhi"
                    className="
                      mt-2
                      h-[54px]
                      w-full
                      border
                      border-white/10
                      bg-black
                      px-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      focus:border-red-500/50
                    "
                  />

                </div>


                {/* DESTINATION */}
                <div>

                  <label className="text-xs font-semibold text-slate-300">
                    Destination
                  </label>

                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    className="
                      mt-2
                      h-[54px]
                      w-full
                      border
                      border-white/10
                      bg-black
                      px-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      focus:border-red-500/50
                    "
                  />

                </div>


                {/* WEIGHT */}
                <div className="md:col-span-2">

                  <label className="text-xs font-semibold text-slate-300">
                    Package Weight
                  </label>

                  <div className="mt-2 flex">

                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Enter package weight"
                      className="
                        h-[54px]
                        w-full
                        border
                        border-white/10
                        bg-black
                        px-4
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-slate-600
                        focus:border-red-500/50
                      "
                    />

                    <div
                      className="
                        flex
                        h-[54px]
                        w-[70px]
                        items-center
                        justify-center
                        border-y
                        border-r
                        border-white/10
                        bg-white/[0.03]
                        text-xs
                        text-slate-500
                      "
                    >
                      KG
                    </div>

                  </div>

                </div>

              </div>


              {/* RECEIVE BUTTON */}

              <div className="border-t border-white/10 px-6 py-5">

                <button
                  type="submit"
                  className="
                    flex
                    h-[54px]
                    w-full
                    items-center
                    justify-center
                    bg-red-500
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-red-600
                    active:scale-[0.99]
                  "
                >
                  RECEIVE PACKAGE

                  <span className="ml-3 text-lg">
                    →
                  </span>

                </button>

              </div>

            </form>

          </motion.section>


          {/* SUCCESS */}

          {received && (

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                mt-6
                border
                border-emerald-500/20
                bg-emerald-500/[0.04]
                p-6
              "
            >

              <div className="flex items-center gap-3">

                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-500/10
                    text-emerald-400
                  "
                >
                  ✓
                </span>

                <div>

                  <p className="text-sm font-semibold text-emerald-400">
                    Package Received Successfully
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formData.packageId.toUpperCase()} has been added to
                    the warehouse.
                  </p>

                </div>

              </div>

            </motion.div>

          )}


          {/* SYSTEM STATUS */}

          <div className="mt-6 border border-white/5 bg-[#090909] p-5">

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
              Package receiving service is ready.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ReceivePackage;